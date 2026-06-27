package com.farmercustomer.marketplaceservice.controller;

import com.farmercustomer.marketplaceservice.entity.ProductListing;
import com.farmercustomer.marketplaceservice.repository.ProductListingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/marketplace/products")
@CrossOrigin(origins = "*")
public class MarketplaceController {

    @Autowired
    private ProductListingRepository productListingRepository;

    @GetMapping
    public ResponseEntity<List<ProductListing>> getListings(@RequestParam(value = "status", required = false) String status) {
        if (status != null) {
            return ResponseEntity.ok(productListingRepository.findByStatus(status));
        }
        return ResponseEntity.ok(productListingRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductListing> getListingById(@PathVariable("id") Long id) {
        Optional<ProductListing> listingOpt = productListingRepository.findById(id);
        return listingOpt.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<ProductListing>> getListingsByFarmer(@PathVariable("farmerId") Long farmerId) {
        return ResponseEntity.ok(productListingRepository.findByFarmerId(farmerId));
    }

    @PostMapping
    public ResponseEntity<ProductListing> createListing(@RequestBody ProductListing listing) {
        if (listing.getStatus() == null) {
            listing.setStatus("AVAILABLE");
        }
        return ResponseEntity.ok(productListingRepository.save(listing));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(@PathVariable("id") Long id, @RequestParam("status") String status, @RequestParam(value = "quantity", required = false) Double quantity) {
        Optional<ProductListing> listingOpt = productListingRepository.findById(id);
        if (listingOpt.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        ProductListing listing = listingOpt.get();
        listing.setStatus(status);
        if (quantity != null) {
            listing.setQuantity(quantity);
        }
        return ResponseEntity.ok(productListingRepository.save(listing));
    }
}
