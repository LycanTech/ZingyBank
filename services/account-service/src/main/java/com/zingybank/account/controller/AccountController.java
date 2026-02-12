package com.zingybank.account.controller;

import com.zingybank.account.dto.*;
import com.zingybank.account.service.AccountService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    @PostMapping
    public ResponseEntity<AccountResponse> createAccount(@Valid @RequestBody CreateAccountRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(accountService.createAccount(request));
    }

    @GetMapping("/{accountId}")
    public ResponseEntity<AccountResponse> getAccount(@PathVariable String accountId) {
        return ResponseEntity.ok(accountService.getAccount(accountId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<AccountResponse>> getAccountsByUser(@PathVariable String userId) {
        return ResponseEntity.ok(accountService.getAccountsByUserId(userId));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Account Service is running");
    }
}
