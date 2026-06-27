package com.farmercustomer.buyerservice.controller;

import com.farmercustomer.buyerservice.entity.Buyer;
import com.farmercustomer.buyerservice.repository.BuyerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/buyers")
@CrossOrigin(origins = "*")
public class BuyerController {

    @Autowired
    private BuyerRepository buyerRepository;

    @GetMapping
    public ResponseEntity<List<Buyer>> getAllBuyers() {
        return ResponseEntity.ok(buyerRepository.findAll());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getBuyerByUserId(@PathVariable("userId") Long userId) {
        Optional<Buyer> buyerOpt = buyerRepository.findByUserId(userId);
        if (buyerOpt.isPresent()) {
            return ResponseEntity.ok(buyerOpt.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Buyer> saveOrUpdateBuyer(@RequestBody Buyer buyer) {
        Optional<Buyer> existingOpt = buyerRepository.findByUserId(buyer.getUserId());
        if (existingOpt.isPresent()) {
            Buyer existing = existingOpt.get();
            existing.setCompanyName(buyer.getCompanyName());
            existing.setBusinessLicense(buyer.getBusinessLicense());
            existing.setShippingAddress(buyer.getShippingAddress());
            existing.setContactNumber(buyer.getContactNumber());
            return ResponseEntity.ok(buyerRepository.save(existing));
        }
        return ResponseEntity.ok(buyerRepository.save(buyer));
    }
}
