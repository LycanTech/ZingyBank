package com.zingybank.statement.controller;

import com.zingybank.statement.dto.GenerateStatementRequest;
import com.zingybank.statement.dto.StatementResponse;
import com.zingybank.statement.service.StatementService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/statements")
@RequiredArgsConstructor
public class StatementController {

    private final StatementService statementService;

    @PostMapping("/generate")
    public ResponseEntity<StatementResponse> generate(@Valid @RequestBody GenerateStatementRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(statementService.requestStatement(request));
    }

    @GetMapping("/{id}")
    public ResponseEntity<StatementResponse> getStatement(@PathVariable String id) {
        return ResponseEntity.ok(statementService.getStatement(id));
    }

    @GetMapping("/account/{accountNumber}")
    public ResponseEntity<Page<StatementResponse>> getAccountStatements(
            @PathVariable String accountNumber, Pageable pageable) {
        return ResponseEntity.ok(statementService.getAccountStatements(accountNumber, pageable));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Statement Service is running");
    }
}
