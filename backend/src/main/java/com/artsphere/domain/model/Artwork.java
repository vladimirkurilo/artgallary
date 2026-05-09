package com.artsphere.domain.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "artworks")
public class Artwork {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    private Double royaltyRate;

    private String imageUrl;

    private String artistName;

    private String artistId; // Links to Auth provider ID

    @Enumerated(EnumType.STRING)
    private ArtworkStatus status;

    private LocalDateTime createdAt;

    public Artwork() {}

    public Artwork(Long id, String title, String description, BigDecimal price, Double royaltyRate, String imageUrl, String artistName, String artistId, ArtworkStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.price = price;
        this.royaltyRate = royaltyRate;
        this.imageUrl = imageUrl;
        this.artistName = artistName;
        this.artistId = artistId;
        this.status = status;
        this.createdAt = createdAt;
    }

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = ArtworkStatus.AVAILABLE;
    }

    public enum ArtworkStatus {
        AVAILABLE, SOLD, RESERVED
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
    public Double getRoyaltyRate() { return royaltyRate; }
    public void setRoyaltyRate(Double royaltyRate) { this.royaltyRate = royaltyRate; }
    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }
    public String getArtistName() { return artistName; }
    public void setArtistName(String artistName) { this.artistName = artistName; }
    public String getArtistId() { return artistId; }
    public void setArtistId(String artistId) { this.artistId = artistId; }
    public ArtworkStatus getStatus() { return status; }
    public void setStatus(ArtworkStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
