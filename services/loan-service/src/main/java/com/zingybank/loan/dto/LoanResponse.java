package com.zingybank.loan.dto;

import com.zingybank.loan.model.LoanStatus;
import com.zingybank.loan.model.LoanType;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class LoanResponse {
    private String id;
    private String loanNumber;
    private String userId;
    private LoanType loanType;
    private LoanStatus status;
    private BigDecimal principalAmount;
    private BigDecimal outstandingBalance;
    private BigDecimal interestRate;
    private int termMonths;
    private BigDecimal monthlyPayment;
    private LocalDate startDate;
    private LocalDate endDate;
    private LocalDate nextPaymentDate;
    private LocalDateTime createdAt;
}
