package com.farmercustomer.paymentservice.controller;

import com.farmercustomer.paymentservice.entity.Transaction;
import com.farmercustomer.paymentservice.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PaymentControllerTest {

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private PaymentController paymentController;

    private Transaction transaction;

    @BeforeEach
    void setUp() {
        transaction = new Transaction();
        transaction.setId(1L);
        transaction.setOrderId(100L);
        transaction.setBuyerId(10L);
        transaction.setAmount(500.0);
        transaction.setTransactionId("TX-12345");
        transaction.setStatus("PAID");
    }

    @Test
    void chargeCard_Success() {
        Map<String, Object> req = new HashMap<>();
        req.put("orderId", 100L);
        req.put("buyerId", 10L);
        req.put("amount", 500.0);

        when(transactionRepository.save(any(Transaction.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<?> response = paymentController.chargeCard(req);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals(true, body.get("success"));
        assertNotNull(body.get("transactionId"));
    }

    @Test
    void chargeCard_Failure_LimitExceeded() {
        Map<String, Object> req = new HashMap<>();
        req.put("orderId", 100L);
        req.put("buyerId", 10L);
        req.put("amount", 1000001.0); // > 1,000,000 fails

        when(transactionRepository.save(any(Transaction.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<?> response = paymentController.chargeCard(req);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals(false, body.get("success"));
        assertTrue(((String) body.get("message")).contains("Insufficient funds"));
    }

    @Test
    void refund_Success() {
        Map<String, String> req = new HashMap<>();
        req.put("transactionId", "TX-12345");

        when(transactionRepository.findByTransactionId("TX-12345")).thenReturn(Optional.of(transaction));
        when(transactionRepository.save(transaction)).thenReturn(transaction);

        ResponseEntity<?> response = paymentController.refund(req);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals(true, body.get("success"));
        assertEquals("REFUNDED", transaction.getStatus());
    }

    @Test
    void refund_NotFound() {
        Map<String, String> req = new HashMap<>();
        req.put("transactionId", "TX-UNKNOWN");

        when(transactionRepository.findByTransactionId("TX-UNKNOWN")).thenReturn(Optional.empty());

        ResponseEntity<?> response = paymentController.refund(req);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals(false, body.get("success"));
    }
}
