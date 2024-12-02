package com.shopping.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthCheckController {
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        String responseContent = "<!DOCTYPE html>" +
                "<html>" +
                "<head><title>Server Health Check</title></head>" +
                "<body>" +
                "<div style='text-align: center; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);'>" +
                "<h2 style='color: green;'>✨...Server is running...✨</h2>" +
                "<p>All systems are operational.</p>" +
                "</div>" +
                "</body>" +
                "</html>";

        return ResponseEntity.ok(responseContent);
    }

    @GetMapping("/error")
    public ResponseEntity<String> handleError() {
        String errorPage = "<!DOCTYPE html>" +
                "<html>" +
                "<head><title>Error</title></head>" +
                "<body>" +
                "<div style='text-align: center; position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);'>" +
                "<h2 style='color: red;'>Oops! Something went wrong</h2>" +
                "<p>We're sorry, but the page you're looking for cannot be found.</p>" +
                "</div>" +
                "</body>" +
                "</html>";
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(errorPage);
    }
}