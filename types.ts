import React from 'react';

export interface Drone {
  id: string;
  serialNumber: string; // e.g., 345GH...
  manufacturer: 'DJI' | 'XAG' | 'TTA' | 'Jiyi' | 'Custom';
  firmwareVersion: string;
  
  lat: number;
  lng: number;
  battery: number; // percentage
  voltage: number; // volts
  flightTimeRemaining: number; // minutes
  status: 'Spraying' | 'Scouting' | 'Seeding' | 'Returning' | 'Idle' | 'Maintenance';
  altitude: number; // meters (AGL)
  speed: number; // km/h
  model: string;
  signalStrength: number; // dBm (-30 to -100)
  latency: number; // ms
  lastMaintenance: string;
  batteryHistory: number[]; // Last 20 data points
  pathHistory: [number, number][]; // Flight path coordinate history
  
  // Ag Specific
  fieldId: string;
  cropType: string;
  tankLevel: number; // percentage (for sprayers)
  coverage: number; // percentage of field covered
  ndvi: number; // 0.0 to 1.0 (Vegetation Index)
  weatherCondition: 'Clear' | 'Windy' | 'Light Rain' | 'Cloudy';

  // Performance Metrics
  sprayingEffectiveness: number; // 0-100%
  mixingQuality: number; // 0-100%
  
  // Telemetry Source
  apiSource: 'DJI Cloud' | 'XAG Cloud' | 'MavLink' | 'Direct';
}

export interface Field {
  id: string;
  name: string;
  coords: [number, number][]; // Polygon
  crop: string;
  acres: number;
}

export interface LogEntry {
  id: string;
  timestamp: string;
  droneId: string;
  category: 'Flight' | 'System' | 'Maintenance' | 'Compliance' | 'API';
  level: 'info' | 'warning' | 'error' | 'success';
  action: string;
  details: string;
  operator?: string;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  trendUp?: boolean;
}