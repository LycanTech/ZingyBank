package com.zingybank.payment.dto;

import com.zingybank.payment.model.PaymentStatus;
import com.zingybank.payment.model.PaymentType;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class PaymentResponse {
    private String id;
    private String paymentReference;
    private String sourceAccountNumber;
    private String payeeId;
    private PaymentType paymentType;
    private PaymentStatus status;
    private BigDecimal amount;
    private String currency;
    private String description;
    private LocalDate scheduledDate;
    private boolean recurring;
    private LocalDateTime createdAt;
    private LocalDateTime processedAt;
}
