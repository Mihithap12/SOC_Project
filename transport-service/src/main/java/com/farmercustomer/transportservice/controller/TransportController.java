package com.farmercustomer.transportservice.controller;

import com.farmercustomer.transportservice.entity.Delivery;
import com.farmercustomer.transportservice.repository.DeliveryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/transport")
@CrossOrigin(origins = "*")
public class TransportController {

    @Autowired
    private DeliveryRepository deliveryRepository;

    private static final String[] DRIVERS = {"Sunil Perera", "Kamal Silva", "Nimal Fernando", "Ajith Bandara"};
    private static final String[] VEHICLES = {"WP-CAD-4929", "WP-GB-8821", "SP-LK-5530", "CP-DE-1102"};

    @GetMapping
    public ResponseEntity<List<Delivery>> getAllDeliveries() {
        return ResponseEntity.ok(deliveryRepository.findAll());
    }

    @PostMapping("/dispatch")
    public ResponseEntity<?> dispatch(@RequestBody Map<String, Object> request) {
        Long orderId = ((Number) request.get("orderId")).longValue();
        Long buyerId = ((Number) request.get("buyerId")).longValue();
        String address = (String) request.get("address");

        // Random driver and vehicle
        int randomIndex = (int) (Math.random() * DRIVERS.length);
        String driver = DRIVERS[randomIndex];
        String vehicle = VEHICLES[randomIndex];
        String trkNum = "TRK-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();

        Delivery delivery = new Delivery();
        delivery.setOrderId(orderId);
        delivery.setBuyerId(buyerId);
        delivery.setDestinationAddress(address);
        delivery.setDriverName(driver);
        delivery.setVehicleNumber(vehicle);
        delivery.setTrackingNumber(trkNum);
        delivery.setStatus("PENDING");

        deliveryRepository.save(delivery);

        Map<String, String> response = new HashMap<>();
        response.put("trackingNumber", trkNum);
        response.put("driverName", driver);
        response.put("vehicleNumber", vehicle);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/status/{orderId}")
    public ResponseEntity<?> getStatusByOrderId(@PathVariable("orderId") Long orderId) {
        Optional<Delivery> deliveryOpt = deliveryRepository.findByOrderId(orderId);
        if (deliveryOpt.isPresent()) {
            return ResponseEntity.ok(deliveryOpt.get());
        }
        return ResponseEntity.notFound().build();
    }

    @GetMapping("/tracking/{trackingNumber}")
    public ResponseEntity<?> getStatusByTrackingNumber(@PathVariable("trackingNumber") String trackingNumber) {
        Optional<Delivery> deliveryOpt = deliveryRepository.findByTrackingNumber(trackingNumber);
        if (deliveryOpt.isPresent()) {
            return ResponseEntity.ok(deliveryOpt.get());
        }
        return ResponseEntity.notFound().build();
    }

    @PutMapping("/status")
    public ResponseEntity<?> updateStatus(@RequestParam("trackingNumber") String trackingNumber, @RequestParam("status") String status) {
        Optional<Delivery> deliveryOpt = deliveryRepository.findByTrackingNumber(trackingNumber);
        if (deliveryOpt.isPresent()) {
            Delivery delivery = deliveryOpt.get();
            delivery.setStatus(status);
            return ResponseEntity.ok(deliveryRepository.save(delivery));
        }
        return ResponseEntity.notFound().build();
    }
}
