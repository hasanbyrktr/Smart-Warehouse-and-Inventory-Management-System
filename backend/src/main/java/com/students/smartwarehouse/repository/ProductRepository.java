package com.students.smartwarehouse.repository;

import com.students.smartwarehouse.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    // Ekstra metod lazım olursa buraya yazarız (Örn: isme göre bul)
    // Product findByName(String name);
}