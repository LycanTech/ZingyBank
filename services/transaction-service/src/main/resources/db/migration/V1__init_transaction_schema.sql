-- Transaction Service Schema
-- Banking: Immutable transaction records, indexed for fast lookups

CREATE TABLE transactions (
    id VARCHAR(36) PRIMARY KEY,
    reference_number VARCHAR(50) NOT NULL UNIQUE,
    type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    source_account_number VARCHAR(20) NOT NULL,
    destination_account_number VARCHAR(20),
    amount DECIMAL(19,4) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    description VARCHAR(500),
    failure_reason VARCHAR(500),
    initiated_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE INDEX idx_txn_source_account ON transactions(source_account_number);
CREATE INDEX idx_txn_dest_account ON transactions(destination_account_number);
CREATE INDEX idx_txn_created_at ON transactions(created_at);
CREATE INDEX idx_txn_reference ON transactions(reference_number);
CREATE INDEX idx_txn_status ON transactions(status);
