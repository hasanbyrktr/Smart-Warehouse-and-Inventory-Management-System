package com.students.smartwarehouse.controller;

import com.students.smartwarehouse.entity.Supplier;
import com.students.smartwarehouse.service.SupplierService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    // DEĞİŞİKLİK 1: Artık Repository değil, Service kullanıyoruz
    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @GetMapping
    public List<Supplier> getAllSuppliers() {
        // DEĞİŞİKLİK 2: Service üzerinden çağırıyoruz
        return supplierService.getAllSuppliers();
    }

    @PostMapping
    public ResponseEntity<Supplier> createSupplier(@RequestBody Supplier supplier) {
        // DEĞİŞİKLİK 3: Service üzerinden kaydediyoruz
        return ResponseEntity.ok(supplierService.saveSupplier(supplier));
    }

    // YENİ EKLENEN: GÜNCELLEME 
    @PutMapping("/{id}")
    public ResponseEntity<Supplier> updateSupplier(@PathVariable Long id, @RequestBody Supplier supplier) {
        return ResponseEntity.ok(supplierService.updateSupplier(id, supplier));
    }

    // YENİ EKLENEN: SİLME 
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        supplierService.deleteSupplier(id);
        return ResponseEntity.ok().build();
    }
}