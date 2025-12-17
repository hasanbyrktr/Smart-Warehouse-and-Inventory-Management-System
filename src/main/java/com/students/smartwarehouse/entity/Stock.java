package com.students.smartwarehouse.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "stocks")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // İLİŞKİ: Her stoğun bir ürünü vardır. (One-To-One)
    @OneToOne
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    @Column(nullable = false)
    private Integer quantity; // Mevcut miktar

    @Column(name = "minimum_quantity", nullable = false)
    private Integer minimumQuantity; // Kritik eşik (bunun altına düşerse uyarı verir)

    @UpdateTimestamp // Her güncellendiğinde tarihi otomatik yeniler
    @Column(name = "last_updated")
    private LocalDateTime lastUpdated;
}
