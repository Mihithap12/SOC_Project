package com.farmercustomer.orderservice.delegate;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

@Component("releaseInventoryDelegate")
public class ReleaseInventoryDelegate implements JavaDelegate {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${services.marketplace.url}")
    private String marketplaceUrl;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        Long listingId = (Long) execution.getVariable("listingId");
        Double oldQuantity = (Double) execution.getVariable("oldQuantity");

        if (listingId != null && oldQuantity != null) {
            try {
                restTemplate.put(marketplaceUrl + "/" + listingId + "/status?status=AVAILABLE&quantity=" + oldQuantity, null);
                System.out.println(">>> [Camunda Compensation] Released inventory reservation for Listing ID: " + listingId);
            } catch (Exception e) {
                System.err.println(">>> [Camunda Compensation Error] Failed to release inventory: " + e.getMessage());
            }
        }
    }
}
