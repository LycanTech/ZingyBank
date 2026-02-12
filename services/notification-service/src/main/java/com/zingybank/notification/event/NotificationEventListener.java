package com.zingybank.notification.event;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class NotificationEventListener {

    @KafkaListener(topics = "transaction-events", groupId = "notification-service")
    public void handleTransactionEvent(Map<String, Object> event) {
        log.info("Received transaction event: {}", event.get("event"));
    }

    @KafkaListener(topics = "account-events", groupId = "notification-service")
    public void handleAccountEvent(Map<String, Object> event) {
        log.info("Received account event: {}", event.get("event"));
    }

    @KafkaListener(topics = "card-events", groupId = "notification-service")
    public void handleCardEvent(Map<String, Object> event) {
        log.info("Received card event: {}", event.get("event"));
    }

    @KafkaListener(topics = "kyc-events", groupId = "notification-service")
    public void handleKycEvent(Map<String, Object> event) {
        log.info("Received KYC event: {}", event.get("event"));
    }
}
