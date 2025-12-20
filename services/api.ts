const API_BASE_URL = '/api';

const cache = new Map<string, { data: any, timestamp: number }>();
const CACHE_TTL = 30000; // 30 seconds

export const api = {
  async get(endpoint: string, useCache = true) {
    if (useCache && cache.has(endpoint)) {
      const cached = cache.get(endpoint)!;
      if (Date.now() - cached.timestamp < CACHE_TTL) {
        return cached.data;
      }
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    
    if (!response.ok) throw new Error(await response.text());
    
    const data = await response.json();
    if (useCache) {
      cache.set(endpoint, { data, timestamp: Date.now() });
    }
    return data;
  },

  async post(endpoint: string, data: any) {
    // Clear cache on mutations
    cache.clear();

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Something went wrong');
    }
    return response.json();
  },

  async put(endpoint: string, data: any) {
    cache.clear();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Something went wrong');
    }
    return response.json();
  },

  async delete(endpoint: string) {
    cache.clear();
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || 'Something went wrong');
    }
    return response.json();
  }
};
