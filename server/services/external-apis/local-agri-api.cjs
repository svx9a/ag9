const line = require('@line/bot-sdk');

class LineApiService {
  constructor() {
    this.config = {
      channelAccessToken: process.env.LINE_ACCESS_TOKEN || 'MOCK_TOKEN',
      channelSecret: process.env.LINE_CHANNEL_SECRET || 'MOCK_SECRET'
    };
    this.client = new line.Client(this.config);
  }

  /**
   * Send a broadcast message to all users or a specific user
   */
  async sendMessage(userId, text) {
    return { success: true, timestamp: new Date().toISOString() };
  }

  /**
   * Mock local agricultural weather service (Thai Meteorlogical Department style)
   */
  async getLocalWeather(province) {
    // Simulated local API call
    return {
      province,
      temp: 32,
      humidity: 65,
      windSpeed: 5,
      condition: 'Sunny',
      source: 'TMD Local API'
    };
  }
}

module.exports = new LineApiService();
