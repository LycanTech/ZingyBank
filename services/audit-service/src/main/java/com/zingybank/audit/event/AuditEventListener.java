package com.zingybank.audit.event;

import com.zingybank.audit.dto.AuditEventRequest;
import com.zingybank.audit.model.AuditSeverity;
import com.zingybank.audit.service.AuditService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class AuditEventListener {

    private final AuditService auditService;

    @KafkaListener(topics = "transaction-events", groupId = "audit-service")
    public void handleTransactionEvent(Map<String, Object> event) {
        log.info("Received transaction event for audit: {}", event.get("event"));
        recordFromEvent(event, "TRANSACTION", AuditSeverity.INFO);
    }

    @KafkaListener(topics = "account-events", groupId = "audit-service")
    public void handleAccountEvent(Map<String, Object> event) {
        log.info("Received account event for audit: {}", event.get("event"));
        recordFromEvent(event, "ACCOUNT", AuditSeverity.INFO);
    }

    @KafkaListener(topics = "payment-events", groupId = "audit-service")
    public void handlePaymentEvent(Map<String, Object> event) {
        log.info("Received payment event for audit: {}", event.get("event"));
        recordFromEvent(event, "PAYMENT", AuditSeverity.INFO);
    }

    @KafkaListener(topics = "loan-events", groupId = "audit-service")
    public void handleLoanEvent(Map<String, Object> event) {
        log.info("Received loan event for audit: {}", event.get("event"));
        recordFromEvent(event, "LOAN", AuditSeverity.INFO);
    }

    @KafkaListener(topics = "card-events", groupId = "audit-service")
    public void handleCardEvent(Map<String, Object> event) {
        log.info("Received card event for audit: {}", event.get("event"));
        String eventType = getStringValue(event, "event");
        AuditSeverity severity = eventType != null && eventType.contains("BLOCKED")
                ? AuditSeverity.SECURITY : AuditSeverity.INFO;
        recordFromEvent(event, "CARD", severity);
    }

    @KafkaListener(topics = "kyc-events", groupId = "audit-service")
    public void handleKycEvent(Map<String, Object> event) {
        log.info("Received KYC event for audit: {}", event.get("event"));
        String eventType = getStringValue(event, "event");
        AuditSeverity severity = eventType != null && eventType.contains("REJECTED")
                ? AuditSeverity.WARNING : AuditSeverity.INFO;
        recordFromEvent(event, "KYC", severity);
    }

    private void recordFromEvent(Map<String, Object> event, String entityType, AuditSeverity severity) {
        try {
            AuditEventRequest request = new AuditEventRequest();
            request.setUserId(getStringValue(event, "userId"));
            request.setAction(getStringValue(event, "event"));
            request.setEntityType(entityType);
            request.setEntityId(getStringValue(event, "entityId"));
            request.setServiceName(getStringValue(event, "serviceName"));
            request.setDetails(event.toString());
            request.setSeverity(severity);
            auditService.recordEvent(request);
        } catch (Exception e) {
            log.error("Failed to record audit event from Kafka message: {}", e.getMessage(), e);
        }
    }

    private String getStringValue(Map<String, Object> event, String key) {
        Object value = event.get(key);
        return value != null ? value.toString() : "unknown";
    }
}
