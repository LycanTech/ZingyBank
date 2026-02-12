package com.zingybank.audit.controller;

import com.zingybank.audit.dto.AuditEventRequest;
import com.zingybank.audit.dto.AuditEventResponse;
import com.zingybank.audit.model.AuditSeverity;
import com.zingybank.audit.service.AuditService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/audit")
@RequiredArgsConstructor
public class AuditController {

    private final AuditService auditService;

    @PostMapping
    public ResponseEntity<AuditEventResponse> recordEvent(@Valid @RequestBody AuditEventRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(auditService.recordEvent(request));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<Page<AuditEventResponse>> getByUser(
            @PathVariable String userId, Pageable pageable) {
        return ResponseEntity.ok(auditService.getByUser(userId, pageable));
    }

    @GetMapping("/entity/{type}/{id}")
    public ResponseEntity<Page<AuditEventResponse>> getByEntity(
            @PathVariable String type, @PathVariable String id, Pageable pageable) {
        return ResponseEntity.ok(auditService.getByEntity(type, id, pageable));
    }

    @GetMapping("/severity/{severity}")
    public ResponseEntity<Page<AuditEventResponse>> getBySeverity(
            @PathVariable AuditSeverity severity, Pageable pageable) {
        return ResponseEntity.ok(auditService.getBySeverity(severity, pageable));
    }

    @GetMapping("/range")
    public ResponseEntity<Page<AuditEventResponse>> getByDateRange(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            Pageable pageable) {
        return ResponseEntity.ok(auditService.getByDateRange(from, to, pageable));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Audit Service is running");
    }
}
