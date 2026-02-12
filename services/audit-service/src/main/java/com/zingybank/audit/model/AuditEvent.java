package com.zingybank.audit.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "audit_events", indexes = {
    @Index(name = "idx_audit_user_id", columnList = "userId"),
    @Index(name = "idx_audit_entity", columnList = "entityType, entityId"),
    @Index(name = "idx_audit_timestamp", columnList = "timestamp"),
    @Index(name = "idx_audit_action", columnList = "action")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AuditEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String action;

    @Column(nullable = false)
    private String entityType;

    @Column(nullable = false)
    private String entityId;

    @Column(nullable = false)
    private String serviceName;

    @Column(columnDefinition = "TEXT")
    private String details;

    @Column(columnDefinition = "TEXT")
    private String previousState;

    @Column(columnDefinition = "TEXT")
    private String newState;

    private String ipAddress;

    private String userAgent;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AuditSeverity severity;

    @Column(nullable = false, updatable = false)
    private LocalDateTime timestamp;

    private String previousEventHash;

    @Column(nullable = false)
    private String eventHash;

    @PrePersist
    protected void onCreate() {
        if (timestamp == null) {
            timestamp = LocalDateTime.now();
        }
    }
}
