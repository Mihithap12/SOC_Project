package com.farmercustomer.priceservice.controller;

import com.farmercustomer.priceservice.entity.CropPrice;
import com.farmercustomer.priceservice.repository.CropPriceRepository;
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
class PriceControllerTest {

    @Mock
    private CropPriceRepository cropPriceRepository;

    @InjectMocks
    private PriceController priceController;

    private CropPrice cropPrice;

    @BeforeEach
    void setUp() {
        cropPrice = new CropPrice();
        cropPrice.setId(1L);
        cropPrice.setCropName("Tea");
        cropPrice.setCurrentPricePerKg(15.0);
        cropPrice.setYesterdayPricePerKg(14.0);
        cropPrice.setLastUpdated("2026-06-27 18:00:00");
    }

    @Test
    void getAllPrices_Success() {
        when(cropPriceRepository.findAll()).thenReturn(List.of(cropPrice));

        ResponseEntity<List<CropPrice>> response = priceController.getAllPrices();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getPriceByCropName_Found() {
        when(cropPriceRepository.findByCropName("Tea")).thenReturn(Optional.of(cropPrice));

        ResponseEntity<?> response = priceController.getPriceByCropName("Tea");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(cropPrice, response.getBody());
    }

    @Test
    void getPriceByCropName_NotFound() {
        when(cropPriceRepository.findByCropName("Tea")).thenReturn(Optional.empty());

        ResponseEntity<?> response = priceController.getPriceByCropName("Tea");

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void updatePrice_Existing() {
        CropPrice updatedPrice = new CropPrice();
        updatedPrice.setCropName("Tea");
        updatedPrice.setCurrentPricePerKg(16.5);

        when(cropPriceRepository.findByCropName("Tea")).thenReturn(Optional.of(cropPrice));
        when(cropPriceRepository.save(cropPrice)).thenReturn(cropPrice);

        ResponseEntity<CropPrice> response = priceController.updatePrice(updatedPrice);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(16.5, response.getBody().getCurrentPricePerKg());
        assertEquals(15.0, response.getBody().getYesterdayPricePerKg());
        verify(cropPriceRepository, times(1)).save(cropPrice);
    }

    @Test
    void updatePrice_New() {
        CropPrice newPrice = new CropPrice();
        newPrice.setCropName("Coffee");
        newPrice.setCurrentPricePerKg(25.0);

        when(cropPriceRepository.findByCropName("Coffee")).thenReturn(Optional.empty());
        when(cropPriceRepository.save(any(CropPrice.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<CropPrice> response = priceController.updatePrice(newPrice);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Coffee", response.getBody().getCropName());
        assertEquals(25.0, response.getBody().getCurrentPricePerKg());
        assertEquals(25.0, response.getBody().getYesterdayPricePerKg());
    }
}
