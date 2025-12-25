-- PostgreSQL Schema for Two-Tier Affiliate Program

-- Table for storing affiliate profiles and their current balances
CREATE TABLE IF NOT EXISTS affiliates (
    id SERIAL PRIMARY KEY,
    user_id TEXT UNIQUE NOT NULL, -- Links to the main users table (string ID from Firebase/Auth)
    referral_code TEXT UNIQUE NOT NULL,
    mentor_id TEXT REFERENCES affiliates(user_id), -- The affiliate who recruited this one
    balance DECIMAL(15, 2) DEFAULT 0.00,
    total_earned DECIMAL(15, 2) DEFAULT 0.00,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for tracking who was referred by whom
CREATE TABLE IF NOT EXISTS referrals (
    id SERIAL PRIMARY KEY,
    affiliate_id TEXT NOT NULL REFERENCES affiliates(user_id),
    referred_user_id TEXT UNIQUE NOT NULL, -- The user who joined using the referral code
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for tracking individual commission records
CREATE TABLE IF NOT EXISTS commissions (
    id SERIAL PRIMARY KEY,
    affiliate_id TEXT NOT NULL REFERENCES affiliates(user_id),
    job_id TEXT NOT NULL,
    amount DECIMAL(15, 2) NOT NULL,
    tier INTEGER NOT NULL, -- 1 for direct referral, 2 for mentor bonus
    status TEXT DEFAULT 'pending', -- pending, cleared, withdrawn
    hold_until TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table for withdrawal requests
CREATE TABLE IF NOT EXISTS withdrawals (
    id SERIAL PRIMARY KEY,
    affiliate_id TEXT NOT NULL REFERENCES affiliates(user_id),
    amount DECIMAL(15, 2) NOT NULL,
    status TEXT DEFAULT 'pending', -- pending, approved, rejected, paid
    bank_details JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_affiliates_user_id ON affiliates(user_id);
CREATE INDEX idx_referrals_affiliate_id ON referrals(affiliate_id);
CREATE INDEX idx_commissions_affiliate_id ON commissions(affiliate_id);
CREATE INDEX idx_commissions_status ON commissions(status);
CREATE INDEX idx_commissions_hold_until ON commissions(hold_until);
