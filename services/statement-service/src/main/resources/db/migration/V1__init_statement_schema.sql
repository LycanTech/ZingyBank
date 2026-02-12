-- Statement Service Schema

CREATE TABLE statements (
    id VARCHAR(36) PRIMARY KEY,
    account_number VARCHAR(20) NOT NULL,
    user_id VARCHAR(36) NOT NULL,
    type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'REQUESTED',
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    storage_path VARCHAR(500),
    file_size_bytes BIGINT DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    generated_at TIMESTAMP
);

CREATE INDEX idx_statements_account ON statements(account_number);
CREATE INDEX idx_statements_user ON statements(user_id);
