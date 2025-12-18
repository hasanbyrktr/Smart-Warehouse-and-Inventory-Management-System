package com.students.smartwarehouse.entity;

import com.fasterxml.jackson.annotation.JsonIgnore; // <-- BU EKLENDİ
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List; // <-- BU EKLENDİ

@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, unique = true, length = 50)
    private String sku;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // --- MEVCUT TEDARİKÇİ İLİŞKİSİ ---
    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    // --- YENİ EKLENEN 1: STOK SİLME AYARI ---
    // Ürün silinince, Stok tablosundaki miktar bilgisi de silinsin
    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Stock stock;

    // --- YENİ EKLENEN 2: SİPARİŞ SİLME AYARI ---
    // Ürün silinince, o ürünün tüm geçmiş siparişleri de silinsin
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Order> orders;
}