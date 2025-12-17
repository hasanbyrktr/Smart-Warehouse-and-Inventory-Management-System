package com.students.smartwarehouse.controller;

import com.students.smartwarehouse.entity.Stock;
import com.students.smartwarehouse.repository.StockRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
public class StockController {

    private final StockRepository stockRepository;

    public StockController(StockRepository stockRepository) {
        this.stockRepository = stockRepository;
    }

    @GetMapping
    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }
    
    // Belki ileride sadece stok adedini güncellemek istersen buraya endpoint eklersin
}