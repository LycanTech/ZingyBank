package com.zingybank.kyc.dto;

import com.zingybank.kyc.model.*;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class KycResponse {
    private String id;
    private String userId;
    private KycStatus status;
    private KycLevel level;
    private DocumentType documentType;
    private boolean sanctionsChecked;
    private boolean pepChecked;
    private boolean amlChecked;
    private String rejectionReason;
    private LocalDateTime createdAt;
    private LocalDateTime verifiedAt;
    private LocalDateTime expiresAt;
}
