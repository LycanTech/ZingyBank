package com.zingybank.notification.dto;

import com.zingybank.notification.model.NotificationChannel;
import com.zingybank.notification.model.NotificationStatus;
import com.zingybank.notification.model.NotificationType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class NotificationResponse {
    private String id;
    private String userId;
    private NotificationType type;
    private NotificationChannel channel;
    private NotificationStatus status;
    private String subject;
    private LocalDateTime createdAt;
    private LocalDateTime sentAt;
}
