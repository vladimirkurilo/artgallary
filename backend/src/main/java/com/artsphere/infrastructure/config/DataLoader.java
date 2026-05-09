package com.artsphere.infrastructure.config;

import com.artsphere.domain.model.Artist;
import com.artsphere.domain.model.Artwork;
import com.artsphere.domain.model.Exhibition;
import com.artsphere.domain.repository.ArtistRepository;
import com.artsphere.domain.repository.ArtworkRepository;
import com.artsphere.domain.repository.ExhibitionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class DataLoader implements CommandLineRunner {

    private final ArtworkRepository artworkRepository;
    private final ArtistRepository artistRepository;
    private final ExhibitionRepository exhibitionRepository;

    @Override
    public void run(String... args) throws Exception {
        if (artistRepository.count() == 0) {
            artistRepository.save(new Artist(null, "Серафина Блэк", "Специалист по генеративному искусству.", "Generative Art", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200", "Берлин", 12));
            artistRepository.save(new Artist(null, "Маркус Вольт", "Архитектор виртуальных миров.", "Digital Architecture", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200", "Токио", 8));
        }

        if (exhibitionRepository.count() == 0) {
            exhibitionRepository.save(new Exhibition(null, "Виртуальное безмолвие", "Исследование цифровой пустоты.", 
                "https://images.unsplash.com/photo-1554188248-986adbb73be4?auto=format&fit=crop&q=80&w=1200", 
                "https://player.vimeo.com/external/494270275.sd.mp4?s=d00ed50ef861c8567fdf8073b9ce967b57b78a00&profile_id=165",
                LocalDate.now(), LocalDate.now().plusMonths(1), "Галерея Нексус", "ACTIVE"));
            exhibitionRepository.save(new Exhibition(null, "Неоновые сны", "Ретроспектива киберпанка.", 
                "https://images.unsplash.com/photo-1511447333015-45b65e60f6d5?auto=format&fit=crop&q=80&w=1200", 
                null,
                LocalDate.now().plusMonths(2), LocalDate.now().plusMonths(3), "Облачный Зал", "UPCOMING"));
        }

        if (artworkRepository.count() == 0) {
            artworkRepository.save(new Artwork(null, "Эфирный поток", "Процедурная генерация.", 
                java.math.BigDecimal.valueOf(1250.0), 10.0, 
                "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=800", 
                "Серафина Блэк", null, Artwork.ArtworkStatus.AVAILABLE, java.time.LocalDateTime.now()));
                
            artworkRepository.save(new Artwork(null, "Обсидиановая структура", "Бруталистская архитектура.", 
                java.math.BigDecimal.valueOf(3400.0), 15.0, 
                "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=800", 
                "Маркус Вольт", null, Artwork.ArtworkStatus.AVAILABLE, java.time.LocalDateTime.now()));
                
            artworkRepository.save(new Artwork(null, "Золотой горизонт", "Теплый свет.", 
                java.math.BigDecimal.valueOf(850.0), 5.0, 
                "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800", 
                "Елена Рэй", null, Artwork.ArtworkStatus.AVAILABLE, java.time.LocalDateTime.now()));
                
            artworkRepository.save(new Artwork(null, "Неоновый разрез", "Минимализм.", 
                java.math.BigDecimal.valueOf(1800.0), 8.0, 
                "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=800", 
                "Елена Рэй", null, Artwork.ArtworkStatus.AVAILABLE, java.time.LocalDateTime.now()));
                
            artworkRepository.save(new Artwork(null, "Цифровой генезис", "Начало.", 
                java.math.BigDecimal.valueOf(950.0), 5.0, 
                "https://images.unsplash.com/photo-1633167606207-d840b5070fc2?auto=format&fit=crop&q=80&w=800", 
                "Серафина Блэк", null, Artwork.ArtworkStatus.AVAILABLE, java.time.LocalDateTime.now()));
                
            artworkRepository.save(new Artwork(null, "Метаморфоза", "Трансформация пространства.", 
                java.math.BigDecimal.valueOf(2100.0), 10.0, 
                "https://images.unsplash.com/photo-1558591710-4b4a1ae0f04d?auto=format&fit=crop&q=80&w=800", 
                "Маркус Вольт", null, Artwork.ArtworkStatus.AVAILABLE, java.time.LocalDateTime.now()));
                
            artworkRepository.save(new Artwork(null, "Свет будущего", "Оптимизм.", 
                java.math.BigDecimal.valueOf(1500.0), 7.0, 
                "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&q=80&w=800", 
                "Елена Рэй", null, Artwork.ArtworkStatus.AVAILABLE, java.time.LocalDateTime.now()));
        }
    }
}
