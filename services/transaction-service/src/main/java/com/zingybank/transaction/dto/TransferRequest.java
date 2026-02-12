package com.zingybank.transaction.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class TransferRequest {
    @NotBlank
    private String sourceAccountNumber;
    @NotBlank
    private String destinationAccountNumber;
    @NotNull @DecimalMin(value = "0.01")
    private BigDecimal amount;
    @NotBlank
    private String currency;
    private String description;
    @NotBlank
    private String initiatedBy;
}
