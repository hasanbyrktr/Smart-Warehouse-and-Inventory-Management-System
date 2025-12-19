package com.students.smartwarehouse.service;

import com.students.smartwarehouse.entity.*;
import com.students.smartwarehouse.repository.OrderRepository;
import com.students.smartwarehouse.repository.ProductRepository;
import com.students.smartwarehouse.repository.StockRepository;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List; // <-- BU IMPORT EKLENDİ

@Service
@Transactional
@Slf4j
public class OrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final StockRepository stockRepository;

    public OrderService(OrderRepository orderRepository, ProductRepository productRepository, StockRepository stockRepository) {
        this.orderRepository = orderRepository;
        this.productRepository = productRepository;
        this.stockRepository = stockRepository;
    }

    // --- YENİ EKLENEN KISIM: SİPARİŞLERİ LİSTELEME ---
    public List<Order> getAllOrders() {
        log.info("Tüm siparişlerin listesi istendi.");
        return orderRepository.findAll();
    }

    // --- MEVCUT KISIM: SİPARİŞ OLUŞTURMA ---
    public Order createOrder(Order order) {
        // LOG 1: İşlem başladığında bilgi ver
        log.info("Sipariş isteği alındı. Ürün ID: {}", order.getProduct().getId());

        Product product = productRepository.findById(order.getProduct().getId())
                .orElseThrow(() -> new RuntimeException("Ürün bulunamadı!"));

        Stock stock = stockRepository.findByProductId(product.getId())
                .orElseThrow(() -> new RuntimeException("Stok kaydı yok!"));

        if (order.getOrderType() == OrderType.IN) {
            stock.setQuantity(stock.getQuantity() + order.getQuantity());
        } else if (order.getOrderType() == OrderType.OUT) {
            if (stock.getQuantity() < order.getQuantity()) {
                // LOG 2: Hata durumunda kırmızı log bas
                log.error("Yetersiz stok! İstenen: {}, Mevcut: {}", order.getQuantity(), stock.getQuantity());
                throw new RuntimeException("Yetersiz Stok!");
            }
            stock.setQuantity(stock.getQuantity() - order.getQuantity());
        }
        
        stockRepository.save(stock);
        
        order.setOrderDate(LocalDateTime.now());
        order.setStatus(OrderStatus.COMPLETED);
        
        Order savedOrder = orderRepository.save(order);
        
        // LOG 3: Başarılı bitişte bilgi ver
        log.info("Sipariş başarıyla tamamlandı. Order ID: {}", savedOrder.getId());
        
        return savedOrder;
    }
}