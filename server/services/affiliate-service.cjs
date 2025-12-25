const { Pool } = require('pg');

// Initialize PG Pool if environment variables are present
let pool;
if (process.env.DATABASE_URL || process.env.PGHOST) {
    pool = new Pool({
        connectionString: process.env.DATABASE_URL,
        host: process.env.PGHOST,
        user: process.env.PGUSER,
        password: process.env.PGPASSWORD,
        database: process.env.PGDATABASE,
        port: process.env.PGPORT || 5432,
        ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
}

const AFFILIATE_CONFIG = {
    TIER_1_RATE: 0.08, // 8% for direct referral
    TIER_2_RATE: 0.05, // 5% for indirect (optional based on user prompt "5%/8%")
    MENTOR_BONUS: 0.01, // 1% mentor bonus
    HOLD_PERIOD_DAYS: 7,
    MIN_WITHDRAWAL: 500
};

class AffiliateService {
    /**
     * Process a completed job and calculate commissions
     */
    async processJobCompletion(jobId, userId, amount) {
        if (!pool) return { success: false, message: 'PG Database not configured' };

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            // 1. Find the direct affiliate (Tier 1)
            const directAffResult = await client.query(
                'SELECT affiliate_id FROM referrals WHERE referred_user_id = $1',
                [userId]
            );

            if (directAffResult.rows.length === 0) {
                await client.query('COMMIT');
                return { success: true, message: 'No affiliate found for this user' };
            }

            const tier1AffiliateId = directAffResult.rows[0].affiliate_id;
            const tier1Commission = amount * AFFILIATE_CONFIG.TIER_1_RATE;
            const holdUntil = new Date();
            holdUntil.setDate(holdUntil.getDate() + AFFILIATE_CONFIG.HOLD_PERIOD_DAYS);

            // Record Tier 1 Commission
            await client.query(
                'INSERT INTO commissions (affiliate_id, job_id, amount, tier, hold_until) VALUES ($1, $2, $3, 1, $4)',
                [tier1AffiliateId, jobId, tier1Commission, holdUntil]
            );

            // 2. Find the Tier 2 affiliate (who referred the Tier 1 affiliate)
            const tier2Result = await client.query(
                'SELECT affiliate_id FROM referrals WHERE referred_user_id = $1',
                [tier1AffiliateId]
            );

            if (tier2Result.rows.length > 0) {
                const tier2AffiliateId = tier2Result.rows[0].affiliate_id;
                const tier2Commission = amount * AFFILIATE_CONFIG.TIER_2_RATE;

                await client.query(
                    'INSERT INTO commissions (affiliate_id, job_id, amount, tier, hold_until) VALUES ($1, $2, $3, 2, $4)',
                    [tier2AffiliateId, jobId, tier2Commission, holdUntil]
                );
            }

            // 3. Find the mentor (Bonus for the recruiter of the direct affiliate)
            const mentorResult = await client.query(
                'SELECT mentor_id FROM affiliates WHERE user_id = $1',
                [tier1AffiliateId]
            );

            if (mentorResult.rows.length > 0 && mentorResult.rows[0].mentor_id) {
                const mentorId = mentorResult.rows[0].mentor_id;
                const mentorBonus = amount * AFFILIATE_CONFIG.MENTOR_BONUS;

                // Record Mentor Bonus
                await client.query(
                    'INSERT INTO commissions (affiliate_id, job_id, amount, tier, hold_until) VALUES ($1, $2, $3, 3, $4)',
                    [mentorId, jobId, mentorBonus, holdUntil]
                );
            }

            await client.query('COMMIT');
            return { success: true };
        } catch (error) {
            await client.query('ROLLBACK');
            console.error('Affiliate Commission Error:', error);
            throw error;
        } finally {
            client.release();
        }
    }

    /**
     * Get affiliate stats for dashboard
     */
    async getStats(userId) {
        if (!pool) return this.getMockStats();

        const result = await pool.query(
            `SELECT
                balance,
                total_earned,
                (SELECT COUNT(*) FROM referrals WHERE affiliate_id = $1) as total_referrals,
                (SELECT SUM(amount) FROM commissions WHERE affiliate_id = $1 AND status = 'pending') as pending_commissions
            FROM affiliates WHERE user_id = $1`,
            [userId]
        );

        return result.rows[0] || this.getMockStats();
    }

    /**
     * Request a withdrawal
     */
    async requestWithdrawal(userId, amount) {
        if (!pool) return { success: false, message: 'PG Database not configured' };
        if (amount < AFFILIATE_CONFIG.MIN_WITHDRAWAL) {
            return { success: false, message: `Minimum withdrawal is ฿${AFFILIATE_CONFIG.MIN_WITHDRAWAL}` };
        }

        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const affResult = await client.query('SELECT balance FROM affiliates WHERE user_id = $1 FOR UPDATE', [userId]);
            if (affResult.rows.length === 0 || affResult.rows[0].balance < amount) {
                throw new Error('Insufficient balance');
            }

            await client.query('UPDATE affiliates SET balance = balance - $1 WHERE user_id = $2', [amount, userId]);
            await client.query('INSERT INTO withdrawals (affiliate_id, amount) VALUES ($1, $2)', [userId, amount]);

            await client.query('COMMIT');
            return { success: true };
        } catch (error) {
            await client.query('ROLLBACK');
            return { success: false, message: error.message };
        } finally {
            client.release();
        }
    }

    getMockStats() {
        return {
            balance: 1250.00,
            total_earned: 5400.00,
            total_referrals: 12,
            pending_commissions: 450.00
        };
    }
}

module.exports = new AffiliateService();
