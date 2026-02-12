package com.zingybank.audit.repository;

import com.zingybank.audit.model.AuditEvent;
import com.zingybank.audit.model.AuditSeverity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.Optional;

public interface AuditEventRepository extends JpaRepository<AuditEvent, String> {

    Page<AuditEvent> findByUserId(String userId, Pageable pageable);

    Page<AuditEvent> findByEntityTypeAndEntityId(String entityType, String entityId, Pageable pageable);

    Page<AuditEvent> findBySeverity(AuditSeverity severity, Pageable pageable);

    @Query("SELECT a FROM AuditEvent a WHERE a.timestamp >= :from AND a.timestamp <= :to ORDER BY a.timestamp DESC")
    Page<AuditEvent> findByDateRange(@Param("from") LocalDateTime from, @Param("to") LocalDateTime to, Pageable pageable);

    Optional<AuditEvent> findTopByOrderByTimestampDesc();
}
