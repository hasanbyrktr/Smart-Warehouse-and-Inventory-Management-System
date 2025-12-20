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
        // KÖSTEBEK: Gelen veriyi konsola yazdırıp görelim
        System.out.println("GELEN ÜRÜN: " + product.getName());
        System.out.println("GELEN LİMİT: " + product.getInitialStockLimit()); 

        Product savedProduct = productRepository.save(product);

        if (stockRepository.findByProductId(savedProduct.getId()).isEmpty()) {
            Stock newStock = new Stock();
            newStock.setProduct(savedProduct);
            newStock.setQuantity(0);

            // Bizim kodumuz burasıydı:
            int limit = (product.getInitialStockLimit() != null) ? product.getInitialStockLimit() : 5;
            
            System.out.println("AYARLANAN STOK LİMİTİ: " + limit); // Bunu da görelim

            newStock.setMinimumQuantity(limit);
            stockRepository.save(newStock);
        }
        return savedProduct;
    }
}