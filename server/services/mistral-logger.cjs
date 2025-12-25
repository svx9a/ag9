const pino = require('pino');
const path = require('path');
const fs = require('fs');

// Structured logging to file using Pino
const logDirectory = path.join(__dirname, '../../logs');
if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory, { recursive: true });
}

const fileLogger = pino({
  level: 'info',
  base: { service: 'mistral-agent' },
  timestamp: pino.stdTimeFunctions.isoTime
}, pino.destination(path.join(logDirectory, 'mistral-agent.log')));

class MistralLogger {
  constructor(queryHelper) {
    this.query = queryHelper;
  }

  /**
   * Log an agent activity
   */
  async logActivity(userId, action, status, metadata = {}) {
    const timestamp = new Date().toISOString();

    // 1. Log to pino (structured JSON to file)
    fileLogger.info({
      userId,
      action,
      status,
      metadata,
      timestamp
    });

    // 2. Persist to database
    try {
      if (global.dbType === 'mongodb') {
        const mongoose = require('mongoose');
        const AgentLog = mongoose.models.AgentLog;
        if (AgentLog) {
          await AgentLog.create({
            user_id: userId,
            action,
            status,
            metadata,
            timestamp
          });
        }
      } else {
        const metadataStr = JSON.stringify(metadata);
        await this.query.run(
          'INSERT INTO agent_logs (user_id, action, status, metadata, timestamp) VALUES (?, ?, ?, ?, ?)',
          [userId, action, status, metadataStr, timestamp]
        );
      }
    } catch (error) {
      console.error('Failed to persist agent log to DB:', error);
    }
  }

  /**
   * Token Management: Store or update a secure token
   */
  async saveToken(userId, token, expiresAt = null) {
    try {
      if (global.dbType === 'mongodb') {
        const mongoose = require('mongoose');
        const AgentToken = mongoose.models.AgentToken;
        if (AgentToken) {
          await AgentToken.findOneAndUpdate(
            { user_id: userId },
            { token, expires_at: expiresAt },
            { upsert: true, new: true }
          );
        }
      } else {
        // SQLite / MSSQL
        const sql = global.dbType === 'mssql'
          ? `MERGE agent_tokens AS target
             USING (SELECT ? AS user_id, ? AS token, ? AS expires_at) AS source
             ON (target.user_id = source.user_id)
             WHEN MATCHED THEN UPDATE SET token = source.token, expires_at = source.expires_at
             WHEN NOT MATCHED THEN INSERT (user_id, token, expires_at) VALUES (source.user_id, source.token, source.expires_at);`
          : `INSERT INTO agent_tokens (user_id, token, expires_at)
             VALUES (?, ?, ?)
             ON CONFLICT(user_id) DO UPDATE SET token=excluded.token, expires_at=excluded.expires_at`;

        await this.query.run(sql, [userId, token, expiresAt]);
      }
    } catch (error) {
      console.error('Failed to save agent token:', error);
    }
  }

  /**
   * Get token for a user
   */
  async getToken(userId) {
    try {
      if (global.dbType === 'mongodb') {
        const mongoose = require('mongoose');
        const AgentToken = mongoose.models.AgentToken;
        const result = await AgentToken.findOne({ user_id: userId });
        return result ? result.token : null;
      } else {
        const result = await this.query.get('SELECT token FROM agent_tokens WHERE user_id = ?', [userId]);
        return result ? result.token : null;
      }
    } catch (error) {
      console.error('Failed to get agent token:', error);
      return null;
    }
  }

  /**
   * Generate daily summary
   */
  async getDailySummary(date = new Date().toISOString().split('T')[0]) {
    try {
      let logs;
      if (global.dbType === 'mongodb') {
        const mongoose = require('mongoose');
        const AgentLog = mongoose.models.AgentLog;
        const start = new Date(date);
        const end = new Date(date);
        end.setDate(end.getDate() + 1);
        logs = await AgentLog.find({ timestamp: { $gte: start, $lt: end } });
      } else {
        logs = await this.query.all(
          "SELECT * FROM agent_logs WHERE DATE(timestamp) = ?",
          [date]
        );
      }

      const totalTasks = logs.length;
      const successfulTasks = logs.filter(l => l.status === 'success').length;
      const failedTasks = logs.filter(l => l.status === 'failure').length;
      const errors = logs.filter(l => l.status === 'failure').map(l => l.metadata);

      const latencies = logs
        .map(l => {
          try {
            const meta = typeof l.metadata === 'string' ? JSON.parse(l.metadata) : l.metadata;
            return meta?.duration || 0;
          } catch (e) { return 0; }
        })
        .filter(d => d > 0);

      const avgLatency = latencies.length > 0
        ? latencies.reduce((a, b) => a + b, 0) / latencies.length
        : 0;

      return {
        date,
        totalTasks,
        successfulTasks,
        failedTasks,
        avgLatencyMs: avgLatency.toFixed(2),
        errors
      };
    } catch (error) {
      console.error('Failed to generate daily summary:', error);
      return null;
    }
  }

  /**
   * Log rotation/cleanup for database
   */
  async rotateDbLogs(retentionDays = 30) {
    try {
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - retentionDays);

      if (global.dbType === 'mongodb') {
        const mongoose = require('mongoose');
        const AgentLog = mongoose.models.AgentLog;
        await AgentLog.deleteMany({ timestamp: { $lt: cutoff } });
      } else {
        await this.query.run(
          'DELETE FROM agent_logs WHERE timestamp < ?',
          [cutoff.toISOString()]
        );
      }
      console.log(`Rotated logs older than ${retentionDays} days.`);
    } catch (error) {
      console.error('Failed to rotate DB logs:', error);
    }
  }

  /**
   * Search/Query logs
   */
  async queryLogs(filters = {}) {
    const { userId, action, status, limit = 50, offset = 0 } = filters;

    try {
      if (global.dbType === 'mongodb') {
        const mongoose = require('mongoose');
        const AgentLog = mongoose.models.AgentLog;
        const query = {};
        if (userId) query.user_id = userId;
        if (action) query.action = action;
        if (status) query.status = status;

        return await AgentLog.find(query)
          .sort({ timestamp: -1 })
          .skip(parseInt(offset))
          .limit(parseInt(limit));
      } else {
        let sql = 'SELECT * FROM agent_logs WHERE 1=1';
        const params = [];

        if (userId) {
          sql += ' AND user_id = ?';
          params.push(userId);
        }
        if (action) {
          sql += ' AND action = ?';
          params.push(action);
        }
        if (status) {
          sql += ' AND status = ?';
          params.push(status);
        }

        sql += ` ORDER BY timestamp DESC LIMIT ${limit} OFFSET ${offset}`;
        return await this.query.all(sql, params);
      }
    } catch (error) {
      console.error('Failed to query logs:', error);
      return [];
    }
  }
}

module.exports = MistralLogger;
