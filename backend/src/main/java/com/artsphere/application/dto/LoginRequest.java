package com.artsphere.application.dto;

public record LoginRequest(
    String email,
    String password
) {}
