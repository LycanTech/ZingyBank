package com.zingybank.account.dto;

import com.zingybank.account.model.AccountStatus;
import com.zingybank.account.model.AccountType;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class AccountResponse {
    private String id;
    private String accountNumber;
    private String userId;
    private AccountType accountType;
    private AccountStatus status;
    private BigDecimal balance;
    private String currency;
    private BigDecimal interestRate;
    private LocalDateTime createdAt;
}
