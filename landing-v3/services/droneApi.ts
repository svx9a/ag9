/**
 * Smart Farming Drone API Service Wrapper
 * This service manages integrations with major Thai drone & geospatial APIs:
 * 1. HiveGrid (HG Robotics) - For flight missions and telemetry
 * 2. GISTDA Sphere - For satellite imagery and crop health
 */

import { io } from 'socket.io-client';

const HIVEGRID_BASE_URL = 'https://api.hivegrid.app/v2';
const GISTDA_BASE_URL = 'https://api.sphere.gistda.or.th/v1';

// Initialize Socket.io connection
const socket = io(window.location.origin, {
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export const DroneApiService = {
  socket,

  // --- HiveGrid Integration (Drone Missions) ---

  /**
   * Submit a new agricultural spraying mission
   * @param {Object} missionData - { plotCoords, pilotId, parameters }
   */
  async createSprayingTask({ plotCoords, pilotId, parameters }) {
    try {
      // In a real scenario, this would use an environment variable for the token
      const token = import.meta.env.VITE_HIVEGRID_TOKEN || 'MOCK_TOKEN';

      const response = await fetch(`${HIVEGRID_BASE_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          type: 'SPRAYING',
          pilot_id: pilotId,
          plot_geometry: {
            type: 'Polygon',
            coordinates: [plotCoords]
          },
          parameters: {
            flow_rate: parameters.flowRate || 1.5,
            altitude: parameters.altitude || 3.5,
            speed: parameters.speed || 5.0
          }
        })
      });

      if (!response.ok) throw new Error('HiveGrid Task Creation Failed');
      return await response.json();
    } catch (error) {
      console.error('DroneApiService Error:', error);
      return { success: false, error: error.message };
    }
  },

  /**
   * Fetch real-time telemetry for a specific drone/task
   */
  async getLiveTelemetry(taskId) {
    // This would typically be a WebSocket connection in production
    // For now, we simulate a polling endpoint
    return {
      taskId,
      status: 'IN_PROGRESS',
      location: [14.2069 + (Math.random() * 0.01), 101.2133 + (Math.random() * 0.01)],
      battery: 85,
      altitude: 3.4,
      flow_rate: 1.45,
      timestamp: new Date().toISOString()
    };
  },

  // --- GISTDA Sphere Integration (Satellite & Geospatial) ---

  /**
   * Get NDVI (Vegetation Index) data for a specific area
   */
  async getCropHealth(bounds) {
    const apiKey = import.meta.env.VITE_GISTDA_KEY || 'MOCK_KEY';
    // GISTDA Sphere API call simulation
    return {
      source: 'THEOS-2 / Sentinel-2',
      ndvi_score: 0.72,
      health_status: 'HEALTHY',
      last_updated: new Date().toISOString(),
      layers: [
        { name: 'NDVI', url: 'https://sphere.gistda.or.th/api/wms?layer=ndvi_latest' }
      ]
    };
  },

  /**
   * Fetch Unified Dashboard Summary from local backend
   */
  async getDashboardSummary() {
    try {
      const response = await fetch('/api/dashboard/summary');
      if (!response.ok) throw new Error('Failed to fetch dashboard summary');
      return await response.json();
    } catch (error) {
      console.error('getDashboardSummary Error:', error);
      return null;
    }
  }
};
