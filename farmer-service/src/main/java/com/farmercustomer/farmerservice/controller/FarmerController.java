package com.farmercustomer.farmerservice.controller;

import com.farmercustomer.farmerservice.entity.Farmer;
import com.farmercustomer.farmerservice.repository.FarmerRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/farmers")
@CrossOrigin(origins = "*")
public class FarmerController {

    @Autowired
    private FarmerRepository farmerRepository;

    @GetMapping
    public ResponseEntity<List<Farmer>> getAllFarmers() {
        return ResponseEntity.ok(farmerRepository.findAll());
    }

    @GetMapping("/{userId}")
    public ResponseEntity<?> getFarmerByUserId(@PathVariable("userId") Long userId) {
        Optional<Farmer> farmerOpt = farmerRepository.findByUserId(userId);
        if (farmerOpt.isPresent()) {
            return ResponseEntity.ok(farmerOpt.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping
    public ResponseEntity<Farmer> saveOrUpdateFarmer(@RequestBody Farmer farmer) {
        Optional<Farmer> existingOpt = farmerRepository.findByUserId(farmer.getUserId());
        if (existingOpt.isPresent()) {
            Farmer existing = existingOpt.get();
            existing.setFarmName(farmer.getFarmName());
            existing.setFarmLocation(farmer.getFarmLocation());
            existing.setFarmSize(farmer.getFarmSize());
            existing.setPrimaryCrop(farmer.getPrimaryCrop());
            existing.setContactNumber(farmer.getContactNumber());
            return ResponseEntity.ok(farmerRepository.save(existing));
        }
        return ResponseEntity.ok(farmerRepository.save(farmer));
    }
}
