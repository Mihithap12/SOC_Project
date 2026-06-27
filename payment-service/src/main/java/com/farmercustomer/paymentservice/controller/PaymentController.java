package com.farmercustomer.paymentservice.controller;

import com.farmercustomer.paymentservice.entity.Transaction;
import com.farmercustomer.paymentservice.repository.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {

    @Autowired
    private TransactionRepository transactionRepository;

    @PostMapping("/charge")
    public ResponseEntity<?> chargeCard(@RequestBody Map<String, Object> request) {
        Long orderId = ((Number) request.get("orderId")).longValue();
        Long buyerId = ((Number) request.get("buyerId")).longValue();
        Double amount = ((Number) request.get("amount")).doubleValue();

        Transaction tx = new Transaction();
        tx.setOrderId(orderId);
        tx.setBuyerId(buyerId);
        tx.setAmount(amount);
        tx.setTimestamp(LocalDateTime.now().toString());

        Map<String, Object> response = new HashMap<>();

        // Failure simulation: Amount over 1,000,000 fails (for Saga testing)
        if (amount > 1000000.0) {
            tx.setStatus("FAILED");
            tx.setTransactionId("FAIL-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
            transactionRepository.save(tx);
            response.put("success", false);
            response.put("message", "Insufficient funds - simulated limit exceeded");
            return ResponseEntity.ok(response);
        }

        tx.setStatus("PAID");
        String txId = "TX-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        tx.setTransactionId(txId);
        transactionRepository.save(tx);

        response.put("success", true);
        response.put("transactionId", txId);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/refund")
    public ResponseEntity<?> refund(@RequestBody Map<String, String> request) {
        String transactionId = request.get("transactionId");
        Optional<Transaction> txOpt = transactionRepository.findByTransactionId(transactionId);
        
        Map<String, Object> response = new HashMap<>();
        if (txOpt.isPresent()) {
            Transaction tx = txOpt.get();
            tx.setStatus("REFUNDED");
            transactionRepository.save(tx);
            response.put("success", true);
            response.put("message", "Refund processed successfully");
            return ResponseEntity.ok(response);
        }

        response.put("success", false);
        response.put("message", "Transaction not found");
        return ResponseEntity.ok(response);
    }
}
