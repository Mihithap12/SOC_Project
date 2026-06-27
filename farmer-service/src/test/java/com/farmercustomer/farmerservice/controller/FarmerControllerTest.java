package com.farmercustomer.farmerservice.controller;

import com.farmercustomer.farmerservice.entity.Farmer;
import com.farmercustomer.farmerservice.repository.FarmerRepository;
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
class FarmerControllerTest {

    @Mock
    private FarmerRepository farmerRepository;

    @InjectMocks
    private FarmerController farmerController;

    private Farmer farmer;

    @BeforeEach
    void setUp() {
        farmer = new Farmer();
        farmer.setId(1L);
        farmer.setUserId(20L);
        farmer.setFarmName("Green Fields");
        farmer.setFarmLocation("Kandy, LK");
        farmer.setFarmSize(2.5);
        farmer.setPrimaryCrop("Tea");
        farmer.setContactNumber("0777654321");
    }

    @Test
    void getAllFarmers_Success() {
        when(farmerRepository.findAll()).thenReturn(List.of(farmer));

        ResponseEntity<List<Farmer>> response = farmerController.getAllFarmers();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getFarmerByUserId_Found() {
        when(farmerRepository.findByUserId(20L)).thenReturn(Optional.of(farmer));

        ResponseEntity<?> response = farmerController.getFarmerByUserId(20L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(farmer, response.getBody());
    }

    @Test
    void getFarmerByUserId_NotFound() {
        when(farmerRepository.findByUserId(20L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = farmerController.getFarmerByUserId(20L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void saveOrUpdateFarmer_CreateNew() {
        when(farmerRepository.findByUserId(20L)).thenReturn(Optional.empty());
        when(farmerRepository.save(farmer)).thenReturn(farmer);

        ResponseEntity<Farmer> response = farmerController.saveOrUpdateFarmer(farmer);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(farmer, response.getBody());
        verify(farmerRepository, times(1)).save(farmer);
    }

    @Test
    void saveOrUpdateFarmer_UpdateExisting() {
        Farmer existingFarmer = new Farmer();
        existingFarmer.setId(1L);
        existingFarmer.setUserId(20L);
        existingFarmer.setFarmName("Old Fields");

        when(farmerRepository.findByUserId(20L)).thenReturn(Optional.of(existingFarmer));
        when(farmerRepository.save(any(Farmer.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<Farmer> response = farmerController.saveOrUpdateFarmer(farmer);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Green Fields", response.getBody().getFarmName());
        verify(farmerRepository, times(1)).save(existingFarmer);
    }
}
