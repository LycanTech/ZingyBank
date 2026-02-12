package com.zingybank.payment.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "payees")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Payee {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String name;

    private String accountNumber;
    private String routingNumber;
    private String billerCode;

    @Enumerated(EnumType.STRING)
    private PaymentType defaultPaymentType;

    private boolean verified;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
