DELIMITER //

-- Önce varsa eskisini silelim ki hata vermesin
DROP TRIGGER IF EXISTS check_stock_after_update;

CREATE TRIGGER check_stock_after_update
AFTER UPDATE ON stocks
FOR EACH ROW
BEGIN
    -- 1. Stok kritik seviyenin altına düştü mü?
    IF NEW.quantity < NEW.minimum_quantity THEN
        
        -- 2. (EKSİK OLAN KISIM) Bu ürün için zaten çözülmemiş (aktif) bir alarm var mı?
        IF NOT EXISTS (SELECT 1 FROM stock_alerts WHERE product_id = NEW.product_id AND is_resolved = FALSE) THEN
            
            -- Alarm yoksa yeni alarm ekle
            INSERT INTO stock_alerts (product_id, message, is_resolved, alert_date)
            VALUES (NEW.product_id, CONCAT('UYARI: Stok Kritik! Mevcut: ', NEW.quantity, ' Min: ', NEW.minimum_quantity), FALSE, NOW());
            
        END IF;
    END IF;
END;

//
DELIMITER ;