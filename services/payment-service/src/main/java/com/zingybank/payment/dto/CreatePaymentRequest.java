package com.zingybank.payment.dto;

import com.zingybank.payment.model.PaymentType;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class CreatePaymentRequest {
    @NotBlank
    private String sourceAccountNumber;
    @NotBlank
    private String payeeId;
    @NotNull
    private PaymentType paymentType;
    @NotNull @DecimalMin("0.01")
    private BigDecimal amount;
    @NotBlank
    private String currency;
    private String description;
    private LocalDate scheduledDate;
    private boolean recurring;
    private String recurringFrequency;
    @NotBlank
    private String initiatedBy;
}
