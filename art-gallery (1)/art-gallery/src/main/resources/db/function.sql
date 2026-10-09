DELIMITER //

CREATE FUNCTION calculate_commission(
    p_sale_price DECIMAL(10,2)
)
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    RETURN p_sale_price * 0.10;
END //

DELIMITER ;