package com.farmercustomer.buyerservice.controller;

import com.farmercustomer.buyerservice.entity.Buyer;
import com.farmercustomer.buyerservice.repository.BuyerRepository;
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
class BuyerControllerTest {

    @Mock
    private BuyerRepository buyerRepository;

    @InjectMocks
    private BuyerController buyerController;

    private Buyer buyer;

    @BeforeEach
    void setUp() {
        buyer = new Buyer();
        buyer.setId(1L);
        buyer.setUserId(10L);
        buyer.setCompanyName("Buyer Corp");
        buyer.setBusinessLicense("LIC-12345");
        buyer.setShippingAddress("Colombo, LK");
        buyer.setContactNumber("0771234567");
    }

    @Test
    void getAllBuyers_Success() {
        when(buyerRepository.findAll()).thenReturn(List.of(buyer));

        ResponseEntity<List<Buyer>> response = buyerController.getAllBuyers();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getBuyerByUserId_Found() {
        when(buyerRepository.findByUserId(10L)).thenReturn(Optional.of(buyer));

        ResponseEntity<?> response = buyerController.getBuyerByUserId(10L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(buyer, response.getBody());
    }

    @Test
    void getBuyerByUserId_NotFound() {
        when(buyerRepository.findByUserId(10L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = buyerController.getBuyerByUserId(10L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void saveOrUpdateBuyer_CreateNew() {
        when(buyerRepository.findByUserId(10L)).thenReturn(Optional.empty());
        when(buyerRepository.save(buyer)).thenReturn(buyer);

        ResponseEntity<Buyer> response = buyerController.saveOrUpdateBuyer(buyer);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(buyer, response.getBody());
        verify(buyerRepository, times(1)).save(buyer);
    }

    @Test
    void saveOrUpdateBuyer_UpdateExisting() {
        Buyer existingBuyer = new Buyer();
        existingBuyer.setId(1L);
        existingBuyer.setUserId(10L);
        existingBuyer.setCompanyName("Old Corp");

        when(buyerRepository.findByUserId(10L)).thenReturn(Optional.of(existingBuyer));
        when(buyerRepository.save(any(Buyer.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<Buyer> response = buyerController.saveOrUpdateBuyer(buyer);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Buyer Corp", response.getBody().getCompanyName());
        verify(buyerRepository, times(1)).save(existingBuyer);
    }
}
