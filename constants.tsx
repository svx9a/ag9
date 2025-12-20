import { Drone, Field, LogEntry } from './types';

export const MOCK_DRONES_COUNT = 45;

// Helper to generate random coordinates within a box
const getRandomCoords = (centerLat: number, centerLng: number, spread: number) => {
  return {
    lat: centerLat + (Math.random() - 0.5) * spread,
    lng: centerLng + (Math.random() - 0.5) * spread,
  };
};

export const MOCK_FIELDS: Field[] = [];

// Specific Brand Generators
const generateDJIDrone = (index: number, lat: number, lng: number): Partial<Drone> => {
  const model = Math.random() > 0.5 ? 'Agras T40' : 'Agras T30';
  return {
    manufacturer: 'DJI',
    model: model,
    id: `DJI-${100 + index}`,
    serialNumber: `34SD${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    firmwareVersion: '02.04.01.12',
    apiSource: 'DJI Cloud',
    voltage: 52.8, // 14S HV LiPo
  };
};

const generateXAGDrone = (index: number, lat: number, lng: number): Partial<Drone> => {
  const model = Math.random() > 0.5 ? 'P100' : 'V40';
  return {
    manufacturer: 'XAG',
    model: model,
    id: `XAG-${200 + index}`,
    serialNumber: `XAG${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    firmwareVersion: '4.1.0_2309',
    apiSource: 'XAG Cloud',
    voltage: 48.1,
  };
};

const generateGenericDrone = (index: number, lat: number, lng: number): Partial<Drone> => {
  return {
    manufacturer: Math.random() > 0.5 ? 'TTA' : 'Jiyi',
    model: 'M6E-1',
    id: `UAV-${300 + index}`,
    serialNumber: `FC${Math.random().toString(36).substr(2, 8).toUpperCase()}`,
    firmwareVersion: 'ArduCopter 4.3.1',
    apiSource: 'MavLink',
    voltage: 22.2,
  };
};

export const generateMockDrones = (): Drone[] => {
  const drones: Drone[] = [];
  // Thailand Agricultural Hubs
  const regions = [
    { name: 'Central Plains (Ayutthaya)', lat: 14.3532, lng: 100.5684, spread: 0.8, crops: ['Rice (Jasmine)', 'Rice (Pathum)', 'Sugarcane'] },
    { name: 'North (Chiang Mai)', lat: 18.7883, lng: 98.9853, spread: 0.6, crops: ['Lychee', 'Longan', 'Strawberry'] }, 
    { name: 'Northeast (Khon Kaen)', lat: 16.4322, lng: 102.8236, spread: 1.0, crops: ['Cassava', 'Sugarcane', 'Rice (Sticky)'] },
    { name: 'East (Chanthaburi)', lat: 12.6114, lng: 102.1039, spread: 0.5, crops: ['Durian', 'Mangosteen', 'Rubber'] },
    { name: 'South (Surat Thani)', lat: 9.1386, lng: 99.3318, spread: 0.7, crops: ['Oil Palm', 'Rubber', 'Coconut'] },
  ];

  for (let i = 0; i < MOCK_DRONES_COUNT; i++) {
    const region = regions[Math.floor(Math.random() * regions.length)];
    const coords = getRandomCoords(region.lat, region.lng, region.spread);
    
    // Status Logic
    const rand = Math.random();
    let status: Drone['status'] = 'Idle';
    if (rand < 0.4) status = 'Spraying';
    else if (rand < 0.7) status = 'Scouting';
    else if (rand < 0.8) status = 'Returning';
    else if (rand < 0.9) status = 'Maintenance';
    
    // Battery & History
    let battery = Math.floor(Math.random() * 100);
    if (status === 'Returning') battery = Math.floor(Math.random() * 25) + 5;
    const history = [];
    let currentHistBat = battery;
    for(let j=0; j<20; j++) {
        history.unshift(currentHistBat);
        currentHistBat = Math.min(100, currentHistBat + (Math.random() * 0.5));
    }

    // Path History
    const pathHistory: [number, number][] = [];
    let curLat = coords.lat;
    let curLng = coords.lng;
    for (let h = 0; h < 50; h++) {
        pathHistory.unshift([curLat, curLng]);
        curLat += (Math.random() - 0.5) * 0.005; 
        curLng += (Math.random() - 0.5) * 0.005; 
    }

    // Determine Brand
    const brandRoll = Math.random();
    let droneBase;
    if (brandRoll < 0.4) droneBase = generateDJIDrone(i, coords.lat, coords.lng);
    else if (brandRoll < 0.7) droneBase = generateXAGDrone(i, coords.lat, coords.lng);
    else droneBase = generateGenericDrone(i, coords.lat, coords.lng);

    const crop = region.crops[Math.floor(Math.random() * region.crops.length)];

    drones.push({
      ...droneBase as any,
      lat: coords.lat,
      lng: coords.lng,
      battery: battery,
      flightTimeRemaining: Math.floor((battery / 100) * 20),
      status: status,
      altitude: status !== 'Idle' && status !== 'Maintenance' ? Math.floor(Math.random() * 30) + 3 : 0,
      speed: status !== 'Idle' && status !== 'Maintenance' ? Math.floor(Math.random() * 25) + 5 : 0,
      signalStrength: -Math.floor(Math.random() * 30 + 50),
      latency: Math.floor(Math.random() * 40 + 10),
      lastMaintenance: new Date(Date.now() - Math.floor(Math.random() * 1000000000)).toISOString().split('T')[0],
      batteryHistory: history,
      pathHistory: pathHistory,
      
      fieldId: `FLD-${Math.floor(Math.random() * 500)}`,
      cropType: crop,
      tankLevel: status === 'Spraying' ? Math.floor(Math.random() * 100) : 0,
      coverage: Math.floor(Math.random() * 100),
      ndvi: 0.3 + (Math.random() * 0.6),
      weatherCondition: Math.random() > 0.8 ? 'Windy' : 'Clear',

      sprayingEffectiveness: 92 + (Math.random() * 8),
      mixingQuality: 95 + (Math.random() * 5),
    });
  }
  return drones;
};

export const generateMockLogs = (drones: Drone[]): LogEntry[] => {
  const logs: LogEntry[] = [];
  const actions = [
    { cat: 'Flight', act: 'SDK: Mission Upload', lvl: 'info' },
    { cat: 'API', act: 'DJI Bridge: Sync', lvl: 'info' },
    { cat: 'Flight', act: 'RTH Triggered', lvl: 'info' },
    { cat: 'System', act: 'Cell Deviation >0.1V', lvl: 'warning' },
    { cat: 'API', act: 'Rate Limit Exceeded', lvl: 'warning' },
    { cat: 'Compliance', act: 'Geofence Breach', lvl: 'error' },
    { cat: 'Maintenance', act: 'Logs Exported', lvl: 'success' },
    { cat: 'Flight', act: 'Task Complete', lvl: 'success' },
  ];

  for (let i = 0; i < 150; i++) {
    const drone = drones[Math.floor(Math.random() * drones.length)];
    const template = actions[Math.floor(Math.random() * actions.length)];
    const timeOffset = Math.floor(Math.random() * 48 * 60 * 60 * 1000);
    
    logs.push({
      id: `LOG-${10000 + i}`,
      timestamp: new Date(Date.now() - timeOffset).toISOString(),
      droneId: drone.id,
      category: template.cat as any,
      level: template.lvl as any,
      action: template.act,
      details: `${drone.manufacturer} API: { lat: ${drone.lat.toFixed(5)}, bat: ${drone.battery}% }`,
      operator: 'System'
    });
  }
  
  return logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
};