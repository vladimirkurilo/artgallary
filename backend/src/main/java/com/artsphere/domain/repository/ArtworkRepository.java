package com.artsphere.domain.repository;

import com.artsphere.domain.model.Artwork;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ArtworkRepository extends JpaRepository<Artwork, Long> {
    List<Artwork> findByStatus(Artwork.ArtworkStatus status);
}
