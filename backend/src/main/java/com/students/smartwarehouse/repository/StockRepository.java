package com.students.smartwarehouse.repository;

import com.students.smartwarehouse.entity.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    // Ürün ID'sine göre stok bulmak için:
    Optional<Stock> findByProductId(Long productId);
}