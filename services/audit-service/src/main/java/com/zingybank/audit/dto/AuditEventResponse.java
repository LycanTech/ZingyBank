package com.zingybank.audit.dto;

import com.zingybank.audit.model.AuditSeverity;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class AuditEventResponse {
    private String id;
    private String userId;
    private String action;
    private String entityType;
    private String entityId;
    private String serviceName;
    private String details;
    private AuditSeverity severity;
    private LocalDateTime timestamp;
    private String eventHash;
}
