package com.zingybank.statement.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "statements")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Statement {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String accountNumber;

    @Column(nullable = false)
    private String userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatementType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private StatementStatus status;

    @Column(nullable = false)
    private LocalDate periodStart;

    @Column(nullable = false)
    private LocalDate periodEnd;

    private String storagePath;

    private Long fileSizeBytes;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime generatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
