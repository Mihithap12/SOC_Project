package com.farmercustomer.transportservice.controller;

import com.farmercustomer.transportservice.entity.Delivery;
import com.farmercustomer.transportservice.repository.DeliveryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransportControllerTest {

    @Mock
    private DeliveryRepository deliveryRepository;

    @InjectMocks
    private TransportController transportController;

    private Delivery delivery;

    @BeforeEach
    void setUp() {
        delivery = new Delivery();
        delivery.setId(1L);
        delivery.setOrderId(100L);
        delivery.setBuyerId(10L);
        delivery.setDestinationAddress("Colombo");
        delivery.setDriverName("Kamal Silva");
        delivery.setVehicleNumber("WP-GB-8821");
        delivery.setTrackingNumber("TRK-12345");
        delivery.setStatus("PENDING");
    }

    @Test
    void getAllDeliveries_Success() {
        when(deliveryRepository.findAll()).thenReturn(List.of(delivery));

        ResponseEntity<List<Delivery>> response = transportController.getAllDeliveries();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void dispatch_Success() {
        Map<String, Object> req = new HashMap<>();
        req.put("orderId", 100L);
        req.put("buyerId", 10L);
        req.put("address", "Colombo");

        when(deliveryRepository.save(any(Delivery.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<?> response = transportController.dispatch(req);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, String> body = (Map<String, String>) response.getBody();
        assertNotNull(body);
        assertNotNull(body.get("trackingNumber"));
        assertNotNull(body.get("driverName"));
        assertNotNull(body.get("vehicleNumber"));
        verify(deliveryRepository, times(1)).save(any(Delivery.class));
    }

    @Test
    void getStatusByOrderId_Found() {
        when(deliveryRepository.findByOrderId(100L)).thenReturn(Optional.of(delivery));

        ResponseEntity<?> response = transportController.getStatusByOrderId(100L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(delivery, response.getBody());
    }

    @Test
    void getStatusByOrderId_NotFound() {
        when(deliveryRepository.findByOrderId(100L)).thenReturn(Optional.empty());

        ResponseEntity<?> response = transportController.getStatusByOrderId(100L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void getStatusByTrackingNumber_Found() {
        when(deliveryRepository.findByTrackingNumber("TRK-12345")).thenReturn(Optional.of(delivery));

        ResponseEntity<?> response = transportController.getStatusByTrackingNumber("TRK-12345");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(delivery, response.getBody());
    }

    @Test
    void getStatusByTrackingNumber_NotFound() {
        when(deliveryRepository.findByTrackingNumber("TRK-UNKNOWN")).thenReturn(Optional.empty());

        ResponseEntity<?> response = transportController.getStatusByTrackingNumber("TRK-UNKNOWN");

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void updateStatus_Found() {
        when(deliveryRepository.findByTrackingNumber("TRK-12345")).thenReturn(Optional.of(delivery));
        when(deliveryRepository.save(delivery)).thenReturn(delivery);

        ResponseEntity<?> response = transportController.updateStatus("TRK-12345", "SHIPPED");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Delivery updated = (Delivery) response.getBody();
        assertNotNull(updated);
        assertEquals("SHIPPED", updated.getStatus());
    }

    @Test
    void updateStatus_NotFound() {
        when(deliveryRepository.findByTrackingNumber("TRK-UNKNOWN")).thenReturn(Optional.empty());

        ResponseEntity<?> response = transportController.updateStatus("TRK-UNKNOWN", "SHIPPED");

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }
}
