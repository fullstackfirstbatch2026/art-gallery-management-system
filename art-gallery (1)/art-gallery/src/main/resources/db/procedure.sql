DELIMITER //

CREATE PROCEDURE record_artwork_sale(
    IN p_artwork_id INT,
    IN p_customer_id INT,
    IN p_sale_price DECIMAL(10,2)
)
BEGIN
    DECLARE v_available BOOLEAN;
    DECLARE v_artwork_count INT;
    DECLARE v_customer_count INT;

    SELECT COUNT(*) INTO v_artwork_count
    FROM artworks
    WHERE artwork_id = p_artwork_id;

    IF v_artwork_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Artwork not found';
    END IF;

    SELECT COUNT(*) INTO v_customer_count
    FROM customers
    WHERE customer_id = p_customer_id;

    IF v_customer_count = 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Customer not found';
    END IF;

    SELECT available INTO v_available
    FROM artworks
    WHERE artwork_id = p_artwork_id;

    IF v_available = FALSE THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Artwork is already sold';
    END IF;

    INSERT INTO sales (
        artwork_id,
        customer_id,
        sale_date,
        sale_price
    )
    VALUES (
        p_artwork_id,
        p_customer_id,
        CURDATE(),
        p_sale_price
    );
END //

DELIMITER ;