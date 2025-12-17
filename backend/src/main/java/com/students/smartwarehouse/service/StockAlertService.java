package com.students.smartwarehouse.service;

import com.students.smartwarehouse.entity.StockAlert;
import com.students.smartwarehouse.repository.StockAlertRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class StockAlertService {

    private final StockAlertRepository stockAlertRepository;

    public StockAlertService(StockAlertRepository stockAlertRepository) {
        this.stockAlertRepository = stockAlertRepository;
    }

    // Sadece çözülmemiş (aktif) uyarıları getir
    public List<StockAlert> getActiveAlerts() {
        return stockAlertRepository.findByIsResolvedFalse();
    }
}