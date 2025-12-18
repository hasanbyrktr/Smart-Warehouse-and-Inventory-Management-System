package com.students.smartwarehouse.service;

import com.students.smartwarehouse.entity.Supplier;
import com.students.smartwarehouse.repository.SupplierRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SupplierService {

    private final SupplierRepository supplierRepository;

    public SupplierService(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    // 1. LİSTELEME
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    // 2. EKLEME
    public Supplier saveSupplier(Supplier supplier) {
        return supplierRepository.save(supplier);
    }

    // 3. GÜNCELLEME (Hata Veren Kısım Düzeltildi)
    public Supplier updateSupplier(Long id, Supplier supplierInfo) {
        Supplier existingSupplier = supplierRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Tedarikçi bulunamadı! ID: " + id));

        // Senin Entity dosyanla %100 uyumlu hale getirdim:
        existingSupplier.setName(supplierInfo.getName());
        existingSupplier.setContactName(supplierInfo.getContactName()); // contact_name
        existingSupplier.setEmail(supplierInfo.getEmail());
        existingSupplier.setPhone(supplierInfo.getPhone());       // phone (Eskiden phoneNumber diyorduk hata veriyordu)
        existingSupplier.setAddress(supplierInfo.getAddress());   // address

        return supplierRepository.save(existingSupplier);
    }

    // 4. SİLME
    public void deleteSupplier(Long id) {
        if (supplierRepository.existsById(id)) {
            supplierRepository.deleteById(id);
        } else {
            throw new RuntimeException("Silinecek tedarikçi bulunamadı!");
        }
    }
}