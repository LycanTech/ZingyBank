package com.zingybank.loan.controller;

import com.zingybank.loan.dto.*;
import com.zingybank.loan.service.LoanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    @PostMapping("/apply")
    public ResponseEntity<LoanResponse> applyForLoan(@Valid @RequestBody LoanApplicationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(loanService.applyForLoan(request));
    }

    @GetMapping("/{loanId}")
    public ResponseEntity<LoanResponse> getLoan(@PathVariable String loanId) {
        return ResponseEntity.ok(loanService.getLoan(loanId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<LoanResponse>> getUserLoans(@PathVariable String userId) {
        return ResponseEntity.ok(loanService.getUserLoans(userId));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Loan Service is running");
    }
}
