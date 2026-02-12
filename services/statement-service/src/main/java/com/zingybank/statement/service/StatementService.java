package com.zingybank.statement.service;

import com.zingybank.statement.dto.GenerateStatementRequest;
import com.zingybank.statement.dto.StatementResponse;
import com.zingybank.statement.model.Statement;
import com.zingybank.statement.model.StatementStatus;
import com.zingybank.statement.repository.StatementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
@Slf4j
public class StatementService {

    private final StatementRepository statementRepository;

    @Transactional
    public StatementResponse requestStatement(GenerateStatementRequest request) {
        Statement statement = Statement.builder()
                .accountNumber(request.getAccountNumber())
                .userId(request.getUserId())
                .type(request.getType())
                .status(StatementStatus.REQUESTED)
                .periodStart(request.getPeriodStart())
                .periodEnd(request.getPeriodEnd())
                .build();
        statement = statementRepository.save(statement);
        log.info("Statement requested: {} for account {}", statement.getId(), request.getAccountNumber());

        // Simulate async generation
        try {
            statement.setStatus(StatementStatus.GENERATING);
            statement = statementRepository.save(statement);

            // In production, this would trigger async PDF generation
            statement.setStatus(StatementStatus.READY);
            statement.setGeneratedAt(LocalDateTime.now());
            statement.setStoragePath("/statements/" + statement.getId() + ".pdf");
            statement = statementRepository.save(statement);
            log.info("Statement generated: {}", statement.getId());
        } catch (Exception e) {
            statement.setStatus(StatementStatus.FAILED);
            statement = statementRepository.save(statement);
            log.error("Statement generation failed: {}", e.getMessage());
        }

        return toResponse(statement);
    }

    public StatementResponse getStatement(String id) {
        Statement statement = statementRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Statement not found: " + id));
        return toResponse(statement);
    }

    public Page<StatementResponse> getAccountStatements(String accountNumber, Pageable pageable) {
        return statementRepository.findByAccountNumber(accountNumber, pageable).map(this::toResponse);
    }

    private StatementResponse toResponse(Statement s) {
        return StatementResponse.builder()
                .id(s.getId())
                .accountNumber(s.getAccountNumber())
                .type(s.getType())
                .status(s.getStatus())
                .periodStart(s.getPeriodStart())
                .periodEnd(s.getPeriodEnd())
                .createdAt(s.getCreatedAt())
                .generatedAt(s.getGeneratedAt())
                .build();
    }
}
