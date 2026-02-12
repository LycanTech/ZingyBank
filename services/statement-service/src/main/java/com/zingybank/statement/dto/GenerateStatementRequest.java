package com.zingybank.statement.dto;

import com.zingybank.statement.model.StatementType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.time.LocalDate;

@Data
public class GenerateStatementRequest {
    @NotBlank
    private String accountNumber;

    @NotBlank
    private String userId;

    @NotNull
    private StatementType type;

    @NotNull
    private LocalDate periodStart;

    @NotNull
    private LocalDate periodEnd;
}
