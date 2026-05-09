package com.artsphere.web.controller;

import com.artsphere.domain.model.Artist;
import com.artsphere.domain.repository.ArtistRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/artists")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ArtistController {
    private final ArtistRepository artistRepository;

    @GetMapping
    public List<Artist> getAll() {
        return artistRepository.findAll();
    }
}
