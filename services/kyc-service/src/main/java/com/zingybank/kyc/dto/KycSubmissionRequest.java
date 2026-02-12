package com.zingybank.kyc.dto;

import com.zingybank.kyc.model.DocumentType;
import com.zingybank.kyc.model.KycLevel;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import java.time.LocalDate;

@Data
public class KycSubmissionRequest {
    @NotBlank
    private String userId;
    @NotNull
    private KycLevel level;
    @NotNull
    private DocumentType documentType;
    @NotBlank
    private String documentNumber;
    @NotBlank
    private String firstName;
    @NotBlank
    private String lastName;
    @NotNull
    private LocalDate dateOfBirth;
    @NotBlank
    private String nationality;
    @NotBlank
    private String address;
}
