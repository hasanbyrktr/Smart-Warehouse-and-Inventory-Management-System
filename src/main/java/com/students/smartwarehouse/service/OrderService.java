package com.students.smartwarehouse.service;

import com.students.smartwarehouse.entity.Order;
import com.students.smartwarehouse.entity.Stock;
import com.students.smartwarehouse.entity.OrderType; // Enum'ın yeri
import com.students.smartwarehouse.repository.OrderRepository;
import com.students.smartwarehouse.repository.StockRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final StockRepository stockRepository;

    public OrderService(OrderRepository orderRepository, StockRepository stockRepository) {
        this.orderRepository = orderRepository;
        this.stockRepository = stockRepository;
    }

    @Transactional
    public Order createOrder(Order order) {
        // 1. Siparişi kaydet
        Order savedOrder = orderRepository.save(order);

        // 2. İlgili ürünün stoğunu bul
        Stock stock = stockRepository.findByProductId(order.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Stok bulunamadı!"));

        // 3. Sipariş türüne göre stoğu güncelle
        if (order.getOrderType() == OrderType.IN) {
            // Depoya giriş (Satın alma) -> Stok artar
            stock.setQuantity(stock.getQuantity() + order.getQuantity());
        } else if (order.getOrderType() == OrderType.OUT) {
            // Depodan çıkış (Satış) -> Stok azalır
            if (stock.getQuantity() < order.getQuantity()) {
                throw new RuntimeException("Yetersiz Stok! Mevcut: " + stock.getQuantity());
            }
            stock.setQuantity(stock.getQuantity() - order.getQuantity());
        }

        // 4. Güncel stoğu kaydet (Burada senin TRIGGER devreye girecek!)
        stockRepository.save(stock);

        return savedOrder;
    }
}