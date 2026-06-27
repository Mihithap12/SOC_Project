package com.farmercustomer.notificationservice.controller;

import com.farmercustomer.notificationservice.entity.Notification;
import com.farmercustomer.notificationservice.repository.NotificationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "*")
public class NotificationController {

    @Autowired
    private NotificationRepository notificationRepository;

    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {
        return ResponseEntity.ok(notificationRepository.findAll());
    }

    @PostMapping("/send")
    public ResponseEntity<Notification> sendNotification(@RequestBody Notification notification) {
        notification.setTimestamp(LocalDateTime.now().toString());
        notification.setStatus("SENT");
        
        // Simulating sending SMS or Email
        System.out.println(">>> [SMS/Email Simulator] User ID: " + notification.getUserId() + 
                           " | Message: " + notification.getMessage());
        
        return ResponseEntity.ok(notificationRepository.save(notification));
    }

    @PostMapping("/broadcast")
    public ResponseEntity<Notification> broadcast(@RequestBody MapBody body) {
        Notification notification = new Notification();
        notification.setUserId(null); // Broadcast
        notification.setMessage(body.getMessage());
        notification.setTimestamp(LocalDateTime.now().toString());
        notification.setStatus("SENT");

        System.out.println(">>> [SMS/Email Broadcast Simulator] Alert: " + body.getMessage());

        return ResponseEntity.ok(notificationRepository.save(notification));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getNotificationsForUser(@PathVariable("userId") Long userId) {
        return ResponseEntity.ok(notificationRepository.findByUserIdOrUserIdIsNull(userId));
    }

    // Static nested DTO for request mapping
    public static class MapBody {
        private String message;
        public String getMessage() { return message; }
        public void setMessage(String message) { this.message = message; }
    }
}
