package com.zingybank.loan.service;

import com.zingybank.loan.dto.*;
import com.zingybank.loan.model.*;
import com.zingybank.loan.repository.LoanRepository;
import com.zingybank.loan.repository.LoanPaymentRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.MathContext;
import java.math.RoundingMode;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class LoanService {

    private final LoanRepository loanRepository;
    private final LoanPaymentRepository loanPaymentRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Transactional
    public LoanResponse applyForLoan(LoanApplicationRequest request) {
        BigDecimal interestRate = determineInterestRate(request.getLoanType());
        BigDecimal monthlyPayment = calculateMonthlyPayment(request.getPrincipalAmount(), interestRate, request.getTermMonths());

        Loan loan = Loan.builder()
                .loanNumber("LN-" + UUID.randomUUID().toString().substring(0, 10).toUpperCase())
                .userId(request.getUserId())
                .disbursementAccountNumber(request.getDisbursementAccountNumber())
                .loanType(request.getLoanType())
                .status(LoanStatus.APPLICATION)
                .principalAmount(request.getPrincipalAmount())
                .outstandingBalance(request.getPrincipalAmount())
                .interestRate(interestRate)
                .termMonths(request.getTermMonths())
                .monthlyPayment(monthlyPayment)
                .build();

        loan = loanRepository.save(loan);
        log.info("Loan application submitted: {} for user: {}", loan.getLoanNumber(), request.getUserId());

        kafkaTemplate.send("loan-events", loan.getId(),
                Map.of("event", "LOAN_APPLICATION_SUBMITTED", "loanId", loan.getId(), "userId", request.getUserId()));

        return toResponse(loan);
    }

    public LoanResponse getLoan(String loanId) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new IllegalArgumentException("Loan not found"));
        return toResponse(loan);
    }

    public List<LoanResponse> getUserLoans(String userId) {
        return loanRepository.findByUserId(userId).stream().map(this::toResponse).collect(Collectors.toList());
    }

    private BigDecimal determineInterestRate(LoanType type) {
        return switch (type) {
            case PERSONAL -> new BigDecimal("8.99");
            case MORTGAGE -> new BigDecimal("6.50");
            case AUTO -> new BigDecimal("5.75");
            case STUDENT -> new BigDecimal("4.50");
            case BUSINESS -> new BigDecimal("7.25");
            case HOME_EQUITY -> new BigDecimal("7.00");
            case CREDIT_LINE -> new BigDecimal("12.99");
        };
    }

    private BigDecimal calculateMonthlyPayment(BigDecimal principal, BigDecimal annualRate, int termMonths) {
        BigDecimal monthlyRate = annualRate.divide(BigDecimal.valueOf(1200), 10, RoundingMode.HALF_UP);
        BigDecimal onePlusR = BigDecimal.ONE.add(monthlyRate);
        BigDecimal pow = onePlusR.pow(termMonths, new MathContext(20));
        BigDecimal numerator = principal.multiply(monthlyRate).multiply(pow);
        BigDecimal denominator = pow.subtract(BigDecimal.ONE);
        return numerator.divide(denominator, 4, RoundingMode.HALF_UP);
    }

    private LoanResponse toResponse(Loan loan) {
        return LoanResponse.builder()
                .id(loan.getId()).loanNumber(loan.getLoanNumber()).userId(loan.getUserId())
                .loanType(loan.getLoanType()).status(loan.getStatus())
                .principalAmount(loan.getPrincipalAmount()).outstandingBalance(loan.getOutstandingBalance())
                .interestRate(loan.getInterestRate()).termMonths(loan.getTermMonths())
                .monthlyPayment(loan.getMonthlyPayment()).startDate(loan.getStartDate())
                .endDate(loan.getEndDate()).nextPaymentDate(loan.getNextPaymentDate())
                .createdAt(loan.getCreatedAt())
                .build();
    }
}
