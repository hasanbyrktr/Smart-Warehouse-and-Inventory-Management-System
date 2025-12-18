package com.students.smartwarehouse.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Tüm URL'lere izin ver
                .allowedOrigins("http://localhost:3000", "http://localhost:3001", "http://localhost:3002") // 3002 portunu da ekle
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // İzin verilen metodlar
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}