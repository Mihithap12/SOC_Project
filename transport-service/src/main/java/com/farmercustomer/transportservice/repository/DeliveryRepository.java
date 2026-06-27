package com.farmercustomer.transportservice.repository;

import com.farmercustomer.transportservice.entity.Delivery;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeliveryRepository extends JpaRepository<Delivery, Long> {
    Optional<Delivery> findByTrackingNumber(String trackingNumber);
    Optional<Delivery> findByOrderId(Long orderId);
}
