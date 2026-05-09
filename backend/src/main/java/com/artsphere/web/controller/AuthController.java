package com.artsphere.web.controller;

import com.artsphere.application.dto.AuthResponse;
import com.artsphere.application.dto.LoginRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        // Упрощенная логика для демо: любой пароль подходит
        
        String userEmail = request != null && request.getEmail() != null ? request.getEmail() : "demo@example.com";
        String token = "mock_jwt_token_" + userEmail;
        java.util.Set<String> roles = userEmail.equalsIgnoreCase("Vovkin06@gmail.com") 
            ? java.util.Set.of("ROLE_ADMIN", "ROLE_USER") 
            : java.util.Set.of("ROLE_USER");

        return ResponseEntity.ok(new AuthResponse(
            token, 
            userEmail, 
            "Art Collector", 
            roles
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody LoginRequest request) {
        return login(request);
    }
}
