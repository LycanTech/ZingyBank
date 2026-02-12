package com.zingybank.notification.controller;

import com.zingybank.notification.dto.NotificationResponse;
import com.zingybank.notification.dto.SendNotificationRequest;
import com.zingybank.notification.service.NotificationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/notifications")
@RequiredArgsConstructor
public class NotificationController {

    private final NotificationService notificationService;

    @PostMapping
    public ResponseEntity<NotificationResponse> send(@Valid @RequestBody SendNotificationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(notificationService.sendNotification(request));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<NotificationResponse>> getUserNotifications(
            @PathVariable String userId, Pageable pageable) {
        return ResponseEntity.ok(notificationService.getUserNotifications(userId, pageable));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Notification Service is running");
    }
}
