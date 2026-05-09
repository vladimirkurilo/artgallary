package com.artsphere.web.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PaymentController {

    @PostMapping("/checkout")
    public ResponseEntity<String> checkout(@RequestParam Long artworkId) {
        // В реальном приложении здесь была бы интеграция со Stripe
        // Мы возвращаем URL успеха для фронтенда
        String successUrl = "/success?artworkId=" + artworkId;
        return ResponseEntity.ok(successUrl);
    }
}
