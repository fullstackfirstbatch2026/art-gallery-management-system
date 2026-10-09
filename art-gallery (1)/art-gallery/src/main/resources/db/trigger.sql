DELIMITER //

CREATE TRIGGER after_sale_update_artwork
AFTER INSERT ON sales
FOR EACH ROW
BEGIN
    UPDATE artworks
    SET available = FALSE
    WHERE artwork_id = NEW.artwork_id;
END //

DELIMITER ;