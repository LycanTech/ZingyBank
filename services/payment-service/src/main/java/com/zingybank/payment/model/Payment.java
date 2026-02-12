package com.zingybank.payment.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, nullable = false)
    private String paymentReference;

    @Column(nullable = false)
    private String sourceAccountNumber;

    @Column(nullable = false)
    private String payeeId;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentType paymentType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PaymentStatus status;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal amount;

    @Column(nullable = false, length = 3)
    private String currency;

    private String description;
    private LocalDate scheduledDate;
    private boolean recurring;
    private String recurringFrequency;

    @Column(nullable = false)
    private String initiatedBy;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime processedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
