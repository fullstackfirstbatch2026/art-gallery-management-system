package com.example.art_gallery.service;

import com.example.art_gallery.entity.Artist;
import com.example.art_gallery.repository.ArtistRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ArtistService {

    private final ArtistRepository repository;

    public ArtistService(ArtistRepository repository) {
        this.repository = repository;
    }

    public List<Artist> getAllArtists() {
        return repository.findAll();
    }

    public Artist getArtistById(int id) {
        return repository.findById(id).orElse(null);
    }

    public Artist addArtist(Artist artist) {
        return repository.save(artist);
    }

    public Artist updateArtist(int id, Artist artist) {

        Artist existingArtist = repository.findById(id).orElse(null);

        if (existingArtist == null) {
            return null;
        }

        existingArtist.setName(artist.getName());
        existingArtist.setEmail(artist.getEmail());
        existingArtist.setPhone(artist.getPhone());
        existingArtist.setCountry(artist.getCountry());

        return repository.save(existingArtist);
    }

    public void deleteArtist(int id) {
        repository.deleteById(id);
    }
}