package com.example.art_gallery.repository;

import com.example.art_gallery.entity.Sale;
import com.example.art_gallery.entity.SaleDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SaleRepository extends JpaRepository<Sale, Integer> {

    @Query(value = """
        SELECT
            s.sale_id AS saleId,
            a.title AS artwork,
            ar.name AS artist,
            c.name AS customer,
            s.sale_date AS saleDate,
            s.sale_price AS salePrice
        FROM sales s
        JOIN artworks a
            ON s.artwork_id = a.artwork_id
        JOIN artists ar
            ON a.artist_id = ar.artist_id
        JOIN customers c
            ON s.customer_id = c.customer_id
        """, nativeQuery = true)
    List<SaleDetails> getSaleDetails();
}