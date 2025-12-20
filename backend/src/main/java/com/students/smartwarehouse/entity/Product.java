package com.students.smartwarehouse.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

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

    // --- MEVCUT İLİŞKİLER ---

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    private Supplier supplier;

    // 1. STOK SİLME AYARI (Cascade)
    // Ürün silinince, Stok tablosundaki miktar bilgisi de otomatik silinir.
    @OneToOne(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private Stock stock;

    // 2. SİPARİŞ SİLME AYARI (Cascade)
    // Ürün silinince, o ürünün tüm geçmiş siparişleri de otomatik silinir.
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonIgnore
    private List<Order> orders;

    // --- YENİ EKLENEN: TAŞIYICI ALAN (Dinamik Eşik İçin) ---
    // @Transient: Bu alan veritabanında "products" tablosuna kolon olarak EKLENMEZ.
    // Sadece Frontend'den gelen "Kritik Stok Sınırı" (örn: 10, 20) bilgisini
    // Service katmanına taşıyıp Stock tablosuna kaydetmek için kullanılır.
    @Transient
    private Integer initialStockLimit;
}