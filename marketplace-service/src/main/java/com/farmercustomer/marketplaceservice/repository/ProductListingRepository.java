package com.farmercustomer.marketplaceservice.repository;

import com.farmercustomer.marketplaceservice.entity.ProductListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductListingRepository extends JpaRepository<ProductListing, Long> {
    List<ProductListing> findByFarmerId(Long farmerId);
    List<ProductListing> findByStatus(String status);
}
