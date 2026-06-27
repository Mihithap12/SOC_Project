package com.farmercustomer.orderservice.service;

import com.farmercustomer.orderservice.entity.Order;
import com.farmercustomer.orderservice.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

/**
 * Saga Orchestrator for coordinating Order Placement transactions.
 * 
 * DESIGN FOR CAMUNDA BPMN WORKFLOW:
 * In a Camunda-managed microservices deployment, this orchestrator's stages 
 * map to Zeebe Service Tasks. In Camunda BPMN, you would design a workflow:
 * 1. Service Task: Reserve Inventory (Job Worker: "reserve-inventory")
 * 2. Service Task: Process Payment (Job Worker: "process-payment")
 * 3. Service Task: Dispatch Transport (Job Worker: "dispatch-transport")
 * 
 * Standard boundary error events would catch failures and trigger compensation tasks:
 * - Release Inventory ("release-inventory")
 * - Refund Payment ("refund-payment")
 */
@Service
public class OrderSagaOrchestrator {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${services.marketplace.url}")
    private String marketplaceUrl;

    @Value("${services.payment.url}")
    private String paymentUrl;

    @Value("${services.transport.url}")
    private String transportUrl;

    @Value("${services.notification.url}")
    private String notificationUrl;

    public Order executeOrderSaga(Order order) {
        // Step 1: Save Order in PENDING status
        order.setStatus("PENDING");
        Order savedOrder = orderRepository.save(order);

        Double oldQuantity = 0.0;
        Double pricePerKg = 0.0;
        Long farmerId = null;
        String cropName = "";

        // --- STAGE 1: Reserve Inventory (Marketplace Service) ---
        try {
            // Fetch product listing
            ResponseEntity<Map> productResp = restTemplate.getForEntity(
                    marketplaceUrl + "/" + order.getListingId(), Map.class);
            
            if (!productResp.getStatusCode().is2xxSuccessful() || productResp.getBody() == null) {
                throw new RuntimeException("Product listing not found");
            }

            Map product = productResp.getBody();
            oldQuantity = ((Number) product.get("quantity")).doubleValue();
            pricePerKg = ((Number) product.get("pricePerKg")).doubleValue();
            farmerId = ((Number) product.get("farmerId")).longValue();
            cropName = (String) product.get("cropName");
            String status = (String) product.get("status");

            if (!"AVAILABLE".equals(status) || oldQuantity < order.getQuantity()) {
                throw new RuntimeException("Insufficient inventory or product not available");
            }

            // Calculate total price
            double totalPrice = pricePerKg * order.getQuantity();
            savedOrder.setTotalPrice(totalPrice);
            savedOrder = orderRepository.save(savedOrder);

            // Reserve quantity (update marketplace status/quantity)
            double newQuantity = oldQuantity - order.getQuantity();
            String newStatus = newQuantity <= 0 ? "SOLD" : "AVAILABLE";
            
            restTemplate.put(marketplaceUrl + "/" + order.getListingId() + 
                    "/status?status=" + newStatus + "&quantity=" + newQuantity, null);

        } catch (Exception e) {
            savedOrder.setStatus("CANCELLED");
            orderRepository.save(savedOrder);
            sendNotification(order.getBuyerId(), "Order failed: Inventory allocation issue. " + e.getMessage());
            return savedOrder;
        }

        // --- STAGE 2: Process Payment (Payment Service) ---
        String transactionId = null;
        try {
            Map<String, Object> paymentReq = new HashMap<>();
            paymentReq.put("orderId", savedOrder.getId());
            paymentReq.put("buyerId", savedOrder.getBuyerId());
            paymentReq.put("amount", savedOrder.getTotalPrice());

            ResponseEntity<Map> paymentResp = restTemplate.postForEntity(
                    paymentUrl + "/charge", paymentReq, Map.class);

            if (paymentResp.getStatusCode().is2xxSuccessful() && paymentResp.getBody() != null) {
                Map paymentBody = paymentResp.getBody();
                Boolean success = (Boolean) paymentBody.get("success");
                if (Boolean.TRUE.equals(success)) {
                    transactionId = (String) paymentBody.get("transactionId");
                    savedOrder.setPaymentTransactionId(transactionId);
                    savedOrder.setStatus("PAID");
                    savedOrder = orderRepository.save(savedOrder);
                } else {
                    throw new RuntimeException("Payment card declined");
                }
            } else {
                throw new RuntimeException("Payment Service unreachable");
            }

        } catch (Exception e) {
            // Rollback inventory reservation (Compensation)
            try {
                restTemplate.put(marketplaceUrl + "/" + order.getListingId() + 
                        "/status?status=AVAILABLE&quantity=" + oldQuantity, null);
            } catch (Exception ex) {
                // In production, queue this for manual recovery
            }

            savedOrder.setStatus("CANCELLED");
            orderRepository.save(savedOrder);
            sendNotification(order.getBuyerId(), "Order failed: Payment issue. " + e.getMessage());
            return savedOrder;
        }

        // --- STAGE 3: Dispatch Transport (Transport Service) ---
        try {
            Map<String, Object> transportReq = new HashMap<>();
            transportReq.put("orderId", savedOrder.getId());
            transportReq.put("buyerId", savedOrder.getBuyerId());
            transportReq.put("address", savedOrder.getShippingAddress());

            ResponseEntity<Map> transportResp = restTemplate.postForEntity(
                    transportUrl + "/dispatch", transportReq, Map.class);

            if (transportResp.getStatusCode().is2xxSuccessful() && transportResp.getBody() != null) {
                Map transportBody = transportResp.getBody();
                String trackingNumber = (String) transportBody.get("trackingNumber");
                savedOrder.setTransportTrackingNumber(trackingNumber);
                savedOrder.setStatus("SHIPPING");
                savedOrder = orderRepository.save(savedOrder);
            } else {
                throw new RuntimeException("Transport Service did not return tracking number");
            }

        } catch (Exception e) {
            // Compensation: Refund Payment
            try {
                Map<String, Object> refundReq = new HashMap<>();
                refundReq.put("transactionId", transactionId);
                restTemplate.postForEntity(paymentUrl + "/refund", refundReq, Map.class);
            } catch (Exception ex) {
                // Queue for manual verification
            }

            // Compensation: Rollback Inventory
            try {
                restTemplate.put(marketplaceUrl + "/" + order.getListingId() + 
                        "/status?status=AVAILABLE&quantity=" + oldQuantity, null);
            } catch (Exception ex) {
                // Queue for manual verification
            }

            savedOrder.setStatus("CANCELLED");
            orderRepository.save(savedOrder);
            sendNotification(order.getBuyerId(), "Order failed: Logistics dispatch error. " + e.getMessage());
            return savedOrder;
        }

        // --- Success Notification ---
        sendNotification(savedOrder.getBuyerId(), "Order placed successfully! Tracking #: " + savedOrder.getTransportTrackingNumber());
        if (farmerId != null) {
            sendNotification(farmerId, "Your crop '" + cropName + "' has been purchased! Quantity: " + order.getQuantity() + "kg");
        }

        return savedOrder;
    }

    private void sendNotification(Long userId, String message) {
        try {
            Map<String, Object> notifyReq = new HashMap<>();
            notifyReq.put("userId", userId);
            notifyReq.put("message", message);
            restTemplate.postForEntity(notificationUrl + "/send", notifyReq, Map.class);
        } catch (Exception e) {
            // Notifications are non-blocking; order is still valid even if notification fails
        }
    }
}
