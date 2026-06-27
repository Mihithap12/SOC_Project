package com.farmercustomer.weatherservice.controller;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class WeatherControllerTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private WeatherController weatherController;

    @BeforeEach
    void setUp() {
        ReflectionTestUtils.setField(weatherController, "apiKey", "mock_key");
        ReflectionTestUtils.setField(weatherController, "apiUrl", "http://api.openweathermap.org/data/2.5/weather");
    }

    @Test
    void getWeather_MockData_Success() {
        ResponseEntity<?> response = weatherController.getWeather("Kandy");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals("Kandy", body.get("city"));
        assertEquals("Mock Weather Engine", body.get("source"));
        assertNotNull(body.get("temperature"));
        assertNotNull(body.get("humidity"));
        assertNotNull(body.get("agriculturalAdvice"));
    }

    @Test
    void getWeather_LiveAPI_Success() {
        // Set real API key simulator
        ReflectionTestUtils.setField(weatherController, "apiKey", "real_key");

        Map<String, Object> mockExternalResponse = new HashMap<>();
        mockExternalResponse.put("main", Map.of("temp", 28.5, "humidity", 82));
        mockExternalResponse.put("weather", java.util.List.of(Map.of("description", "heavy intensity rain")));
        mockExternalResponse.put("wind", Map.of("speed", 12.0));

        when(restTemplate.getForEntity(anyString(), eq(Map.class)))
                .thenReturn(new ResponseEntity<>(mockExternalResponse, HttpStatus.OK));

        ResponseEntity<?> response = weatherController.getWeather("Colombo");

        assertEquals(HttpStatus.OK, response.getStatusCode());
        Map<String, Object> body = (Map<String, Object>) response.getBody();
        assertNotNull(body);
        assertEquals("Colombo", body.get("city"));
        assertEquals("OpenWeatherMap API", body.get("source"));
        assertEquals(28.5, body.get("temperature"));
        assertEquals(82, body.get("humidity"));
        assertTrue(((String) body.get("agriculturalAdvice")).contains("Rain detected"));
    }

    @Test
    void getWeather_LiveAPI_Failure() {
        ReflectionTestUtils.setField(weatherController, "apiKey", "real_key");

        when(restTemplate.getForEntity(anyString(), eq(Map.class)))
                .thenThrow(new RuntimeException("API Connection timeout"));

        ResponseEntity<?> response = weatherController.getWeather("Colombo");

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertTrue(((String) response.getBody()).contains("Failed to fetch weather"));
    }
}
