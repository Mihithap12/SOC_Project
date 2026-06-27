package com.farmercustomer.priceservice.controller;

import com.farmercustomer.priceservice.entity.CropPrice;
import com.farmercustomer.priceservice.repository.CropPriceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/prices")
@CrossOrigin(origins = "*")
public class PriceController {

    @Autowired
    private CropPriceRepository cropPriceRepository;

    @GetMapping
    public ResponseEntity<List<CropPrice>> getAllPrices() {
        return ResponseEntity.ok(cropPriceRepository.findAll());
    }

    @GetMapping("/{cropName}")
    public ResponseEntity<?> getPriceByCropName(@PathVariable("cropName") String cropName) {
        Optional<CropPrice> priceOpt = cropPriceRepository.findByCropName(cropName);
        if (priceOpt.isPresent()) {
            return ResponseEntity.ok(priceOpt.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/update")
    public ResponseEntity<CropPrice> updatePrice(@RequestBody CropPrice cropPrice) {
        String nowStr = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
        Optional<CropPrice> existingOpt = cropPriceRepository.findByCropName(cropPrice.getCropName());
        
        if (existingOpt.isPresent()) {
            CropPrice existing = existingOpt.get();
            existing.setYesterdayPricePerKg(existing.getCurrentPricePerKg());
            existing.setCurrentPricePerKg(cropPrice.getCurrentPricePerKg());
            existing.setLastUpdated(nowStr);
            return ResponseEntity.ok(cropPriceRepository.save(existing));
        } else {
            cropPrice.setYesterdayPricePerKg(cropPrice.getCurrentPricePerKg());
            cropPrice.setLastUpdated(nowStr);
            return ResponseEntity.ok(cropPriceRepository.save(cropPrice));
        }
    }
}
