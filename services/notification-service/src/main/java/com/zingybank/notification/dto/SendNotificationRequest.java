package com.zingybank.notification.dto;

import com.zingybank.notification.model.NotificationChannel;
import com.zingybank.notification.model.NotificationType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class SendNotificationRequest {
    @NotBlank
    private String userId;

    @NotNull
    private NotificationType type;

    @NotNull
    private NotificationChannel channel;

    @NotBlank
    private String subject;

    @NotBlank
    private String body;

    @NotBlank
    private String recipient;
}
