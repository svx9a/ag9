const axios = require('axios');

class CloudflareAIService {
  constructor() {
    this.token = process.env.CF_AIG_TOKEN;
    this.gatewayUrl = process.env.CF_AIG_GATEWAY_URL; // e.g., https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}
  }

  async chat(messages, provider = process.env.NEXT_PUBLIC_AI_PROVIDER || 'openai', model = null) {
    if (!this.token || !this.gatewayUrl) {
      throw new Error('Cloudflare AI Gateway configuration missing (CF_AIG_TOKEN, CF_AIG_GATEWAY_URL)');
    }

    // Default models based on provider
    const defaultModels = {
      openai: 'gpt-4o',
      mistral: 'mistral-large-latest',
      xai: 'grok-beta'
    };

    const targetModel = model || defaultModels[provider] || 'gpt-4o';
    const url = `${this.gatewayUrl}/${provider}/chat/completions`;
    
    try {
      const response = await axios.post(url, {
        model: targetModel,
        messages
      }, {
        headers: {
          'cf-aig-authorization': `Bearer ${this.token}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error(`Cloudflare AI Error (${provider}):`, error.response?.data || error.message);
      throw error;
    }
  }
}

module.exports = new CloudflareAIService();
