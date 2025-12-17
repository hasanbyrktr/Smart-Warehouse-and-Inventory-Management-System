package com.students.smartwarehouse.repository;

import com.students.smartwarehouse.entity.Order;
import com.students.smartwarehouse.entity.OrderType; // Enum paketini kontrol et
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    
    // JPQL Sorgusu: Belirli bir tarihten sonraki satışların (OUT) toplam adedini getir
    @Query("SELECT SUM(o.quantity) FROM Order o WHERE o.product.id = :productId AND o.orderType = :type AND o.orderDate >= :startDate")
    Integer findTotalSalesSince(@Param("productId") Long productId, 
                                @Param("type") OrderType type, 
                                @Param("startDate") LocalDateTime startDate);
}