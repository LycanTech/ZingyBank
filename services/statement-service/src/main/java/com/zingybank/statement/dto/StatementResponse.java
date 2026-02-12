package com.zingybank.statement.dto;

import com.zingybank.statement.model.StatementStatus;
import com.zingybank.statement.model.StatementType;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
public class StatementResponse {
    private String id;
    private String accountNumber;
    private StatementType type;
    private StatementStatus status;
    private LocalDate periodStart;
    private LocalDate periodEnd;
    private LocalDateTime createdAt;
    private LocalDateTime generatedAt;
}
