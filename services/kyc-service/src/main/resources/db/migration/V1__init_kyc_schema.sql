-- KYC Service Schema
-- Banking regulatory: KYC/AML compliance tracking

CREATE TABLE kyc_verifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING',
    level VARCHAR(20) NOT NULL,
    document_type VARCHAR(30),
    document_number VARCHAR(100),
    document_storage_path VARCHAR(500),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    date_of_birth DATE,
    nationality VARCHAR(50),
    address VARCHAR(500),
    sanctions_checked BOOLEAN NOT NULL DEFAULT FALSE,
    pep_checked BOOLEAN NOT NULL DEFAULT FALSE,
    aml_checked BOOLEAN NOT NULL DEFAULT FALSE,
    reviewed_by VARCHAR(36),
    rejection_reason VARCHAR(500),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    verified_at TIMESTAMP,
    expires_at TIMESTAMP
);

CREATE INDEX idx_kyc_user ON kyc_verifications(user_id);
CREATE INDEX idx_kyc_status ON kyc_verifications(status);
