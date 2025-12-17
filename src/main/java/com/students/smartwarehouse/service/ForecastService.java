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

        // 1. Stok bilgisini çek
        Optional<Stock> stockOpt = stockRepository.findByProductId(productId);
        if (stockOpt.isEmpty()) {
            return null; // Ürün veya stok yok
        }
        Stock stock = stockOpt.get();
        Product product = stock.getProduct();

        forecast.setProductName(product.getName());
        forecast.setCurrentStock(stock.getQuantity());

        // 2. Son 30 gündeki toplam çıkışları hesapla
        LocalDateTime thirtyDaysAgo = LocalDateTime.now().minusDays(30);
        Integer totalSold = orderRepository.findTotalSalesSince(productId, OrderType.OUT, thirtyDaysAgo);

        // Eğer hiç satış yoksa
        if (totalSold == null || totalSold == 0) {
            forecast.setDailyUsageRate(0.0);
            forecast.setEstimatedDaysLeft("Satış verisi yok / Stok hareketsiz");
            return forecast;
        }

        // 3. Günlük ortalama tüketimi bul
        double dailyRate = totalSold / 30.0;
        forecast.setDailyUsageRate(dailyRate);

        // 4. Kaç gün yeteceğini hesapla (Mevcut Stok / Günlük Hız)
        if (dailyRate > 0) {
            int daysLeft = (int) (stock.getQuantity() / dailyRate);
            forecast.setEstimatedDaysLeft(daysLeft + " Gün");
        } else {
            forecast.setEstimatedDaysLeft("Belirsiz");
        }

        return forecast;
    }
}