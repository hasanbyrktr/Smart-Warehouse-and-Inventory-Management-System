package com.students.smartwarehouse.loader;

import java.math.BigDecimal;
import com.students.smartwarehouse.entity.*;
import com.students.smartwarehouse.repository.SupplierRepository;
import com.students.smartwarehouse.service.OrderService;
import com.students.smartwarehouse.service.ProductService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DataLoader implements CommandLineRunner {

    private final ProductService productService;
    private final OrderService orderService;
    private final SupplierRepository supplierRepository;

    public DataLoader(ProductService productService, OrderService orderService, SupplierRepository supplierRepository) {
        this.productService = productService;
        this.orderService = orderService;
        this.supplierRepository = supplierRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        // Eğer veritabanında tedarikçi varsa tekrar ekleme yapma
        if (supplierRepository.count() > 0) {
            System.out.println("Veritabanı zaten dolu, dummy data yüklenmedi.");
            return;
        }

        System.out.println("Dummy Data Yükleniyor... ⏳");

        // 1. Tedarikçileri Oluştur
        Supplier supplier1 = new Supplier();
        supplier1.setName("Tekno Toptan A.Ş.");
        supplier1.setContactName("Ahmet Yılmaz");
        supplier1.setEmail("ahmet@teknotoptan.com");
        supplier1.setPhone("555-1001");
        supplier1.setAddress("İstanbul, Kadıköy");
        supplier1.setCreatedAt(LocalDateTime.now());
        supplierRepository.save(supplier1);

        Supplier supplier2 = new Supplier();
        supplier2.setName("Ofis Dünyası Ltd.");
        supplier2.setContactName("Ayşe Demir");
        supplier2.setEmail("ayse@ofisdunyasi.com");
        supplier2.setPhone("555-2002");
        supplier2.setAddress("Ankara, Çankaya");
        supplier2.setCreatedAt(LocalDateTime.now());
        supplierRepository.save(supplier2);

     // 2. Ürünleri Oluştur
        Product p1 = new Product();
        p1.setName("Gaming Laptop");
        p1.setSku("MSI-GL65");
        p1.setPrice(BigDecimal.valueOf(35000.00)); // DÜZELTİLDİ: BigDecimal.valueOf() kullanıldı
        p1.setDescription("Yüksek performanslı oyun bilgisayarı");
        p1.setSupplier(supplier1);
        p1.setCreatedAt(LocalDateTime.now());
        productService.saveProduct(p1);

        Product p2 = new Product();
        p2.setName("Kablosuz Mouse");
        p2.setSku("LOGI-M330");
        p2.setPrice(BigDecimal.valueOf(750.00)); // DÜZELTİLDİ
        p2.setDescription("Sessiz tıklama özellikli mouse");
        p2.setSupplier(supplier1);
        p2.setCreatedAt(LocalDateTime.now());
        productService.saveProduct(p2);

        Product p3 = new Product();
        p3.setName("Ergonomik Sandalye");
        p3.setSku("OFIS-Chair-X");
        p3.setPrice(BigDecimal.valueOf(4500.00)); // DÜZELTİLDİ
        p3.setDescription("Bel destekli ofis sandalyesi");
        p3.setSupplier(supplier2);
        p3.setCreatedAt(LocalDateTime.now());
        productService.saveProduct(p3);

        // 3. Stok Girişleri Yap (IN - Satın Alma)
        // Laptop stoğunu 50'ye çıkaralım
        Order stockIn1 = new Order();
        stockIn1.setProduct(p1);
        stockIn1.setQuantity(50);
        stockIn1.setOrderType(OrderType.IN);
        stockIn1.setOrderDate(LocalDateTime.now().minusMonths(2)); // 2 ay önce alınmış gibi
        stockIn1.setStatus(OrderStatus.COMPLETED);
        orderService.createOrder(stockIn1);

        // Mouse stoğunu 100 yapalım
        Order stockIn2 = new Order();
        stockIn2.setProduct(p2);
        stockIn2.setQuantity(100);
        stockIn2.setOrderType(OrderType.IN);
        stockIn2.setOrderDate(LocalDateTime.now().minusMonths(2));
        stockIn2.setStatus(OrderStatus.COMPLETED);
        orderService.createOrder(stockIn2);

        // 4. Geçmiş Satışlar Oluştur (OUT - Satış) -> Forecast Testi İçin Önemli!
        // Son 10 günde her gün 1 laptop satılmış gibi yapalım
        for (int i = 1; i <= 10; i++) {
            Order sales = new Order();
            sales.setProduct(p1);
            sales.setQuantity(1); // 1 tane satıldı
            sales.setOrderType(OrderType.OUT);
            sales.setOrderDate(LocalDateTime.now().minusDays(i)); // i gün önce
            sales.setStatus(OrderStatus.COMPLETED);
            orderService.createOrder(sales);
        }

        // Mouse için toplu satış
        Order salesMouse = new Order();
        salesMouse.setProduct(p2);
        salesMouse.setQuantity(5);
        salesMouse.setOrderType(OrderType.OUT);
        salesMouse.setOrderDate(LocalDateTime.now().minusDays(5));
        salesMouse.setStatus(OrderStatus.COMPLETED);
        orderService.createOrder(salesMouse);

        System.out.println("✅ Dummy Data Başarıyla Yüklendi!");
    }
}