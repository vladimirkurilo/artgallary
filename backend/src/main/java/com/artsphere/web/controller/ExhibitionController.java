package com.artsphere.web.controller;

import com.artsphere.domain.model.Exhibition;
import com.artsphere.domain.repository.ExhibitionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/exhibitions")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ExhibitionController {
    private final ExhibitionRepository exhibitionRepository;

    @GetMapping
    public List<Exhibition> getAll() {
        return exhibitionRepository.findAll();
    }
}
