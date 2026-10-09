package com.example.art_gallery.controller;

import com.example.art_gallery.entity.Artwork;
import com.example.art_gallery.service.ArtworkService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/artworks")
@CrossOrigin(origins = "http://localhost:5173")
public class ArtworkController {

    private final ArtworkService service;

    public ArtworkController(ArtworkService service) {
        this.service = service;
    }

    @GetMapping
    public List<Artwork> getAllArtworks() {
        return service.getAllArtworks();
    }

    // SUBQUERY API
    @GetMapping("/above-average")
    public List<Artwork> getAboveAverageArtworks() {
        return service.getAboveAverageArtworks();
    }

    @GetMapping("/{id}")
    public Artwork getArtworkById(@PathVariable int id) {
        return service.getArtworkById(id);
    }

    @PostMapping
    public Artwork addArtwork(@RequestBody Artwork artwork) {
        return service.addArtwork(artwork);
    }

    @PutMapping("/{id}")
    public Artwork updateArtwork(
            @PathVariable int id,
            @RequestBody Artwork artwork) {

        return service.updateArtwork(id, artwork);
    }


    @DeleteMapping("/{id}")
    public String deleteArtwork(@PathVariable int id) {
        service.deleteArtwork(id);
        return "Artwork deleted successfully";
    }
}