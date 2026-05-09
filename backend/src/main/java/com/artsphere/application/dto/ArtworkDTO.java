package com.artsphere.application.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ArtworkDTO(
    Long id,
    String title,
    String description,
    BigDecimal price,
    String imageUrl,
    String artistName,
    String status,
    LocalDateTime createdAt
) {}
