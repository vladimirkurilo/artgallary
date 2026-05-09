package com.artsphere.application.dto;

import java.util.Set;

public class AuthResponse {
    private String token;
    private String email;
    private String displayName;
    private Set<String> roles;

    public AuthResponse() {}

    public AuthResponse(String token, String email, String displayName, Set<String> roles) {
        this.token = token;
        this.email = email;
        this.displayName = displayName;
        this.roles = roles;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getDisplayName() { return displayName; }
    public void setDisplayName(String displayName) { this.displayName = displayName; }
    public Set<String> getRoles() { return roles; }
    public void setRoles(Set<String> roles) { this.roles = roles; }
}
