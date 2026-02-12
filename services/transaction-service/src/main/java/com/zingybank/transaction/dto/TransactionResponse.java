package com.zingybank.transaction.dto;

import com.zingybank.transaction.model.TransactionStatus;
import com.zingybank.transaction.model.TransactionType;
import lombok.Builder;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
public class TransactionResponse {
    private String id;
    private String referenceNumber;
    private TransactionType type;
    private TransactionStatus status;
    private String sourceAccountNumber;
    private String destinationAccountNumber;
    private BigDecimal amount;
    private String currency;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;
}
