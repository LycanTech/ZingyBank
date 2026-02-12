package com.zingybank.transaction.controller;

import com.zingybank.transaction.dto.*;
import com.zingybank.transaction.service.TransactionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/v1/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping("/transfer")
    public ResponseEntity<TransactionResponse> transfer(@Valid @RequestBody TransferRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(transactionService.initiateTransfer(request));
    }

    @GetMapping("/reference/{referenceNumber}")
    public ResponseEntity<TransactionResponse> getByReference(@PathVariable String referenceNumber) {
        return ResponseEntity.ok(transactionService.getByReference(referenceNumber));
    }

    @GetMapping("/account/{accountNumber}")
    public ResponseEntity<Page<TransactionResponse>> getAccountTransactions(
            @PathVariable String accountNumber,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime to,
            Pageable pageable) {
        if (from != null && to != null) {
            return ResponseEntity.ok(transactionService.getAccountTransactionsByDateRange(accountNumber, from, to, pageable));
        }
        return ResponseEntity.ok(transactionService.getAccountTransactions(accountNumber, pageable));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Transaction Service is running");
    }
}
