-- Payment Service Schema

CREATE TABLE payees (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    name VARCHAR(255) NOT NULL,
    account_number VARCHAR(50),
    routing_number VARCHAR(20),
    biller_code VARCHAR(50),
    default_payment_type VARCHAR(30),
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE payments (
    id VARCHAR(36) PRIMARY KEY,
    payment_reference VARCHAR(50) NOT NULL UNIQUE,
    source_account_number VARCHAR(20) NOT NULL,
    payee_id VARCHAR(36) NOT NULL REFERENCES payees(id),
    payment_type VARCHAR(30) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    amount DECIMAL(19,4) NOT NULL,
    currency VARCHAR(3) NOT NULL DEFAULT 'USD',
    description VARCHAR(500),
    scheduled_date DATE,
    recurring BOOLEAN NOT NULL DEFAULT FALSE,
    recurring_frequency VARCHAR(20),
    initiated_by VARCHAR(36) NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    processed_at TIMESTAMP
);

CREATE INDEX idx_payments_account ON payments(source_account_number);
CREATE INDEX idx_payments_reference ON payments(payment_reference);
CREATE INDEX idx_payments_scheduled ON payments(scheduled_date, status);
CREATE INDEX idx_payees_user ON payees(user_id);
