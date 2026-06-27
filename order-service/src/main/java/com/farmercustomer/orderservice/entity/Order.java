package com.farmercustomer.orderservice.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long buyerId;

    @Column(nullable = false)
    private Long listingId;

    private Double quantity;
    private Double totalPrice;
    private String status; // PENDING, PAID, SHIPPING, COMPLETED, CANCELLED, REFUNDED
    private String shippingAddress;
    private String paymentTransactionId;
    private String transportTrackingNumber;
}
