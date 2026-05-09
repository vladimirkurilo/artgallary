package com.artsphere.web.controller;

import com.artsphere.application.dto.ArtworkDTO;
import com.artsphere.domain.model.Artwork;
import com.artsphere.domain.repository.ArtworkRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/artworks")
@CrossOrigin(origins = "*")
public class ArtworkController {

    private final ArtworkRepository artworkRepository;

    public ArtworkController(ArtworkRepository artworkRepository) {
        this.artworkRepository = artworkRepository;
    }

    @GetMapping
    public List<ArtworkDTO> getAllArtworks() {
        return artworkRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArtworkDTO> getArtworkById(@PathVariable Long id) {
        return artworkRepository.findById(id)
                .map(this::mapToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ArtworkDTO createArtwork(@RequestBody Artwork artwork) {
        Artwork saved = artworkRepository.save(artwork);
        return mapToDTO(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteArtwork(@PathVariable Long id) {
        if (!artworkRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        artworkRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private ArtworkDTO mapToDTO(Artwork artwork) {
        return new ArtworkDTO(
                artwork.getId(),
                artwork.getTitle(),
                artwork.getDescription(),
                artwork.getPrice(),
                artwork.getImageUrl(),
                artwork.getArtistName(),
                artwork.getStatus() != null ? artwork.getStatus().name() : "AVAILABLE",
                artwork.getCreatedAt()
        );
    }
}
