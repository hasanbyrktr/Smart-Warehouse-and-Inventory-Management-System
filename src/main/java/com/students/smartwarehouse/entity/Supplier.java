package com.students.smartwarehouse.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity // Bu sınıfın bir veritabanı tablosu olduğunu belirtir
@Table(name = "suppliers") // Veritabanındaki 'suppliers' tablosuna karşılık gelir
@Data // Lombok: Getter, Setter, toString vb. otomatik ekler
@NoArgsConstructor // Parametresiz constructor
@AllArgsConstructor // Tüm parametreli constructor
public class Supplier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto Increment (Otomatik Artan ID)
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

    @CreationTimestamp // Kayıt eklendiğinde o anki saati otomatik basar
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    // İLİŞKİ: Bir Tedarikçinin birden çok ürünü olabilir (One-To-Many)
    // 'mappedBy' -> Product sınıfındaki 'supplier' değişkenine referans verir.
    // Cascade -> Tedarikçi silinirse ürünlere ne olacağını veritabanı ayarlar (burada Java tarafını boş bıraktık)
    @OneToMany(mappedBy = "supplier")
    private List<Product> products;
}