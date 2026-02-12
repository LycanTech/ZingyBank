package com.zingybank.account.dto;

import com.zingybank.account.model.AccountType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class CreateAccountRequest {
    @NotBlank
    private String userId;
    @NotNull
    private AccountType accountType;
    private String currency;
    private BigDecimal initialDeposit;
}
