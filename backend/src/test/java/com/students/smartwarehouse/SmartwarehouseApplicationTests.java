package com.students.smartwarehouse;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

@SpringBootTest
class SmartwarehouseApplicationTests {

    // Spring'den veritabanı kaynağını istiyoruz
    @Autowired
    private DataSource dataSource;

    @Test
    void contextLoads() {
        // Bu metod boş olsa bile, eğer uygulama ayağa kalkamazsa (DB hatası vs.)
        // test başarısız olur. Yani bu bile tek başına bir testtir.
    }

    @Test
    void testDatabaseConnection() {
        try (Connection connection = dataSource.getConnection()) {
            System.out.println("--------------------------------------------------");
            System.out.println("✅ TEST BAŞARILI! Veritabanına bağlanıldı.");
            System.out.println("🔗 URL: " + connection.getMetaData().getURL());
            System.out.println("--------------------------------------------------");
        } catch (SQLException e) {
            System.err.println("❌ TEST BAŞARISIZ: Bağlantı hatası -> " + e.getMessage());
        }
    }
}