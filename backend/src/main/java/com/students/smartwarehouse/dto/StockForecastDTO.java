package com.students.smartwarehouse.dto;

import lombok.Data;

@Data
public class StockForecastDTO {
    private String productName;
    private Integer currentStock;
    private Double dailyUsageRate;
    private String estimatedDaysLeft;
}