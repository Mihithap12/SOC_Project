package com.farmercustomer.marketplaceservice.controller;

import com.farmercustomer.marketplaceservice.entity.ProductListing;
import com.farmercustomer.marketplaceservice.repository.ProductListingRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MarketplaceControllerTest {

    @Mock
    private ProductListingRepository productListingRepository;

    @InjectMocks
    private MarketplaceController marketplaceController;

    private ProductListing listing;

    @BeforeEach
    void setUp() {
        listing = new ProductListing();
        listing.setId(100L);
        listing.setFarmerId(20L);
        listing.setCropName("Tea");
        listing.setQuantity(500.0);
        listing.setPricePerKg(12.5);
        listing.setStatus("AVAILABLE");
        listing.setDescription("Premium black tea");
    }

    @Test
    void getListings_NoStatus() {
        when(productListingRepository.findAll()).thenReturn(List.of(listing));

        ResponseEntity<List<ProductListing>> response = marketplaceController.getListings(null);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getListings_WithStatus() {
        when(productListingRepository.findByStatus("AVAILABLE")).thenReturn(List.of(listing));

        ResponseEntity<List<ProductListing>> response = marketplaceController.getListings("AVAILABLE");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getListingById_Found() {
        when(productListingRepository.findById(100L)).thenReturn(Optional.of(listing));

        ResponseEntity<ProductListing> response = marketplaceController.getListingById(100L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(listing, response.getBody());
    }

    @Test
    void getListingById_NotFound() {
        when(productListingRepository.findById(100L)).thenReturn(Optional.empty());

        ResponseEntity<ProductListing> response = marketplaceController.getListingById(100L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void getListingsByFarmer_Success() {
        when(productListingRepository.findByFarmerId(20L)).thenReturn(List.of(listing));

        ResponseEntity<List<ProductListing>> response = marketplaceController.getListingsByFarmer(20L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void createListing_WithStatus() {
        when(productListingRepository.save(listing)).thenReturn(listing);

        ResponseEntity<ProductListing> response = marketplaceController.createListing(listing);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(listing, response.getBody());
        assertEquals("AVAILABLE", response.getBody().getStatus());
    }

    @Test
    void createListing_NoStatus() {
        listing.setStatus(null);
        when(productListingRepository.save(any(ProductListing.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<ProductListing> response = marketplaceController.createListing(listing);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("AVAILABLE", response.getBody().getStatus());
    }

    @Test
    void updateStatus_Found() {
        when(productListingRepository.findById(100L)).thenReturn(Optional.of(listing));
        when(productListingRepository.save(listing)).thenReturn(listing);

        ResponseEntity<?> response = marketplaceController.updateStatus(100L, "SOLD", 0.0);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        ProductListing updated = (ProductListing) response.getBody();
        assertNotNull(updated);
        assertEquals("SOLD", updated.getStatus());
        assertEquals(0.0, updated.getQuantity());
    }

    @Test
    void updateStatus_NotFound() {
        when(productListingRepository.findById(100L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = marketplaceController.updateStatus(100L, "SOLD", 0.0);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
}
