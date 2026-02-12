package com.zingybank.loan.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "loans")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Loan {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private String id;

    @Column(unique = true, nullable = false)
    private String loanNumber;

    @Column(nullable = false)
    private String userId;

    @Column(nullable = false)
    private String disbursementAccountNumber;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LoanType loanType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private LoanStatus status;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal principalAmount;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal outstandingBalance;

    @Column(nullable = false, precision = 5, scale = 2)
    private BigDecimal interestRate;

    @Column(nullable = false)
    private int termMonths;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal monthlyPayment;

    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate nextPaymentDate;

    @Column(updatable = false)
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime approvedAt;

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
