package com.students.smartwarehouse.controller;

import com.students.smartwarehouse.entity.Order;
import com.students.smartwarehouse.service.OrderService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderService orderService;

    public OrderController(OrderService orderService) {
        this.orderService = orderService;
    }

    @PostMapping
    public ResponseEntity<Order> createOrder(@RequestBody Order order) {
        // Sipariş gelince Service katmanı stoğu otomatik düşürecek/artıracak
        return ResponseEntity.ok(orderService.createOrder(order));
    }
}