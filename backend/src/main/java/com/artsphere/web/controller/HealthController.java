package com.artsphere.web.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {
    private final javax.sql.DataSource dataSource;

    public HealthController(javax.sql.DataSource dataSource) {
        this.dataSource = dataSource;
    }

    @GetMapping
    public Map<String, String> health() {
        String dbStatus = "UNKNOWN";
        try (java.sql.Connection conn = dataSource.getConnection()) {
            if (conn.isValid(1)) dbStatus = "OK";
        } catch (Exception e) {
            dbStatus = "ERROR: " + e.getMessage();
        }
        return Map.of("status", "UP", "database", dbStatus);
    }
}
