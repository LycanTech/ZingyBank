-- Notification Service Schema

CREATE TABLE notifications (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    type VARCHAR(30) NOT NULL,
    channel VARCHAR(20) NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING',
    subject VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    recipient VARCHAR(255),
    failure_reason VARCHAR(500),
    retry_count INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    sent_at TIMESTAMP
);

CREATE INDEX idx_notif_user ON notifications(user_id);
CREATE INDEX idx_notif_created ON notifications(created_at);
CREATE INDEX idx_notif_status ON notifications(status);
