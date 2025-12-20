# 📦 Akıllı Depo ve Envanter Yönetim Sistemi (Smart Warehouse Management System)

> **Ders:** Veritabanı Yönetim Sistemleri & Java Programlama
> **Dönem:** 2025-2026 Güz  
> **Geliştiriciler:** Hasan Bayraktar, Betül Eren, Emine Nur Alioğlu

---

## 📖 1. Proje Hakkında
Bu proje, KOBİ ölçeğindeki işletmelerin **depo süreçlerini dijitalleştirmek**, **stok kayıplarını önlemek** ve **operasyonel verimliliği artırmak** amacıyla geliştirilmiş modern bir web uygulamasıdır.

Sistem; ürünlerin tedarikçiden depoya girişinden, müşteriye satışına (çıkış) kadar olan tüm yaşam döngüsünü takip eder. Sadece kayıt tutmakla kalmaz, **kritik stok seviyeleri** için görsel ve sistemsel uyarılar vererek yöneticilerin doğru zamanda sipariş vermesini sağlar.

---

## ✨ 2. Temel Özellikler

### 📊 Akıllı Dashboard
* **Operasyonel Özet:** Toplam ürün sayısı, stok değeri ve yapay zeka destekli gelecek ay talep tahmini.
* **Kritik Stok Uyarısı:** Stoğu bitmek üzere olan ürünler için **Kırmızı Alarm** modu; her şey yolundaysa **Yeşil (İdeal)** mod.
* **Görsel Analiz:** En çok stoklanan ürünlerin dinamik pasta grafiği.

### 📦 Gelişmiş Stok Takibi
* **Görsel Barlar:** Stok miktarları sadece sayı ile değil, doluluk çubukları (Progress Bars) ile gösterilir.
* **Akıllı Renklendirme:** Kritik eşiğin (Minimum Quantity) altına düşen ürünler listede **Kırmızı**, yeterli olanlar **Yeşil** yanar.
* **Sıralama:** Ürünler isme, stok miktarına veya risk durumuna göre tek tıkla sıralanabilir.

### 📝 Sipariş ve Raporlama
* **Giriş/Çıkış Yönetimi:** Tedarikçiden gelen (IN) ve satılan (OUT) ürünlerin kaydı.
* **Excel Export:** Tek tıkla tüm sipariş geçmişini `.xlsx` formatında raporlama imkanı.
* **Arama Motoru:** Ürün, SKU veya İşlem tipine göre anlık filtreleme.

### 🛡️ Veri Bütünlüğü ve Güvenlik
* **Silme Koruması (Delete Protection):** Geçmişte sipariş hareketi olan bir ürünün yanlışlıkla silinmesi yazılımsal olarak engellenmiştir.
* **Tedarikçi Doğrulama:** Ürün sağlayan aktif tedarikçilerin silinmesi önlenir.

---

## 🛠️ 3. Kullanılan Teknolojiler

| Katman | Teknoloji | Açıklama |
| :--- | :--- | :--- |
| **Backend** | Java 17, Spring Boot 3.4 | REST API Mimarisi |
| **Database** | MySQL 8.0 | İlişkisel Veritabanı |
| **ORM** | Hibernate / JPA | Veri Erişimi |
| **Frontend** | React.js | Kullanıcı Arayüzü |
| **UI Library** | Axios, Recharts, Toastify | HTTP, Grafik, Bildirim |
| **Tools** | Maven, Git, VS Code | Proje Yönetimi |

---

## 🚀 4. Kurulum ve Çalıştırma Rehberi (Adım Adım)

Projeyi sorunsuz çalıştırmak için aşağıdaki adımları sırasıyla uygulayınız.

### Ön Hazırlıklar (Gereksinimler)
* Bilgisayarınızda **Java JDK 17** veya üzeri yüklü olmalıdır.
* **Node.js** (Frontend için) yüklü olmalıdır.
* **MySQL Workbench** veya herhangi bir MySQL sunucusu kurulu olmalıdır.

### ADIM 1: Veritabanı Kurulumu 🗄️
1.  MySQL Workbench'i açın.
2.  `smartwarehouse_db` isminde boş bir veritabanı (Schema) oluşturun:
    ```sql
    CREATE DATABASE smartwarehouse_db;
    ```
3.  Proje dosyasındaki `2_Veritabani` klasöründe bulunan **`.sql` (dump)** dosyasını açın ve içeriğini MySQL'de çalıştırarak tabloları ve demo verileri yükleyin.

### ADIM 2: Backend (Sunucu) Başlatma ☕
1.  `1_Kaynak_Kodlar/Backend_SpringBoot` klasörünü IDE (IntelliJ, Eclipse veya VS Code) ile açın.
2.  `src/main/resources/application.properties` dosyasını açın.
3.  Kendi MySQL kullanıcı adı ve şifrenizi güncelleyin:
    ```properties
    spring.datasource.username=root
    spring.datasource.password=SENIN_MYSQL_SIFREN
    ```
4.  Projeyi `Maven` ile derleyin veya IDE üzerindeki **Run** butonuna basarak `SmartWarehouseApplication.java` dosyasını çalıştırın.
5.  Konsolda `Started SmartWarehouseApplication in ... seconds` yazısını gördüğünüzde sunucu **8080** portunda çalışıyor demektir.

### ADIM 3: Frontend (Arayüz) Başlatma ⚛️
1.  Terminali açın ve `1_Kaynak_Kodlar/Frontend_React` klasörünün içine girin.
2.  Gerekli kütüphanelerin yüklenmesi için şu komutu çalıştırın (Bu işlem internet hızına göre 1-2 dk sürebilir):
    ```bash
    npm install
    ```
3.  Yükleme bitince projeyi başlatın:
    ```bash
    npm start
    ```
4.  Tarayıcınız otomatik olarak açılacaktır. Açılmazsa `http://localhost:3000` adresine gidiniz.

---

## 🧪 5. Demo Senaryosu (Test Etmek İçin)

test eden kişinin aşağıdaki senaryoyu denemesi önerilir:

1.  **Dashboard Kontrolü:** Ana sayfada pasta grafiğinin ve özet kartların dolu geldiğini teyit edin.
2.  **Kritik Stok Testi:**
    * "Stok Durumu" sayfasına gidin.
    * Kırmızı yanan bir ürünü tespit edin veya stoğu az olan bir ürünü not alın.
3.  **Sipariş Girişi (Stok Artırma):**
    * "Sipariş & Sevkiyat" sayfasına gidin.
    * Az önce belirlediğiniz ürüne "Giriş (IN)" işlemi yaparak stok ekleyin (Örn: 100 adet).
    * Tekrar "Stok Durumu" sayfasına dönün; ürünün **Yeşil (Yeterli)** duruma geçtiğini ve barın dolduğunu gözlemleyin.
4.  **Raporlama:** "Sipariş" sayfasındaki **"📥 Excel"** butonuna basarak geçmişi indirin.

---

## ❓ 6. Sorun Giderme (Troubleshooting)

* **Hata:** `Port 8080 is already in use`
    * **Çözüm:** Arka planda çalışan başka bir Java uygulaması olabilir. Görev yöneticisinden kapatın veya bilgisayarı yeniden başlatın.
* **Hata:** Veriler gelmiyor / Tablolar boş.
    * **Çözüm:** Backend konsolunda `Access denied for user` hatası var mı? Varsa `application.properties` dosyasındaki MySQL şifrenizi kontrol edin.
* **Hata:** `npm install` hata veriyor.
    * **Çözüm:** `node_modules` klasörünü silip tekrar `npm install` komutunu deneyin. Node.js sürümünüzün güncel olduğundan emin olun.

---

**© 2025 - Akıllı Depo Yönetim Sistemi** Bu proje eğitim amacıyla geliştirilmiştir.
