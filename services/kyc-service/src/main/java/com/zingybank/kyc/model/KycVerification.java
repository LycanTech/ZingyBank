package com.zingybank.kyc.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "kyc_verifications")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KycVerification {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String userId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private KycStatus status;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private KycLevel level;

    @Enumerated(EnumType.STRING)
    private DocumentType documentType;

    private String documentNumber;
    private String documentStoragePath;

    private String firstName;
    private String lastName;
    private LocalDate dateOfBirth;
    private String nationality;
    private String address;

    private boolean sanctionsChecked;
    private boolean pepChecked; // Politically Exposed Person
    private boolean amlChecked; // Anti-Money Laundering

    private String reviewedBy;
    private String rejectionReason;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime verifiedAt;
    private LocalDateTime expiresAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
