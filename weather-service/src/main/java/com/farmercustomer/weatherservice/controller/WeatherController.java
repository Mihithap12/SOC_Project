package com.farmercustomer.weatherservice.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/weather")
@CrossOrigin(origins = "*")
public class WeatherController {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${weather.api.key}")
    private String apiKey;

    @Value("${weather.api.url}")
    private String apiUrl;

    @GetMapping("/{city}")
    public ResponseEntity<?> getWeather(@PathVariable("city") String city) {
        if ("mock_key".equals(apiKey) || apiKey.isBlank()) {
            // Return highly realistic mock agricultural weather data
            Map<String, Object> mockData = new HashMap<>();
            mockData.put("city", city);
            mockData.put("temperature", 24.0 + (Math.random() * 8.0)); // 24 to 32
            mockData.put("humidity", 70 + (int)(Math.random() * 20)); // 70 to 90
            
            String[] conditions = {"Sunny - Excellent for harvesting", "Light Rain - Soil moisture optimal", "Scattered Clouds - Fair breeze", "Overcast - Rain expected"};
            int index = (int)(Math.random() * conditions.length);
            mockData.put("description", conditions[index]);
            mockData.put("windSpeed", 10.0 + (Math.random() * 15.0)); // 10 to 25 km/h
            mockData.put("agriculturalAdvice", getAgriAdvice(conditions[index]));

            // 3-day forecast
            List<Map<String, Object>> forecast = List.of(
                Map.of("day", "Tomorrow", "temp", 26.5, "condition", "Sunny"),
                Map.of("day", "Day 2", "temp", 25.0, "condition", "Light Rain"),
                Map.of("day", "Day 3", "temp", 24.2, "condition", "Heavy Rain")
            );
            mockData.put("forecast", forecast);
            mockData.put("source", "Mock Weather Engine");

            return ResponseEntity.ok(mockData);
        }

        try {
            // Actual OpenWeatherMap API Call
            String url = String.format("%s?q=%s&appid=%s&units=metric", apiUrl, city, apiKey);
            ResponseEntity<Map> response = restTemplate.getForEntity(url, Map.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                Map<String, Object> body = response.getBody();
                Map<String, Object> main = (Map<String, Object>) body.get("main");
                List<Map<String, Object>> weatherList = (List<Map<String, Object>>) body.get("weather");
                Map<String, Object> wind = (Map<String, Object>) body.get("wind");
                
                String desc = weatherList.isEmpty() ? "Unknown" : (String) weatherList.get(0).get("description");

                Map<String, Object> weatherInfo = new HashMap<>();
                weatherInfo.put("city", city);
                weatherInfo.put("temperature", main.get("temp"));
                weatherInfo.put("humidity", main.get("humidity"));
                weatherInfo.put("description", desc);
                weatherInfo.put("windSpeed", wind.get("speed"));
                weatherInfo.put("agriculturalAdvice", getAgriAdvice(desc));
                weatherInfo.put("source", "OpenWeatherMap API");
                return ResponseEntity.ok(weatherInfo);
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to fetch weather from external API: " + e.getMessage());
        }
        
        return ResponseEntity.badRequest().body("Weather data unavailable");
    }

    private String getAgriAdvice(String condition) {
        String cond = condition.toLowerCase();
        if (cond.contains("sunny") || cond.contains("clear")) {
            return "Perfect conditions for harvesting crops and drying tea leaves. Plan pesticide applications if necessary.";
        } else if (cond.contains("rain") || cond.contains("shower") || cond.contains("drizzle")) {
            return "Rain detected. Delay harvesting and pesticide spraying. Ensure drainage channels are clear to prevent waterlogging.";
        } else if (cond.contains("cloud") || cond.contains("overcast")) {
            return "Overcast skies. Good for field maintenance, transplanting seedlings, and applying organic manure.";
        }
        return "Standard conditions. Monitor soil moisture and execute scheduled weeding.";
    }
}
