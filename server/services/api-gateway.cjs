const axios = require('axios');
const NodeCache = require('node-cache');
const pino = require('pino');
const logger = pino({
  transport: {
    target: 'pino-pretty'
  }
});

// Gateway Config
const cache = new NodeCache({ stdTTL: 600 }); // 10 minutes cache

class UnifiedAgriGateway {
  constructor() {
    this.services = new Map();
    this.registerDefaultServices();
  }

  registerService(name, serviceInstance) {
    this.services.set(name, serviceInstance);
    logger.info(`Service Registered: ${name}`);
  }

  registerDefaultServices() {
    const localAgri = require('./external-apis/local-agri-api.cjs');
    const partnerAgri = require('./external-apis/partner-agri-api.cjs');
    const cloudflareAI = require('./external-apis/cloudflare-ai.cjs');
    
    this.registerService('local', localAgri);
    this.registerService('partners', partnerAgri);
    this.registerService('ai', cloudflareAI);
  }

  async request(serviceName, method, ...args) {
    const service = this.services.get(serviceName);
    if (!service) {
      throw new Error(`Service ${serviceName} not found`);
    }

    const cacheKey = `${serviceName}:${method}:${JSON.stringify(args)}`;
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      logger.info(`Cache Hit: ${cacheKey}`);
      return cachedData;
    }

    try {
      logger.info(`Requesting ${serviceName}.${method}`);
      const result = await service[method](...args);
      cache.set(cacheKey, result);
      return result;
    } catch (error) {
      logger.error(`Error in ${serviceName}.${method}: ${error.message}`);
      // Basic Retry Logic
      return this.retryRequest(service, method, args);
    }
  }

  async retryRequest(service, method, args, attempts = 2) {
    for (let i = 0; i < attempts; i++) {
      try {
        logger.warn(`Retrying ${method} (Attempt ${i + 1}/${attempts})`);
        return await service[method](...args);
      } catch (e) {
        if (i === attempts - 1) throw e;
      }
    }
  }
}

module.exports = new UnifiedAgriGateway();
