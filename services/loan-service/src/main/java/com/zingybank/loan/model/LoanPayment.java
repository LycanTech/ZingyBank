package com.zingybank.loan.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "loan_payments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoanPayment {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "loan_id", nullable = false)
    private Loan loan;

    @Column(nullable = false)
    private int paymentNumber;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal totalAmount;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal principalAmount;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal interestAmount;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal remainingBalance;

    @Enumerated(EnumType.STRING)
    private PaymentStatus paymentStatus;

    private LocalDateTime dueDate;
    private LocalDateTime paidAt;

    @Column(updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
