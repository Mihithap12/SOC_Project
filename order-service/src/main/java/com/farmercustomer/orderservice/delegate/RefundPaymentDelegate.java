package com.farmercustomer.orderservice.delegate;

import org.camunda.bpm.engine.delegate.DelegateExecution;
import org.camunda.bpm.engine.delegate.JavaDelegate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component("refundPaymentDelegate")
public class RefundPaymentDelegate implements JavaDelegate {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${services.payment.url}")
    private String paymentUrl;

    @Override
    public void execute(DelegateExecution execution) throws Exception {
        String transactionId = (String) execution.getVariable("transactionId");

        if (transactionId != null) {
            try {
                Map<String, Object> refundReq = new HashMap<>();
                refundReq.put("transactionId", transactionId);
                restTemplate.postForEntity(paymentUrl + "/refund", refundReq, Map.class);
                System.out.println(">>> [Camunda Compensation] Refunded payment transaction ID: " + transactionId);
            } catch (Exception e) {
                System.err.println(">>> [Camunda Compensation Error] Failed to refund payment: " + e.getMessage());
            }
        }
    }
}
