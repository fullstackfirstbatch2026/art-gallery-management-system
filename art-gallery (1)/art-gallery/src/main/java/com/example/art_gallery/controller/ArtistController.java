package com.example.art_gallery.controller;

import com.example.art_gallery.entity.Artist;
import com.example.art_gallery.service.ArtistService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/artists")
@CrossOrigin(origins = "http://localhost:5173")
public class ArtistController {

    private final ArtistService service; //!!used here cuz of @service annotation

    public ArtistController(ArtistService service) {
        this.service = service;
    }

    @GetMapping
    public List<Artist> getAllArtists() {
        return service.getAllArtists();
    }

    @GetMapping("/{id}")
    public Artist getArtistById(@PathVariable int id) {
        return service.getArtistById(id);
    }

    @PostMapping
    public Artist addArtist(@RequestBody Artist artist) {
        return service.addArtist(artist);
    }

    @PutMapping("/{id}")
    public Artist updateArtist(
            @PathVariable int id,
            @RequestBody Artist artist) {

        return service.updateArtist(id, artist);
    }

    @DeleteMapping("/{id}")
    public String deleteArtist(@PathVariable int id) {

        service.deleteArtist(id);

        return "Artist deleted successfully";
    }
}