# Akıllı Depo ve Envanter Yönetim Sistemi

Bu proje, Java Spring Boot kullanılarak geliştirilmiş web tabanlı bir
Akıllı Depo ve Envanter Yönetim Sistemidir.

## Amaç
Depodaki ürünlerin stok durumunu takip etmek, kritik stok seviyelerinde
otomatik uyarılar üretmek ve basit stok tahminleme işlemleri gerçekleştirmek.

## Kullanılan Teknolojiler
- Java 17
- Spring Boot
- Spring Data JPA
- RESTful API
- MySQL
- Maven

## Mimari
Uygulama Controller – Service – Repository katmanlı mimarisi ile geliştirilmiştir.
Veritabanı tarafında trigger mekanizması kullanılmıştır.
