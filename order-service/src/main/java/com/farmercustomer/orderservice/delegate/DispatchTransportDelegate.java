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

@Component("dispatchTransportDelegate")
public class DispatchTransportDelegate implements JavaDelegate {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private OrderRepository orderRepository;

    @Value("${services.transport.url}")
    private String transportUrl;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        Long orderId = (Long) execution.getVariable("orderId");
        Long buyerId = (Long) execution.getVariable("buyerId");
        String shippingAddress = (String) execution.getVariable("shippingAddress");

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BpmnError("TRANSPORT_FAILED", "Order not found"));

        try {
            Map<String, Object> transportReq = new HashMap<>();
            transportReq.put("orderId", orderId);
            transportReq.put("buyerId", buyerId);
            transportReq.put("address", shippingAddress);

            ResponseEntity<Map> transportResp = restTemplate.postForEntity(transportUrl + "/dispatch", transportReq, Map.class);
            if (transportResp.getStatusCode().is2xxSuccessful() && transportResp.getBody() != null) {
                Map transportBody = transportResp.getBody();
                String trackingNumber = (String) transportBody.get("trackingNumber");
                order.setTransportTrackingNumber(trackingNumber);
                order.setStatus("SHIPPING");
                orderRepository.save(order);

                execution.setVariable("trackingNumber", trackingNumber);
                System.out.println(">>> [Camunda Delegate] Dispatch Transport succeeded. Tracking #: " + trackingNumber);
            } else {
                throw new RuntimeException("Transport Service did not return tracking number");
            }
        } catch (Exception e) {
            order.setStatus("CANCELLED");
            orderRepository.save(order);
            throw new BpmnError("TRANSPORT_FAILED", "Logistics dispatch failed: " + e.getMessage());
        }
    }
}
