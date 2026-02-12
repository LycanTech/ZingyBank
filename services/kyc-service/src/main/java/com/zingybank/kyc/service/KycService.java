package com.zingybank.kyc.service;

import com.zingybank.kyc.dto.*;
import com.zingybank.kyc.model.*;
import com.zingybank.kyc.repository.KycVerificationRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class KycService {

    private final KycVerificationRepository kycRepository;
    private final KafkaTemplate<String, Object> kafkaTemplate;

    @Transactional
    public KycResponse submitKyc(KycSubmissionRequest request) {
        KycVerification kyc = KycVerification.builder()
                .userId(request.getUserId())
                .status(KycStatus.DOCUMENTS_SUBMITTED)
                .level(request.getLevel())
                .documentType(request.getDocumentType())
                .documentNumber(request.getDocumentNumber())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .dateOfBirth(request.getDateOfBirth())
                .nationality(request.getNationality())
                .address(request.getAddress())
                .sanctionsChecked(false)
                .pepChecked(false)
                .amlChecked(false)
                .build();

        kyc = kycRepository.save(kyc);
        log.info("KYC submitted for user: {} level: {}", request.getUserId(), request.getLevel());

        kafkaTemplate.send("kyc-events", kyc.getId(),
                Map.of("event", "KYC_SUBMITTED", "kycId", kyc.getId(), "userId", request.getUserId()));

        return toResponse(kyc);
    }

    @Transactional
    public KycResponse approveKyc(String kycId, String reviewerId) {
        KycVerification kyc = kycRepository.findById(kycId)
                .orElseThrow(() -> new IllegalArgumentException("KYC verification not found"));

        kyc.setStatus(KycStatus.VERIFIED);
        kyc.setReviewedBy(reviewerId);
        kyc.setVerifiedAt(LocalDateTime.now());
        kyc.setExpiresAt(LocalDateTime.now().plusYears(2));
        kyc.setSanctionsChecked(true);
        kyc.setPepChecked(true);
        kyc.setAmlChecked(true);

        kyc = kycRepository.save(kyc);
        log.info("KYC approved: {} for user: {}", kycId, kyc.getUserId());

        kafkaTemplate.send("kyc-events", kyc.getId(),
                Map.of("event", "KYC_APPROVED", "kycId", kyc.getId(), "userId", kyc.getUserId()));

        return toResponse(kyc);
    }

    @Transactional
    public KycResponse rejectKyc(String kycId, String reviewerId, String reason) {
        KycVerification kyc = kycRepository.findById(kycId)
                .orElseThrow(() -> new IllegalArgumentException("KYC verification not found"));

        kyc.setStatus(KycStatus.REJECTED);
        kyc.setReviewedBy(reviewerId);
        kyc.setRejectionReason(reason);
        kyc = kycRepository.save(kyc);
        log.warn("KYC rejected: {} reason: {}", kycId, reason);

        return toResponse(kyc);
    }

    public KycResponse getLatestKyc(String userId) {
        KycVerification kyc = kycRepository.findFirstByUserIdOrderByCreatedAtDesc(userId)
                .orElseThrow(() -> new IllegalArgumentException("No KYC found for user"));
        return toResponse(kyc);
    }

    public Page<KycResponse> getPendingReviews(Pageable pageable) {
        return kycRepository.findByStatus(KycStatus.DOCUMENTS_SUBMITTED, pageable).map(this::toResponse);
    }

    private KycResponse toResponse(KycVerification kyc) {
        return KycResponse.builder()
                .id(kyc.getId()).userId(kyc.getUserId())
                .status(kyc.getStatus()).level(kyc.getLevel())
                .documentType(kyc.getDocumentType())
                .sanctionsChecked(kyc.isSanctionsChecked())
                .pepChecked(kyc.isPepChecked()).amlChecked(kyc.isAmlChecked())
                .rejectionReason(kyc.getRejectionReason())
                .createdAt(kyc.getCreatedAt()).verifiedAt(kyc.getVerifiedAt())
                .expiresAt(kyc.getExpiresAt())
                .build();
    }
}
