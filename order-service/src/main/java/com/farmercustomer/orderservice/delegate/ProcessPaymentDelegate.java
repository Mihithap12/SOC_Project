package com.farmercustomer.orderservice.delegate;

import com.farmercustomer.orderservice.entity.Order;
import com.farmercustomer.orderservice.repository.OrderRepository;
import org.camunda.bpm.engine.delegate.BpmnError;
import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component("processPaymentDelegate")
public class ProcessPaymentDelegate implements JavaDelegate {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private OrderRepository orderRepository;

    @Value("${services.payment.url}")
    private String paymentUrl;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        Long orderId = (Long) execution.getVariable("orderId");
        Long buyerId = (Long) execution.getVariable("buyerId");
        Double totalPrice = (Double) execution.getVariable("totalPrice");

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BpmnError("PAYMENT_FAILED", "Order not found"));

        try {
            Map<String, Object> paymentReq = new HashMap<>();
            paymentReq.put("orderId", orderId);
            paymentReq.put("buyerId", buyerId);
            paymentReq.put("amount", totalPrice);

            ResponseEntity<Map> paymentResp = restTemplate.postForEntity(paymentUrl + "/charge", paymentReq, Map.class);
            if (paymentResp.getStatusCode().is2xxSuccessful() && paymentResp.getBody() != null) {
                Map paymentBody = paymentResp.getBody();
                Boolean success = (Boolean) paymentBody.get("success");
                if (Boolean.TRUE.equals(success)) {
                    String transactionId = (String) paymentBody.get("transactionId");
                    order.setPaymentTransactionId(transactionId);
                    order.setStatus("PAID");
                    orderRepository.save(order);

                    execution.setVariable("transactionId", transactionId);
                    System.out.println(">>> [Camunda Delegate] Payment processing succeeded. Tx ID: " + transactionId);
                } else {
                    throw new RuntimeException("Payment card declined");
                }
            } else {
                throw new RuntimeException("Payment Service unreachable");
            }
        } catch (Exception e) {
            order.setStatus("CANCELLED");
            orderRepository.save(order);
            throw new BpmnError("PAYMENT_FAILED", "Payment charging failed: " + e.getMessage());
        }
    }
}
