package com.students.smartwarehouse.controller;

import com.students.smartwarehouse.dto.StockForecastDTO;
import com.students.smartwarehouse.service.ForecastService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/forecast")
public class ForecastController {

    private final ForecastService forecastService;

    public ForecastController(ForecastService forecastService) {
        this.forecastService = forecastService;
    }

    @GetMapping("/{productId}")
    public ResponseEntity<StockForecastDTO> getForecast(@PathVariable Long productId) {
        StockForecastDTO forecast = forecastService.predictStockDepletion(productId);
        if (forecast == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(forecast);
    }
}