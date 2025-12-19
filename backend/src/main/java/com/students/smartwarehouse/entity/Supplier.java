package com.students.smartwarehouse.entity;

import com.fasterxml.jackson.annotation.JsonIgnore; 
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "suppliers")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "contact_name", length = 100)
    private String contactName;

    @Column(length = 100)
    private String email;

    @Column(length = 20)
    private String phone;

    @Column(columnDefinition = "TEXT")
    private String address;

    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // --- DÜZELTME  ---
    // @JsonIgnore: JSON oluştururken bu listeyi görmezden gel.
    // Böylece "Ürün -> Tedarikçi -> Ürün..." sonsuz döngüsü kırılır.

    @OneToMany(mappedBy = "supplier", cascade = CascadeType.ALL, orphanRemoval = true) // <-- BURASI DEĞİŞTİ
    @JsonIgnore
    private List<Product> products;
}