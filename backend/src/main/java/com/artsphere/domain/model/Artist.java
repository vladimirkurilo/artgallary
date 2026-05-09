package com.artsphere.domain.model;

import jakarta.persistence.*;

@Entity
@Table(name = "artists")
public class Artist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String name;
    private String bio;
    private String specialty;
    private String avatarUrl;
    private String location;
    private Integer exhibitionCount;

    public Artist() {}

    public Artist(Long id, String name, String bio, String specialty, String avatarUrl, String location, Integer exhibitionCount) {
        this.id = id;
        this.name = name;
        this.bio = bio;
        this.specialty = specialty;
        this.avatarUrl = avatarUrl;
        this.location = location;
        this.exhibitionCount = exhibitionCount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getSpecialty() { return specialty; }
    public void setSpecialty(String specialty) { this.specialty = specialty; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public Integer getExhibitionCount() { return exhibitionCount; }
    public void setExhibitionCount(Integer exhibitionCount) { this.exhibitionCount = exhibitionCount; }
}
