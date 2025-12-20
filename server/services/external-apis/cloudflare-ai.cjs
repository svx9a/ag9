const axios = require('axios');

class CloudflareAIService {
  constructor() {
    this.token = process.env.CF_AIG_TOKEN;
    this.gatewayUrl = process.env.CF_AIG_GATEWAY_URL; // e.g., https://gateway.ai.cloudflare.com/v1/{account_id}/{gateway_id}
  }

  async chat(messages, provider = process.env.NEXT_PUBLIC_AI_PROVIDER || 'openai', model = null, skipGateway = false) {
    if (!this.token || !this.gatewayUrl) {
      if (!process.env.XAI_API_KEY && !process.env.OPENAI_API_KEY && !process.env.MISTRAL_API_KEY) {
        throw new Error('AI configuration missing (Gateway or Direct API Keys)');
      }
    }

    // Default models based on provider
    const defaultModels = {
      openai: 'gpt-4o',
      mistral: 'mistral-large-latest',
      xai: 'grok-3'
    };

    const targetModel = model || defaultModels[provider] || 'gpt-4o';
    
    // Use direct API if gateway fails or if we have a direct key and want to bypass gateway
    const xaiKey = process.env.XAI_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;
    const mistralKey = process.env.MISTRAL_API_KEY;

    let url;
    let headers = { 'Content-Type': 'application/json' };

    if (this.gatewayUrl && this.token && !skipGateway) {
      const baseUrl = this.gatewayUrl.endsWith('/') ? this.gatewayUrl.slice(0, -1) : this.gatewayUrl;
      url = baseUrl.includes('workers.dev') 
        ? `${baseUrl}/v1/chat/completions` 
        : `${baseUrl}/${provider}/chat/completions`;
      headers['cf-aig-authorization'] = `Bearer ${this.token}`;
    } else {
      // Direct API fallbacks
      if (provider === 'xai' && xaiKey) {
        url = 'https://api.x.ai/v1/chat/completions';
        headers['Authorization'] = `Bearer ${xaiKey}`;
      } else if (provider === 'openai' && openaiKey) {
        url = 'https://api.openai.com/v1/chat/completions';
        headers['Authorization'] = `Bearer ${openaiKey}`;
      } else if (provider === 'mistral' && mistralKey) {
        url = 'https://api.mistral.ai/v1/chat/completions';
        headers['Authorization'] = `Bearer ${mistralKey}`;
      } else {
        throw new Error(`No gateway or direct API key configured for provider: ${provider}`);
      }
    }

    try {
      const response = await axios.post(url, {
        model: targetModel,
        messages
      }, { headers });

      return response.data.choices[0].message.content;
    } catch (error) {
      console.error(`AI Error (${provider}):`, error.response?.data || error.message);
      
      // If gateway failed, try direct fallback if possible
      if (this.gatewayUrl && this.token) {
        console.log(`Gateway failed for ${provider}, attempting direct fallback...`);
        if (provider === 'xai' && xaiKey) {
          return this.chat(messages, provider, targetModel, true); // Recursive call with skipGateway flag?
        }
      }
      throw error;
    }
  }
}

module.exports = new CloudflareAIService();
