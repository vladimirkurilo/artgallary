package com.artsphere.application.dto;

import java.util.Set;

public record AuthResponse(
    String token,
    String email,
    String displayName,
    Set<String> roles
) {}
