package com.farmercustomer.priceservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "crop_prices")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CropPrice {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String cropName;

    private Double currentPricePerKg;
    private Double yesterdayPricePerKg;
    private String lastUpdated;
}
