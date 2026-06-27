package com.farmercustomer.orderservice.controller;

import com.farmercustomer.orderservice.entity.Order;
import com.farmercustomer.orderservice.repository.OrderRepository;
import com.farmercustomer.orderservice.service.OrderSagaOrchestrator;
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
class OrderControllerTest {

    @Mock
    private OrderRepository orderRepository;

    @Mock
    private OrderSagaOrchestrator orderSagaOrchestrator;

    @InjectMocks
    private OrderController orderController;

    private Order order;

    @BeforeEach
    void setUp() {
        order = new Order();
        order.setId(1L);
        order.setBuyerId(10L);
        order.setListingId(100L);
        order.setQuantity(10.0);
        order.setShippingAddress("Kandy");
        order.setStatus("PENDING");
    }

    @Test
    void getAllOrders_Success() {
        when(orderRepository.findAll()).thenReturn(List.of(order));

        ResponseEntity<List<Order>> response = orderController.getAllOrders();

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void getOrderById_Found() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));

        ResponseEntity<Order> response = orderController.getOrderById(1L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(order, response.getBody());
    }

    @Test
    void getOrderById_NotFound() {
        when(orderRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseEntity<Order> response = orderController.getOrderById(1L);

        assertEquals(HttpStatus.NOT_FOUND, response.getStatusCode());
    }

    @Test
    void getOrdersByBuyer_Success() {
        when(orderRepository.findByBuyerId(10L)).thenReturn(List.of(order));

        ResponseEntity<List<Order>> response = orderController.getOrdersByBuyer(10L);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(1, response.getBody().size());
    }

    @Test
    void placeOrder_Success() {
        when(orderSagaOrchestrator.executeOrderSaga(order)).thenReturn(order);

        ResponseEntity<Order> response = orderController.placeOrder(order);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(order, response.getBody());
        verify(orderSagaOrchestrator, times(1)).executeOrderSaga(order);
    }
}
