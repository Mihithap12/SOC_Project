package com.farmercustomer.priceservice.repository;

import com.farmercustomer.priceservice.entity.CropPrice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CropPriceRepository extends JpaRepository<CropPrice, Long> {
    Optional<CropPrice> findByCropName(String cropName);
}
