package com.zingybank.notification.service;

import com.zingybank.notification.dto.NotificationResponse;
import com.zingybank.notification.dto.SendNotificationRequest;
import com.zingybank.notification.model.Notification;
import com.zingybank.notification.model.NotificationChannel;
import com.zingybank.notification.model.NotificationStatus;
import com.zingybank.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final JavaMailSender mailSender;

    @Transactional
    public NotificationResponse sendNotification(SendNotificationRequest request) {
        Notification notification = Notification.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .channel(request.getChannel())
                .status(NotificationStatus.PENDING)
                .subject(request.getSubject())
                .body(request.getBody())
                .recipient(request.getRecipient())
                .retryCount(0)
                .build();
        notification = notificationRepository.save(notification);

        try {
            if (request.getChannel() == NotificationChannel.EMAIL) {
                SimpleMailMessage msg = new SimpleMailMessage();
                msg.setTo(request.getRecipient());
                msg.setSubject(request.getSubject());
                msg.setText(request.getBody());
                msg.setFrom("noreply@zingybank.com");
                mailSender.send(msg);
            }
            notification.setStatus(NotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());
            log.info("Notification sent: {} to {}", notification.getId(), request.getRecipient());
        } catch (Exception e) {
            notification.setStatus(NotificationStatus.FAILED);
            notification.setFailureReason(e.getMessage());
            log.error("Failed to send notification: {}", e.getMessage());
        }

        notification = notificationRepository.save(notification);
        return toResponse(notification);
    }

    public Page<NotificationResponse> getUserNotifications(String userId, Pageable pageable) {
        return notificationRepository.findByUserId(userId, pageable).map(this::toResponse);
    }

    private NotificationResponse toResponse(Notification n) {
        return NotificationResponse.builder()
                .id(n.getId())
                .userId(n.getUserId())
                .type(n.getType())
                .channel(n.getChannel())
                .status(n.getStatus())
                .subject(n.getSubject())
                .createdAt(n.getCreatedAt())
                .sentAt(n.getSentAt())
                .build();
    }
}
