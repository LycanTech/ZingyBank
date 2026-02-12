package com.zingybank.kyc.repository;

import com.zingybank.kyc.model.KycStatus;
import com.zingybank.kyc.model.KycVerification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface KycVerificationRepository extends JpaRepository<KycVerification, String> {
    List<KycVerification> findByUserId(String userId);
    Optional<KycVerification> findFirstByUserIdOrderByCreatedAtDesc(String userId);
    Page<KycVerification> findByStatus(KycStatus status, Pageable pageable);
}
