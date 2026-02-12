-- Account Service Schema
-- Banking: Precision decimal for monetary values, audit columns

CREATE TABLE accounts (
    id VARCHAR(36) PRIMARY KEY,
    account_number VARCHAR(20) NOT NULL UNIQUE,
    user_id VARCHAR(36) NOT NULL,
    account_type VARCHAR(30) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',
    balance DECIMAL(19,4) NOT NULL DEFAULT 0.0000,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    interest_rate DECIMAL(5,2),
    daily_transfer_limit DECIMAL(19,4),
    daily_withdrawal_limit DECIMAL(19,4),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_accounts_user ON accounts(user_id);
CREATE INDEX idx_accounts_number ON accounts(account_number);
CREATE INDEX idx_accounts_status ON accounts(user_id, status);
