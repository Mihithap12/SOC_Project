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

import java.util.Map;

@Component("reserveInventoryDelegate")
public class ReserveInventoryDelegate implements JavaDelegate {

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    private OrderRepository orderRepository;

    @Value("${services.marketplace.url}")
    private String marketplaceUrl;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        Long orderId = (Long) execution.getVariable("orderId");
        Long listingId = (Long) execution.getVariable("listingId");
        Double quantity = (Double) execution.getVariable("quantity");

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new BpmnError("INVENTORY_FAILED", "Order not found"));

        try {
            ResponseEntity<Map> productResp = restTemplate.getForEntity(marketplaceUrl + "/" + listingId, Map.class);
            if (!productResp.getStatusCode().is2xxSuccessful() || productResp.getBody() == null) {
                throw new RuntimeException("Product listing not found");
            }

            Map product = productResp.getBody();
            Double oldQuantity = ((Number) product.get("quantity")).doubleValue();
            Double pricePerKg = ((Number) product.get("pricePerKg")).doubleValue();
            String status = (String) product.get("status");

            if (!"AVAILABLE".equals(status) || oldQuantity < quantity) {
                throw new RuntimeException("Insufficient inventory or crop unavailable");
            }

            double totalPrice = pricePerKg * quantity;
            order.setTotalPrice(totalPrice);
            orderRepository.save(order);

            execution.setVariable("oldQuantity", oldQuantity);
            execution.setVariable("totalPrice", totalPrice);

            double newQuantity = oldQuantity - quantity;
            String newStatus = newQuantity <= 0 ? "SOLD" : "AVAILABLE";
            restTemplate.put(marketplaceUrl + "/" + listingId + "/status?status=" + newStatus + "&quantity=" + newQuantity, null);

            System.out.println(">>> [Camunda Delegate] Reserve Inventory succeeded for Order ID: " + orderId);
        } catch (Exception e) {
            order.setStatus("CANCELLED");
            orderRepository.save(order);
            throw new BpmnError("INVENTORY_FAILED", "Inventory reservation failed: " + e.getMessage());
        }
    }
}
