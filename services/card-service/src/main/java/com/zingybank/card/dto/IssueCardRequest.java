package com.zingybank.card.dto;

import com.zingybank.card.model.CardType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.math.BigDecimal;

@Data
public class IssueCardRequest {
    @NotBlank
    private String userId;
    @NotBlank
    private String linkedAccountNumber;
    @NotNull
    private CardType cardType;
    private BigDecimal dailyLimit;
    private BigDecimal monthlyLimit;
    private boolean contactlessEnabled;
    private boolean internationalEnabled;
    private boolean onlineTransactionsEnabled;
}
