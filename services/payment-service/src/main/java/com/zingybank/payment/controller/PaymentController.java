package com.zingybank.payment.controller;

import com.zingybank.payment.dto.*;
import com.zingybank.payment.service.PaymentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentResponse> createPayment(@Valid @RequestBody CreatePaymentRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(paymentService.createPayment(request));
    }

    @GetMapping("/reference/{reference}")
    public ResponseEntity<PaymentResponse> getByReference(@PathVariable String reference) {
        return ResponseEntity.ok(paymentService.getByReference(reference));
    }

    @GetMapping("/account/{accountNumber}")
    public ResponseEntity<Page<PaymentResponse>> getByAccount(@PathVariable String accountNumber, Pageable pageable) {
        return ResponseEntity.ok(paymentService.getPaymentsByAccount(accountNumber, pageable));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Payment Service is running");
    }
}
