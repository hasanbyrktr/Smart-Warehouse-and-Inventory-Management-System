DELIMITER //

CREATE TRIGGER check_stock_after_update
AFTER UPDATE ON stocks
FOR EACH ROW
BEGIN
    -- Eğer stok kritik seviyenin altına düştüyse VE daha önce çözülmemiş bir alarm yoksa
    IF NEW.quantity < NEW.minimum_quantity THEN
        INSERT INTO stock_alerts (product_id, message, is_resolved)
        VALUES (NEW.product_id, CONCAT('UYARI: Kritik Stok Seviyesi! Mevcut: ', NEW.quantity), FALSE);
    END IF;
END;

//
DELIMITER ;