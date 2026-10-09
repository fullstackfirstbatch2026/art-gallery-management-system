package com.example.art_gallery.repository;

import com.example.art_gallery.entity.Artwork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ArtworkRepository extends JpaRepository<Artwork, Integer> {

    @Query(value = """
        SELECT *
        FROM artworks
        WHERE price > (
            SELECT AVG(price)
            FROM artworks
        )
        """, nativeQuery = true)
    List<Artwork> findAboveAveragePrice();
}