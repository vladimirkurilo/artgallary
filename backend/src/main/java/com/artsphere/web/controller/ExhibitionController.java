package com.artsphere.web.controller;

import com.artsphere.domain.model.Exhibition;
import com.artsphere.domain.repository.ExhibitionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/exhibitions")
@CrossOrigin(origins = "*")
public class ExhibitionController {
    private final ExhibitionRepository exhibitionRepository;

    public ExhibitionController(ExhibitionRepository exhibitionRepository) {
        this.exhibitionRepository = exhibitionRepository;
    }

    @GetMapping
    public List<Exhibition> getAll() {
        return exhibitionRepository.findAll();
    }

    @PostMapping
    public Exhibition create(@RequestBody Exhibition exhibition) {
        return exhibitionRepository.save(exhibition);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!exhibitionRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        exhibitionRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
