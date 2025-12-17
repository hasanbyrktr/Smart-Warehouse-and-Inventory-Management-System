package com.students.smartwarehouse.dto;

import lombok.Data;

@Data
public class StockForecastDTO {
    private String productName;
    private Integer currentStock;
    private Double dailyUsageRate; // Günlük ortalama tüketim
    private String estimatedDaysLeft; // "5 gün", "Yeterli", "Stok Yok" gibi
}