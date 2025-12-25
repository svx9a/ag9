-- PostgreSQL Schema for Two-Tier Affiliate Program

CREATE TABLE IF NOT EXISTS affiliates (
    user_id UUID PRIMARY KEY,
    referral_code VARCHAR(20) UNIQUE NOT NULL,
    mentor_id UUID REFERENCES affiliates(user_id),
    balance DECIMAL(12, 2) DEFAULT 0,
    total_earned DECIMAL(12, 2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS referrals (
    affiliate_id UUID REFERENCES affiliates(user_id),
    referred_user_id UUID UNIQUE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (affiliate_id, referred_user_id)
);

CREATE TABLE IF NOT EXISTS commissions (
    id SERIAL PRIMARY KEY,
    affiliate_id UUID REFERENCES affiliates(user_id),
    job_id VARCHAR(50) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    tier INTEGER NOT NULL, -- 1 for direct, 2 for mentor bonus
    status VARCHAR(20) DEFAULT 'pending', -- pending, available, withdrawn
    hold_until TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS withdrawals (
    id SERIAL PRIMARY KEY,
    affiliate_id UUID REFERENCES affiliates(user_id),
    amount DECIMAL(12, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending', -- pending, processed, rejected
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster lookups
CREATE INDEX IF NOT EXISTS idx_affiliates_referral_code ON affiliates(referral_code);
CREATE INDEX IF NOT EXISTS idx_commissions_affiliate_id ON commissions(affiliate_id);
CREATE INDEX IF NOT EXISTS idx_commissions_status ON commissions(status);
CREATE INDEX IF NOT EXISTS idx_commissions_hold_until ON commissions(hold_until);
