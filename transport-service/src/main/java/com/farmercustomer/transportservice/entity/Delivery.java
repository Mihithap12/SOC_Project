package com.farmercustomer.transportservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "deliveries")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orderId;
    private Long buyerId;
    private String trackingNumber;
    private String status; // PENDING, EN_ROUTE, DELIVERED, RETURNED
    private String destinationAddress;
    private String driverName;
    private String vehicleNumber;
}
