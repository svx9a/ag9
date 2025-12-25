const axios = require('axios');

class GreenPilotService {
  constructor() {
    this.agentId = process.env.AGENT_ID;
    this.apiKey = process.env.GREENPILOT_API_KEY;
    // Base URL for GreenPilot Agent API
    this.baseUrl = process.env.GREENPILOT_API_URL || 'https://api.greenpilot.ai/v1'; 
  }

  async chat(message, userId) {
    if (!this.agentId || !this.apiKey) {
      throw new Error('GreenPilot configuration missing (AGENT_ID or GREENPILOT_API_KEY)');
    }

    try {
      const response = await axios.post(`${this.baseUrl}/agents/${this.agentId}/chat`, {
        message,
        user_id: userId,
        stream: false
      }, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      // Assuming standard response format: { reply: "..." } or { data: { reply: "..." } }
      return response.data.reply || response.data.content || response.data.message;
    } catch (error) {
      console.error('GreenPilot API Error:', error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new GreenPilotService();
