package com.example.art_gallery.service;

import com.example.art_gallery.entity.Artwork;
import com.example.art_gallery.repository.ArtworkRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArtworkService {

    private final ArtworkRepository repository;

    public ArtworkService(ArtworkRepository repository) {
        this.repository = repository;
    }

    public List<Artwork> getAllArtworks() {
        return repository.findAll();
    }

    public Artwork getArtworkById(int id) {
        return repository.findById(id).orElse(null);
    }

    public Artwork addArtwork(Artwork artwork) {
        return repository.save(artwork);
    }

    public Artwork updateArtwork(int id, Artwork artwork) {

        Artwork existingArtwork = repository.findById(id).orElse(null);

        if (existingArtwork == null) {
            return null;
        }

        existingArtwork.setTitle(artwork.getTitle());
        existingArtwork.setArtistId(artwork.getArtistId());
        existingArtwork.setCategory(artwork.getCategory());
        existingArtwork.setPrice(artwork.getPrice());
        existingArtwork.setAvailable(artwork.isAvailable());

        return repository.save(existingArtwork);
    }

    public void deleteArtwork(int id) {
        repository.deleteById(id);
    }

    // Subquery
    public List<Artwork> getAboveAverageArtworks() {
        return repository.findAboveAveragePrice();
    }
}