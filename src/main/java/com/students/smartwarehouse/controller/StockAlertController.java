package com.students.smartwarehouse.controller;

import com.students.smartwarehouse.entity.StockAlert;
import com.students.smartwarehouse.service.StockAlertService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/alerts")
public class StockAlertController {

    private final StockAlertService stockAlertService;

    public StockAlertController(StockAlertService stockAlertService) {
        this.stockAlertService = stockAlertService;
    }

    @GetMapping("/active")
    public List<StockAlert> getActiveAlerts() {
        return stockAlertService.getActiveAlerts();
    }
}