package com.students.smartwarehouse.service;

import com.students.smartwarehouse.dto.StockForecastDTO;
import com.students.smartwarehouse.entity.OrderType;
import com.students.smartwarehouse.entity.Product;
import com.students.smartwarehouse.entity.Stock;
import com.students.smartwarehouse.repository.OrderRepository;
import com.students.smartwarehouse.repository.StockRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ForecastService {

    private final OrderRepository orderRepository;
    private final StockRepository stockRepository;

    public ForecastService(OrderRepository orderRepository, StockRepository stockRepository) {
        this.orderRepository = orderRepository;
        this.stockRepository = stockRepository;
    }

    public StockForecastDTO predictStockDepletion(Long productId) {
        StockForecastDTO forecast = new StockForecastDTO();

        Optional<Stock> stockOpt = stockRepository.findByProductId(productId);
        if (stockOpt.isEmpty()) {
            return null;
        }
        Stock stock = stockOpt.get();
        Product product = stock.getProduct();

        forecast.setProductName(product.getName());
        forecast.setCurrentStock(stock.getQuantity());

        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        Integer totalSold = orderRepository.findTotalSalesSince(productId, OrderType.OUT, thirtyDaysAgo);

        if (totalSold == null || totalSold == 0) {
            forecast.setDailyUsageRate(0.0);
            forecast.setEstimatedDaysLeft("Yeterli Veri Yok");
            return forecast;
        }

        double dailyRate = totalSold / 30.0;
        forecast.setDailyUsageRate(dailyRate);

        if (dailyRate > 0) {
            int daysLeft = (int) (stock.getQuantity() / dailyRate);
            forecast.setEstimatedDaysLeft(daysLeft + " Gün");
        } else {
            forecast.setEstimatedDaysLeft("Belirsiz");
        }

        return forecast;
    }
}