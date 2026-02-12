package com.zingybank.audit.service;

import com.zingybank.audit.dto.AuditEventRequest;
import com.zingybank.audit.dto.AuditEventResponse;
import com.zingybank.audit.model.AuditEvent;
import com.zingybank.audit.model.AuditSeverity;
import com.zingybank.audit.repository.AuditEventRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuditService {

    private final AuditEventRepository auditEventRepository;

    @Transactional
    public AuditEventResponse recordEvent(AuditEventRequest request) {
        // Get the previous event hash for chain integrity
        String previousHash = auditEventRepository.findTopByOrderByTimestampDesc()
                .map(AuditEvent::getEventHash)
                .orElse("GENESIS");

        AuditEvent event = AuditEvent.builder()
                .userId(request.getUserId())
                .action(request.getAction())
                .entityType(request.getEntityType())
                .entityId(request.getEntityId())
                .serviceName(request.getServiceName())
                .details(request.getDetails())
                .previousState(request.getPreviousState())
                .newState(request.getNewState())
                .ipAddress(request.getIpAddress())
                .userAgent(request.getUserAgent())
                .severity(request.getSeverity())
                .timestamp(LocalDateTime.now())
                .previousEventHash(previousHash)
                .build();

        // Compute SHA-256 hash for tamper detection
        String hashInput = previousHash + "|" + event.getUserId() + "|" + event.getAction()
                + "|" + event.getEntityType() + "|" + event.getEntityId()
                + "|" + event.getTimestamp();
        event.setEventHash(computeSha256(hashInput));

        event = auditEventRepository.save(event);
        log.info("Audit event recorded: {} - {} on {}/{}",
                event.getId(), event.getAction(), event.getEntityType(), event.getEntityId());

        return toResponse(event);
    }

    public Page<AuditEventResponse> getByUser(String userId, Pageable pageable) {
        return auditEventRepository.findByUserId(userId, pageable).map(this::toResponse);
    }

    public Page<AuditEventResponse> getByEntity(String entityType, String entityId, Pageable pageable) {
        return auditEventRepository.findByEntityTypeAndEntityId(entityType, entityId, pageable).map(this::toResponse);
    }

    public Page<AuditEventResponse> getBySeverity(AuditSeverity severity, Pageable pageable) {
        return auditEventRepository.findBySeverity(severity, pageable).map(this::toResponse);
    }

    public Page<AuditEventResponse> getByDateRange(LocalDateTime from, LocalDateTime to, Pageable pageable) {
        return auditEventRepository.findByDateRange(from, to, pageable).map(this::toResponse);
    }

    private String computeSha256(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 algorithm not available", e);
        }
    }

    private AuditEventResponse toResponse(AuditEvent event) {
        return AuditEventResponse.builder()
                .id(event.getId())
                .userId(event.getUserId())
                .action(event.getAction())
                .entityType(event.getEntityType())
                .entityId(event.getEntityId())
                .serviceName(event.getServiceName())
                .details(event.getDetails())
                .severity(event.getSeverity())
                .timestamp(event.getTimestamp())
                .eventHash(event.getEventHash())
                .build();
    }
}
