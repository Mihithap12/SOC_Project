package com.farmercustomer.orderservice.service;

import com.farmercustomer.orderservice.entity.Order;
import com.farmercustomer.orderservice.repository.OrderRepository;
import org.camunda.bpm.engine.RuntimeService;
import org.camunda.bpm.engine.runtime.ProcessInstance;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * Saga Orchestrator using Camunda BPMN Workflow Engine.
 * 
 * Camunda Process Definition: order-saga.bpmn
 * Process Key: "OrderSagaProcess"
 */
@Service
public class OrderSagaOrchestrator {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Autowired(required = false)
    private RuntimeService runtimeService;

    @Value("${services.marketplace.url}")
    private String marketplaceUrl;

    @Value("${services.payment.url}")
    private String paymentUrl;

    @Value("${services.transport.url}")
    private String transportUrl;

    @Value("${services.notification.url}")
    private String notificationUrl;

    public Order executeOrderSaga(Order order) {
        order.setStatus("PENDING");
        Order savedOrder = orderRepository.save(order);

        // If Camunda Engine is running, trigger Camunda BPMN Saga Process Instance
        if (runtimeService != null) {
            try {
                Map<String, Object> variables = new HashMap<>();
                variables.put("orderId", savedOrder.getId());
                variables.put("listingId", savedOrder.getListingId());
                variables.put("quantity", savedOrder.getQuantity());
                variables.put("buyerId", savedOrder.getBuyerId());
                variables.put("shippingAddress", savedOrder.getShippingAddress() != null ? savedOrder.getShippingAddress() : "Default Address");

                ProcessInstance instance = runtimeService.startProcessInstanceByKey("OrderSagaProcess", variables);
                System.out.println(">>> [Camunda Engine] Started Order Saga Process Instance ID: " + instance.getId());

                return orderRepository.findById(savedOrder.getId()).orElse(savedOrder);
            } catch (Exception e) {
                System.err.println(">>> [Camunda Engine Warning] Falling back to manual saga execution: " + e.getMessage());
            }
        }

        // Fallback Manual Saga Execution if Camunda Engine is unavailable
        return executeManualSaga(savedOrder);
    }

    private Order executeManualSaga(Order savedOrder) {
        Double oldQuantity = 0.0;
        Double pricePerKg = 0.0;
        Long farmerId = null;
        String cropName = "";

        // Stage 1: Reserve Inventory
        try {
            ResponseEntity<Map> productResp = restTemplate.getForEntity(marketplaceUrl + "/" + savedOrder.getListingId(), Map.class);
            if (!productResp.getStatusCode().is2xxSuccessful() || productResp.getBody() == null) {
                throw new RuntimeException("Product listing not found");
            }

            Map product = productResp.getBody();
            oldQuantity = ((Number) product.get("quantity")).doubleValue();
            pricePerKg = ((Number) product.get("pricePerKg")).doubleValue();
            farmerId = ((Number) product.get("farmerId")).longValue();
            cropName = (String) product.get("cropName");
            String status = (String) product.get("status");

            if (!"AVAILABLE".equals(status) || oldQuantity < savedOrder.getQuantity()) {
                throw new RuntimeException("Insufficient inventory");
            }

            double totalPrice = pricePerKg * savedOrder.getQuantity();
            savedOrder.setTotalPrice(totalPrice);
            savedOrder = orderRepository.save(savedOrder);

            double newQuantity = oldQuantity - savedOrder.getQuantity();
            String newStatus = newQuantity <= 0 ? "SOLD" : "AVAILABLE";
            restTemplate.put(marketplaceUrl + "/" + savedOrder.getListingId() + "/status?status=" + newStatus + "&quantity=" + newQuantity, null);
        } catch (Exception e) {
            savedOrder.setStatus("CANCELLED");
            return orderRepository.save(savedOrder);
        }

        // Stage 2: Payment
        String transactionId = null;
        try {
            Map<String, Object> paymentReq = new HashMap<>();
            paymentReq.put("orderId", savedOrder.getId());
            paymentReq.put("buyerId", savedOrder.getBuyerId());
            paymentReq.put("amount", savedOrder.getTotalPrice());

            ResponseEntity<Map> paymentResp = restTemplate.postForEntity(paymentUrl + "/charge", paymentReq, Map.class);
            if (paymentResp.getStatusCode().is2xxSuccessful() && paymentResp.getBody() != null) {
                Map paymentBody = paymentResp.getBody();
                Boolean success = (Boolean) paymentBody.get("success");
                if (Boolean.TRUE.equals(success)) {
                    transactionId = (String) paymentBody.get("transactionId");
                    savedOrder.setPaymentTransactionId(transactionId);
                    savedOrder.setStatus("PAID");
                    savedOrder = orderRepository.save(savedOrder);
                } else {
                    throw new RuntimeException("Payment declined");
                }
            }
        } catch (Exception e) {
            // Compensation: Release inventory
            restTemplate.put(marketplaceUrl + "/" + savedOrder.getListingId() + "/status?status=AVAILABLE&quantity=" + oldQuantity, null);
            savedOrder.setStatus("CANCELLED");
            return orderRepository.save(savedOrder);
        }

        // Stage 3: Transport
        try {
            Map<String, Object> transportReq = new HashMap<>();
            transportReq.put("orderId", savedOrder.getId());
            transportReq.put("buyerId", savedOrder.getBuyerId());
            transportReq.put("address", savedOrder.getShippingAddress());

            ResponseEntity<Map> transportResp = restTemplate.postForEntity(transportUrl + "/dispatch", transportReq, Map.class);
            if (transportResp.getStatusCode().is2xxSuccessful() && transportResp.getBody() != null) {
                Map transportBody = transportResp.getBody();
                savedOrder.setTransportTrackingNumber((String) transportBody.get("trackingNumber"));
                savedOrder.setStatus("SHIPPING");
                savedOrder = orderRepository.save(savedOrder);
            }
        } catch (Exception e) {
            // Compensations
            Map<String, Object> refundReq = new HashMap<>();
            refundReq.put("transactionId", transactionId);
            restTemplate.postForEntity(paymentUrl + "/refund", refundReq, Map.class);
            restTemplate.put(marketplaceUrl + "/" + savedOrder.getListingId() + "/status?status=AVAILABLE&quantity=" + oldQuantity, null);
            savedOrder.setStatus("CANCELLED");
            return orderRepository.save(savedOrder);
        }

        return savedOrder;
    }
}
