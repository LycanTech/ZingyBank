-- Loan Service Schema

CREATE TABLE loans (
    id VARCHAR(36) PRIMARY KEY,
    loan_number VARCHAR(30) NOT NULL UNIQUE,
    user_id VARCHAR(36) NOT NULL,
    disbursement_account_number VARCHAR(20) NOT NULL,
    loan_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'APPLICATION',
    principal_amount DECIMAL(19,4) NOT NULL,
    outstanding_balance DECIMAL(19,4) NOT NULL,
    interest_rate DECIMAL(5,2) NOT NULL,
    term_months INT NOT NULL,
    monthly_payment DECIMAL(19,4) NOT NULL,
    start_date DATE,
    end_date DATE,
    next_payment_date DATE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    approved_at TIMESTAMP
);

CREATE TABLE loan_payments (
    id VARCHAR(36) PRIMARY KEY,
    loan_id VARCHAR(36) NOT NULL REFERENCES loans(id),
    payment_number INT NOT NULL,
    total_amount DECIMAL(19,4) NOT NULL,
    principal_amount DECIMAL(19,4) NOT NULL,
    interest_amount DECIMAL(19,4) NOT NULL,
    remaining_balance DECIMAL(19,4) NOT NULL,
    payment_status VARCHAR(20),
    due_date TIMESTAMP,
    paid_at TIMESTAMP,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_loans_user ON loans(user_id);
CREATE INDEX idx_loans_number ON loans(loan_number);
CREATE INDEX idx_loans_status ON loans(status);
CREATE INDEX idx_loan_payments_loan ON loan_payments(loan_id);
