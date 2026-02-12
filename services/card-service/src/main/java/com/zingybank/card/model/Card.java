package com.zingybank.card.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "cards")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Card {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String linkedAccountNumber;

    // Stored encrypted — never log or expose full number
    @Column(nullable = false)
    private String encryptedCardNumber;

    @Column(nullable = false)
    private String maskedCardNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CardType cardType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private CardStatus status;

    @Column(nullable = false)
    private LocalDate expiryDate;

    // Encrypted PIN hash
    private String pinHash;

    @Column(precision = 19, scale = 4)
    private BigDecimal dailyLimit;

    @Column(precision = 19, scale = 4)
    private BigDecimal monthlyLimit;

    private boolean contactlessEnabled;
    private boolean internationalEnabled;
    private boolean onlineTransactionsEnabled;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime activatedAt;

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
