package com.zingybank.kyc.model;

public enum KycLevel {
    BASIC,      // Email + phone verification
    STANDARD,   // Government ID + address proof
    ENHANCED    // Full due diligence for high-risk customers
}
