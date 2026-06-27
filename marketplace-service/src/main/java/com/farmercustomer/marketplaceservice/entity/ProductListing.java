package com.farmercustomer.marketplaceservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "product_listings")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductListing {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long farmerId;

    private String farmerName;
    private String cropName;
    private String category;
    private Double quantity;
    private Double pricePerKg;
    private String description;
    private String status; // AVAILABLE, SOLD, CANCELLED
}
