package com.example.art_gallery.controller;

import com.example.art_gallery.entity.Artwork;
import com.example.art_gallery.repository.ArtworkRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;

@RestController
@RequestMapping("/artworks")
@CrossOrigin(origins = "http://localhost:5173")
public class ArtworkImageController {

    private final ArtworkRepository artworkRepository;

    public ArtworkImageController(ArtworkRepository artworkRepository) {
        this.artworkRepository = artworkRepository;
    }

    @PostMapping("/{id}/image")
    public ResponseEntity<String> uploadImage(
            @PathVariable int id,
            @RequestParam("image") MultipartFile image) {

        try {
            Artwork artwork = artworkRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Artwork not found"));

            Path uploadPath = Paths.get("uploads");

            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String fileName = System.currentTimeMillis()
                    + "_" + image.getOriginalFilename();

            Path filePath = uploadPath.resolve(fileName);

            Files.copy(
                    image.getInputStream(),
                    filePath,
                    StandardCopyOption.REPLACE_EXISTING
            );

            artwork.setImageUrl("/uploads/" + fileName);
            artworkRepository.save(artwork);

            return ResponseEntity.ok(
                    "Image uploaded successfully: /uploads/" + fileName
            );

        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body("Image upload failed");
        }
    }
}