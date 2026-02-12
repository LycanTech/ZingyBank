package com.zingybank.card.dto;

import com.zingybank.card.model.CardStatus;
import com.zingybank.card.model.CardType;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class CardResponse {
    private String id;
    private String userId;
    private String linkedAccountNumber;
    private String maskedCardNumber;
    private CardType cardType;
    private CardStatus status;
    private LocalDate expiryDate;
    private BigDecimal dailyLimit;
    private BigDecimal monthlyLimit;
    private boolean contactlessEnabled;
    private boolean internationalEnabled;
    private boolean onlineTransactionsEnabled;
    private LocalDateTime createdAt;
    private LocalDateTime activatedAt;
}
