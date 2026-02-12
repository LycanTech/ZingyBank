package com.zingybank.audit.dto;

import com.zingybank.audit.model.AuditSeverity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AuditEventRequest {
    @NotBlank
    private String userId;

    @NotBlank
    private String action;

    @NotBlank
    private String entityType;

    @NotBlank
    private String entityId;

    @NotBlank
    private String serviceName;

    private String details;

    private String previousState;

    private String newState;

    private String ipAddress;

    private String userAgent;

    @NotNull
    private AuditSeverity severity;
}
