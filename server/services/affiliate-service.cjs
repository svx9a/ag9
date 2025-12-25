/**
 * Affiliate Service
 * Handles multi-tier referral system, commissions, and withdrawals.
 * Supports SQLite (via unified query object) and PostgreSQL.
 */
class AffiliateService {
    constructor() {
        this.query = null;
    }

    setQuery(query) {
        this.query = query;
    }

    AFFILIATE_CONFIG = {
        TIER_1_RATE: 0.08, // 8% for direct referral
        TIER_2_RATE: 0.05, // 5% for indirect
        MENTOR_BONUS: 0.01, // 1% mentor bonus
        HOLD_PERIOD_DAYS: 7,
        MIN_WITHDRAWAL: 500
    };

    /**
     * Process a completed job and calculate commissions
     */
    async processJobCompletion(jobId, userId, amount) {
        if (!this.query) return { success: false, message: 'Database not initialized' };

        try {
            // 1. Find the direct affiliate (Tier 1)
            const directAff = await this.query.get(
                'SELECT affiliate_id FROM referrals WHERE referred_user_id = ?',
                [userId]
            );

            if (!directAff) {
                return { success: true, message: 'No affiliate found for this user' };
            }

            const tier1AffiliateId = directAff.affiliate_id;
            const tier1Commission = amount * this.AFFILIATE_CONFIG.TIER_1_RATE;
            const holdUntil = new Date();
            holdUntil.setDate(holdUntil.getDate() + this.AFFILIATE_CONFIG.HOLD_PERIOD_DAYS);
            const holdUntilStr = holdUntil.toISOString();

            // Record Tier 1 Commission
            await this.query.run(
                'INSERT INTO commissions (affiliate_id, job_id, amount, tier, hold_until) VALUES (?, ?, ?, 1, ?)',
                [tier1AffiliateId, jobId, tier1Commission, holdUntilStr]
            );

            // 2. Find the Tier 2 affiliate (who referred the Tier 1 affiliate)
            const tier2 = await this.query.get(
                'SELECT affiliate_id FROM referrals WHERE referred_user_id = ?',
                [tier1AffiliateId]
            );

            if (tier2) {
                const tier2AffiliateId = tier2.affiliate_id;
                const tier2Commission = amount * this.AFFILIATE_CONFIG.TIER_2_RATE;

                await this.query.run(
                    'INSERT INTO commissions (affiliate_id, job_id, amount, tier, hold_until) VALUES (?, ?, ?, 2, ?)',
                    [tier2AffiliateId, jobId, tier2Commission, holdUntilStr]
                );
            }

            // 3. Find the mentor (Bonus for the recruiter of the direct affiliate)
            const mentor = await this.query.get(
                'SELECT mentor_id FROM affiliates WHERE user_id = ?',
                [tier1AffiliateId]
            );

            if (mentor && mentor.mentor_id) {
                const mentorId = mentor.mentor_id;
                const mentorBonus = amount * this.AFFILIATE_CONFIG.MENTOR_BONUS;

                // Record Mentor Bonus
                await this.query.run(
                    'INSERT INTO commissions (affiliate_id, job_id, amount, tier, hold_until) VALUES (?, ?, ?, 3, ?)',
                    [mentorId, jobId, mentorBonus, holdUntilStr]
                );
            }

            return { success: true };
        } catch (error) {
            console.error('Affiliate Commission Error:', error);
            throw error;
        }
    }

    /**
     * Get affiliate stats for dashboard
     */
    async getStats(userId) {
        if (!this.query) return this.getMockStats();

        try {
            const stats = await this.query.get(
                `SELECT 
                    balance, 
                    total_earned,
                    (SELECT COUNT(*) FROM referrals WHERE affiliate_id = ?) as total_referrals,
                    (SELECT SUM(amount) FROM commissions WHERE affiliate_id = ? AND status = 'pending') as pending_commissions
                FROM affiliates WHERE user_id = ?`,
                [userId, userId, userId]
            );

            return stats || this.getMockStats();
        } catch (err) {
            console.error('Error fetching affiliate stats:', err);
            return this.getMockStats();
        }
    }

    /**
     * Request a withdrawal
     */
    async requestWithdrawal(userId, amount) {
        if (!this.query) return { success: false, message: 'Database not initialized' };
        if (amount < this.AFFILIATE_CONFIG.MIN_WITHDRAWAL) {
            return { success: false, message: `Minimum withdrawal is ฿${this.AFFILIATE_CONFIG.MIN_WITHDRAWAL}` };
        }

        try {
            const aff = await this.query.get('SELECT balance FROM affiliates WHERE user_id = ?', [userId]);
            if (!aff || aff.balance < amount) {
                return { success: false, message: 'Insufficient balance' };
            }

            // In a real transaction-supported DB we'd use BEGIN/COMMIT
            // For unified query we'll do sequential updates
            await this.query.run('UPDATE affiliates SET balance = balance - ? WHERE user_id = ?', [amount, userId]);
            await this.query.run('INSERT INTO withdrawals (affiliate_id, amount) VALUES (?, ?)', [userId, amount]);

            return { success: true };
        } catch (error) {
            console.error('Withdrawal Request Error:', error);
            return { success: false, message: error.message };
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
