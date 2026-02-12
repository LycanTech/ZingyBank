package com.zingybank.loan.dto;

import com.zingybank.loan.model.LoanType;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class LoanApplicationRequest {
    @NotBlank
    private String userId;
    @NotBlank
    private String disbursementAccountNumber;
    @NotNull
    private LoanType loanType;
    @NotNull @DecimalMin("1000")
    private BigDecimal principalAmount;
    @NotNull @Min(1) @Max(360)
    private int termMonths;
}
