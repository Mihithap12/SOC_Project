package com.farmercustomer.notificationservice.controller;

import com.farmercustomer.notificationservice.entity.Notification;
import com.farmercustomer.notificationservice.repository.NotificationRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class NotificationControllerTest {

    @Mock
    private NotificationRepository notificationRepository;

    @InjectMocks
    private NotificationController notificationController;

    private Notification notification;

    @BeforeEach
    void setUp() {
        notification = new Notification();
        notification.setId(1L);
        notification.setUserId(10L);
        notification.setMessage("Hello test");
        notification.setStatus("SENT");
        notification.setTimestamp("2026-06-27T18:00:00");
    }

    @Test
    void getAllNotifications_Success() {
        when(notificationRepository.findAll()).thenReturn(List.of(notification));

        ResponseEntity<List<Notification>> response = notificationController.getAllNotifications();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void sendNotification_Success() {
        when(notificationRepository.save(any(Notification.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<Notification> response = notificationController.sendNotification(notification);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("SENT", response.getBody().getStatus());
        assertNotNull(response.getBody().getTimestamp());
        verify(notificationRepository, times(1)).save(any(Notification.class));
    }

    @Test
    void broadcast_Success() {
        NotificationController.MapBody body = new NotificationController.MapBody();
        body.setMessage("Broadcasting alert!");

        when(notificationRepository.save(any(Notification.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ResponseEntity<Notification> response = notificationController.broadcast(body);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertNull(response.getBody().getUserId());
        assertEquals("Broadcasting alert!", response.getBody().getMessage());
        assertEquals("SENT", response.getBody().getStatus());
    }

    @Test
    void getNotificationsForUser_Success() {
        when(notificationRepository.findByUserIdOrUserIdIsNull(10L)).thenReturn(List.of(notification));

        ResponseEntity<List<Notification>> response = notificationController.getNotificationsForUser(10L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
    }
}
