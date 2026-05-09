package com.artsphere.web.controller;

import com.artsphere.application.dto.AuthResponse;
import com.artsphere.application.dto.LoginRequest;
import com.artsphere.domain.model.User;
import com.artsphere.infrastructure.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final JwtService jwtService;
    // В реальной системе здесь будет сервис пользователей и менеджер аутентификации
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest request) {
        // Упрощенная логика для демо: любой пароль подходит
        // В продакшене: authenticationManager.authenticate(...)
        
        // Создаем фейковые данные пользователя
        String token = "mock_jwt_token_" + request.email();
        Set<String> roles = request.email().equals("Vovkin06@gmail.com") 
            ? Set.of("ROLE_ADMIN", "ROLE_USER") 
            : Set.of("ROLE_USER");

        return ResponseEntity.ok(new AuthResponse(
            token, 
            request.email(), 
            "Art Collector", 
            roles
        ));
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody LoginRequest request) {
        return login(request);
    }
}
