package com.zingybank.kyc.controller;

import com.zingybank.kyc.dto.*;
import com.zingybank.kyc.service.KycService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/kyc")
@RequiredArgsConstructor
public class KycController {

    private final KycService kycService;

    @PostMapping("/submit")
    public ResponseEntity<KycResponse> submitKyc(@Valid @RequestBody KycSubmissionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(kycService.submitKyc(request));
    }

    @PostMapping("/{kycId}/approve")
    public ResponseEntity<KycResponse> approveKyc(@PathVariable String kycId, @RequestParam String reviewerId) {
        return ResponseEntity.ok(kycService.approveKyc(kycId, reviewerId));
    }

    @PostMapping("/{kycId}/reject")
    public ResponseEntity<KycResponse> rejectKyc(@PathVariable String kycId, @RequestParam String reviewerId, @RequestParam String reason) {
        return ResponseEntity.ok(kycService.rejectKyc(kycId, reviewerId, reason));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<KycResponse> getLatestKyc(@PathVariable String userId) {
        return ResponseEntity.ok(kycService.getLatestKyc(userId));
    }

    @GetMapping("/pending")
    public ResponseEntity<Page<KycResponse>> getPendingReviews(Pageable pageable) {
        return ResponseEntity.ok(kycService.getPendingReviews(pageable));
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("KYC Service is running");
    }
}
