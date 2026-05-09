package com.artsphere.domain.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Table(name = "exhibitions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Exhibition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String description;
    private String imageUrl;
    private String videoUrl;
    private LocalDate startDate;
    private LocalDate endDate;
    private String location;
    private String status; // UPCOMING, ACTIVE, FINISHED
}
