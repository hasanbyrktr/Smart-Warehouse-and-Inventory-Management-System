package com.students.smartwarehouse.controller;

import com.students.smartwarehouse.entity.Product;
import com.students.smartwarehouse.service.ProductService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    @GetMapping
    public List<Product> getAllProducts() {
        return productService.getAllProducts();
    }
    

    @PostMapping
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(productService.saveProduct(product));
    }
<<<<<<< HEAD

=======
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok().build();
    }
>>>>>>> eb61aaca5b163911535ee34e4853f7d59606495e
}