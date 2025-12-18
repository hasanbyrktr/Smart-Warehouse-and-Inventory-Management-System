package com.students.smartwarehouse.service;

import com.students.smartwarehouse.entity.Product;
import com.students.smartwarehouse.entity.Stock;
import com.students.smartwarehouse.repository.ProductRepository;
import com.students.smartwarehouse.repository.StockRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final StockRepository stockRepository;

    public ProductService(ProductRepository productRepository, StockRepository stockRepository) {
        this.productRepository = productRepository;
        this.stockRepository = stockRepository;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }
    


    public void deleteProduct(Long id) {
        productRepository.deleteById(id);
    }

    @Transactional // Hem ürün hem stok tablosuna yazdığımız için işlem bütünlüğü şart
    public Product saveProduct(Product product) {
        // 1. Ürünü kaydet
        Product savedProduct = productRepository.save(product);

        // 2. Ürün ilk kez ekleniyorsa, stok kaydını da 0 olarak oluştur (Otomatik)
        if (stockRepository.findByProductId(savedProduct.getId()).isEmpty()) {
            Stock newStock = new Stock();
            newStock.setProduct(savedProduct);
            newStock.setQuantity(0);
            newStock.setMinimumQuantity(5); // Varsayılan kritik seviye
            stockRepository.save(newStock);
        }

        return savedProduct;
    }
}