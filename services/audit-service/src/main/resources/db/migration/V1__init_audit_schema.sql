-- Audit Service Schema
-- Banking regulatory: Immutable, append-only audit trail
-- Hash chain for tamper detection (blockchain-like integrity)

CREATE TABLE audit_events (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id VARCHAR(100) NOT NULL,
    service_name VARCHAR(50) NOT NULL,
    details TEXT,
    previous_state TEXT,
    new_state TEXT,
    ip_address VARCHAR(45),
    user_agent VARCHAR(500),
    severity VARCHAR(20) NOT NULL DEFAULT 'INFO',
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    previous_event_hash VARCHAR(64),
    event_hash VARCHAR(64)
);

-- IMPORTANT: No UPDATE or DELETE grants should be given on this table in production
-- This table is append-only for regulatory compliance

CREATE INDEX idx_audit_user ON audit_events(user_id);
CREATE INDEX idx_audit_entity ON audit_events(entity_type, entity_id);
CREATE INDEX idx_audit_timestamp ON audit_events(timestamp);
CREATE INDEX idx_audit_action ON audit_events(action);
CREATE INDEX idx_audit_severity ON audit_events(severity);

-- Rule to prevent updates (enforce immutability in dev)
CREATE RULE audit_no_update AS ON UPDATE TO audit_events DO INSTEAD NOTHING;
CREATE RULE audit_no_delete AS ON DELETE TO audit_events DO INSTEAD NOTHING;
