-- Card Service Schema
-- PCI DSS: Card numbers stored encrypted, never in plaintext

CREATE TABLE cards (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    linked_account_number VARCHAR(20) NOT NULL,
    encrypted_card_number VARCHAR(500) NOT NULL,
    masked_card_number VARCHAR(25) NOT NULL,
    card_type VARCHAR(20) NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'PENDING_ACTIVATION',
    expiry_date DATE NOT NULL,
    pin_hash VARCHAR(255),
    daily_limit DECIMAL(19,4),
    monthly_limit DECIMAL(19,4),
    contactless_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    international_enabled BOOLEAN NOT NULL DEFAULT FALSE,
    online_transactions_enabled BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    activated_at TIMESTAMP
);

CREATE INDEX idx_cards_user ON cards(user_id);
CREATE INDEX idx_cards_account ON cards(linked_account_number);
CREATE INDEX idx_cards_status ON cards(user_id, status);
