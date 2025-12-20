import React, { useState, useEffect, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Map as MapIcon, 
  BatteryCharging, 
  Signal, 
  Activity, 
  Menu, 
  X, 
  Settings, 
  Bell,
  Search,
  Sprout,
  Wind,
  Download,
  Filter,
  ArrowUpDown,
  AlertTriangle,
  Droplets,
  CloudSun,
  Tractor,
  Leaf,
  FileText,
  ClipboardList,
  LogOut,
  FlaskConical,
  Gauge,
  Cpu,
  Database,
  Code,
  Ruler,
  Timer,
  Play,
  CheckCircle2
} from 'lucide-react';

import { ultraOptimizer } from './services/ultra-optimizer';
import DroneMap from './components/DroneMap';
import StatCard from './components/StatCard';
import BatteryGraph from './components/BatteryGraph';
import LogViewer from './components/LogViewer';
import LandingPage from './components/LandingPage';
import PerfectLayout from './components/PerfectLayout';
import AgentChat from './components/AgentChat';
import Documentation from './components/Documentation';
import { generateMockDrones, generateMockLogs, MOCK_DRONES_COUNT } from './constants';
import { Drone, LogEntry } from './types';

import { api } from './services/api';

type ViewState = 'dashboard' | 'logs';

function App() {
  const [user, setUser] = useState<any>(null);
  const [showLanding, setShowLanding] = useState(true);
  const [showDocs, setShowDocs] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  
  const [drones, setDrones] = useState<Drone[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedDrone, setExpandedDrone] = useState<string | null>(null);

  // 1. Initialize Data & Check Auth
  useEffect(() => {
    const init = async () => {
      try {
        const data = await api.get('/me');
        if (data.user) {
          setUser(data.user);
          setShowLanding(false);
        }
      } catch (err) {
        // Not logged in, stay on landing
      } finally {
        const initialDrones = generateMockDrones();
        setDrones(initialDrones);
        setLogs(generateMockLogs(initialDrones));
        setIsLoading(false);
      }
    };
    init();
  }, []);

  const handleEnterApp = (userData: any) => {
    setUser(userData);
    setShowLanding(false);
  };

  const handleLogout = async () => {
    try {
      await api.post('/api/logout', {});
    } catch (err) {
      console.error('Logout failed', err);
    } finally {
      setUser(null);
      setShowLanding(true);
    }
  };

  // Dashboard State
  const [filterType, setFilterType] = useState<'all' | 'DJI' | 'XAG' | 'TTA'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'issue'>('all');
  const [sortBy, setSortBy] = useState<'id' | 'battery' | 'ndvi'>('id');
  const [searchQuery, setSearchQuery] = useState('');

  // Spray Planner State
  const [selectedChemical, setSelectedChemical] = useState('Glyphosate 48');
  const [boomHeight, setBoomHeight] = useState(2.5);
  const [swathWidth, setSwathWidth] = useState(5.0);
  const [sprayRate, setSprayRate] = useState(10);
  const [benchmarkResult, setBenchmarkResult] = useState<{ time: number, drones: number } | null>(null);

  // 2. Real-time Simulation Loop (Ultra Optimized)
  useEffect(() => {
    if (isLoading) return;

    const processDroneUpdate = async (d: Drone): Promise<Drone> => {
        if (d.status === 'Maintenance') return d;

        // Battery & Tank Drain
        let newBattery = d.battery;
        let newTank = d.tankLevel;
        
        if (d.status === 'Spraying') {
            newBattery = Math.max(0, d.battery - (Math.random() * 0.2)); 
            newTank = Math.max(0, d.tankLevel - (Math.random() * 0.5));
        } else if (d.status !== 'Idle') {
            newBattery = Math.max(0, d.battery - (Math.random() * 0.1));
        }

        const newHistory = [...d.batteryHistory, newBattery].slice(-20);
        
        // Movement
        const moveFactor = d.status !== 'Idle' ? 0.0002 : 0;
        const newLat = d.lat + (Math.random() - 0.5) * moveFactor;
        const newLng = d.lng + (Math.random() - 0.5) * moveFactor;
        
        const newPath = [...d.pathHistory, [newLat, newLng] as [number, number]].slice(-100);

        // Update Performance Metrics
        let newSprayEff = d.sprayingEffectiveness;
        if (d.status === 'Spraying') {
            const fluctuation = (Math.random() - 0.5) * 2;
            newSprayEff = Math.min(100, Math.max(80, newSprayEff + fluctuation));
            if (d.weatherCondition === 'Windy') newSprayEff -= 0.1;
        }

        let newMixQual = d.mixingQuality + (Math.random() - 0.5) * 0.5;
        newMixQual = Math.min(100, Math.max(90, newMixQual));

        // Random Event Logging (Simulation)
        if (Math.random() < 0.002) { 
           const newLog: LogEntry = {
              id: `API-${Date.now()}`,
              timestamp: new Date().toISOString(),
              droneId: d.id,
              category: 'API',
              level: 'info',
              action: `${d.manufacturer} Sync`,
              details: `Payload: { "bat": ${newBattery.toFixed(1)}, "lat": ${newLat.toFixed(5)} }`,
              operator: 'Ultra Optimizer'
           };
           setLogs(prev => [newLog, ...prev]);
        }
        
        return {
          ...d,
          battery: parseFloat(newBattery.toFixed(2)),
          tankLevel: parseFloat(newTank.toFixed(1)),
          batteryHistory: newHistory,
          lat: newLat,
          lng: newLng,
          pathHistory: newPath,
          sprayingEffectiveness: newSprayEff,
          mixingQuality: newMixQual
        };
    };

    const interval = setInterval(async () => {
        // Use Quantum Batch Processing for ultra-fast telemetry updates
        const updatedDrones = await ultraOptimizer.quantumBatch(drones, processDroneUpdate, 10);
        setDrones(updatedDrones);
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoading, drones]);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Derived Data
  const sprayingDrones = drones.filter(d => d.status === 'Spraying').length;
  const avgNDVI = drones.reduce((acc, curr) => acc + curr.ndvi, 0) / (drones.length || 1);
  const criticalBatteryCount = drones.filter(d => d.battery < 20).length;

  const filteredDrones = useMemo(() => {
    let result = drones;

    if (filterType !== 'all') result = result.filter(d => d.manufacturer === filterType);
    
    if (statusFilter === 'active') result = result.filter(d => d.status === 'Spraying' || d.status === 'Seeding');
    else if (statusFilter === 'issue') result = result.filter(d => d.battery < 20 || d.tankLevel < 10);

    if (searchQuery) {
      const lower = searchQuery.toLowerCase();
      result = result.filter(d => d.id.toLowerCase().includes(lower) || d.model.toLowerCase().includes(lower) || d.serialNumber.toLowerCase().includes(lower));
    }

    return result.sort((a, b) => {
      if (sortBy === 'battery') return a.battery - b.battery;
      if (sortBy === 'ndvi') return a.ndvi - b.ndvi;
      return a.id.localeCompare(b.id);
    });
  }, [drones, filterType, statusFilter, sortBy, searchQuery]);

  const handleExport = () => {
    const headers = ['ID', 'Manufacturer', 'Model', 'Serial', 'Status', 'Battery', 'Lat', 'Lng', 'Firmware'];
    const rows = filteredDrones.map(d => [d.id, d.manufacturer, d.model, d.serialNumber, d.status, d.battery, d.lat, d.lng, d.firmwareVersion]);
    
    const csvContent = "data:text/csv;charset=utf-8," + headers.join(",") + "\n" + rows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `agriflight_telemetry_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getBrandColor = (brand: string) => {
    switch(brand) {
      case 'DJI': return 'text-sky-600 bg-sky-100 border-sky-200';
      case 'XAG': return 'text-red-600 bg-red-100 border-red-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const runPerformanceBenchmark = async () => {
    const stressTestDrones = Array.from({ length: 500 }).map((_, i) => ({
        ...drones[0],
        id: `STRESS-${i}`
    }));

    const benchmark = await ultraOptimizer.benchmark(async () => {
        // Process 500 drones in batches of 50
        return await ultraOptimizer.quantumBatch(stressTestDrones, async (d) => {
            // Simulate complex calculation
            const result = Math.sqrt(d.lat * d.lng) * Math.random();
            return { ...d, ndvi: result > 1 ? 0.9 : result };
        }, 50);
    });

    setBenchmarkResult({
        time: benchmark.metrics.executionTime,
        drones: stressTestDrones.length
    });

    // Auto-clear after 5 seconds
    setTimeout(() => setBenchmarkResult(null), 5000);
  };

  if (showLanding) {
    return <PerfectLayout onEnterApp={handleEnterApp} />;
  }

  return (
    <div className="flex h-screen w-full bg-white text-slate-900 font-sans selection:bg-emerald-100">
      
      {/* Sidebar - Clean Minimalist Theme */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white text-slate-900 border-r border-slate-200 transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:hidden'
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 px-6 h-16 border-b border-slate-100">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <Cpu size={20} />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">AgriFlight <span className="text-emerald-600">MAKER</span></span>
          </div>

          <nav className="flex-1 space-y-1 px-3 py-6">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${currentView === 'dashboard' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <Zap size={20} />
              <span className="font-semibold text-sm">Automation Hub</span>
            </button>
            <button 
              onClick={() => setCurrentView('logs')}
              className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors ${currentView === 'logs' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}
            >
              <Database size={20} />
              <span className="font-semibold text-sm">Telemetry Logs</span>
            </button>
            <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
              <Code size={20} />
              <span className="font-semibold text-sm">Maker SDK</span>
            </a>
            <a href="#" className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors">
              <Activity size={20} />
              <span className="font-semibold text-sm">Pipeline Health</span>
            </a>
          </nav>

          <div className="border-t border-slate-100 p-4 bg-white">
             <div className="flex flex-col gap-1 mb-4">
                <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Authenticated User</p>
                <p className="text-xs text-slate-600 truncate font-medium">{user?.email || 'Guest User'}</p>
             </div>
             <button onClick={handleLogout} className="flex items-center gap-2 text-xs text-slate-500 hover:text-emerald-600 transition-colors mb-3 w-full font-bold">
                <LogOut size={12}/> Logout
             </button>
             <div className="flex items-center gap-2 mb-2">
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <p className="text-xs font-bold text-slate-600">Live API: Active</p>
             </div>
             <p className="text-[10px] text-slate-400 font-bold">Ver 4.2.0 (AgriTech Build)</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative bg-white">
        
        {/* Top Navbar - Clean White */}
        <header className="flex h-16 items-center justify-between border-b border-slate-100 bg-white px-6 z-40 sticky top-0">
          <div className="flex items-center gap-4">
            <button onClick={toggleSidebar} className="rounded-lg p-2 text-slate-500 hover:bg-slate-50 lg:hidden">
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search telemetry..." 
                className="h-10 w-72 rounded-lg bg-slate-50 border border-slate-200 pl-10 pr-4 text-sm text-slate-900 focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowDocs(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors border border-slate-200"
            >
              <BookOpen size={14} />
              <span>Documentation</span>
            </button>
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-50 border border-emerald-100 text-emerald-800">
                <span className="text-xs font-medium">API Latency:</span>
                <span className="text-xs text-emerald-600 font-bold">24ms</span>
            </div>
            <div className="h-8 w-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs border border-emerald-200">AF</div>
          </div>
        </header>

        {/* Dynamic Content View */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-6 scroll-smooth">
          {currentView === 'logs' ? (
             <LogViewer logs={logs} />
          ) : (
             <div className="mx-auto max-w-[1600px] space-y-6">
            
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">AI Maker Automation Hub</h1>
                <p className="text-slate-500 text-sm mt-1">Orchestrate your autonomous fleet and AI pipelines</p>
              </div>
              <div className="flex items-center gap-4">
                 {benchmarkResult && (
                   <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 text-white rounded-lg text-[10px] animate-in fade-in slide-in-from-top-1">
                      <Zap size={12} className="text-yellow-400" />
                      <span className="font-bold">Optimization:</span>
                      <span>Processed {benchmarkResult.drones} drones in {benchmarkResult.time.toFixed(2)}ms</span>
                   </div>
                 )}
                 <button 
                    onClick={runPerformanceBenchmark}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors border border-slate-300"
                 >
                    <Gauge size={14} /> Run Stress Test
                 </button>
                 <button onClick={handleExport} className="flex items-center gap-2 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition-colors shadow-lg shadow-emerald-500/20">
                    <Download size={14} /> Export Report
                 </button>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard 
                title="Active Sprayers" 
                value={sprayingDrones} 
                icon={<Droplets size={20} />} 
                trend="Today"
                trendUp={true} 
              />
              <StatCard 
                title="DJI Connected" 
                value={drones.filter(d => d.manufacturer === 'DJI').length}
                icon={<Cpu size={20} />} 
                trend="Stable" 
                trendUp={true} 
              />
              <StatCard 
                title="XAG Connected" 
                value={drones.filter(d => d.manufacturer === 'XAG').length}
                icon={<Cpu size={20} />} 
                trend="Stable" 
                trendUp={true} 
              />
              <StatCard 
                title="API Events" 
                value={logs.filter(l => l.category === 'API').length}
                icon={<Code size={20} />} 
                trend="Real-time" 
                trendUp={true} 
              />
            </div>

            {/* Main View */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-[750px]">
              
              {/* Map */}
              <div className="xl:col-span-2 h-full rounded-xl overflow-hidden border border-gray-200 shadow-xl relative bg-white">
                 <DroneMap drones={drones} isSidebarOpen={isSidebarOpen} />
              </div>

              {/* Sidebar Panel: List & Planning */}
              <div className="flex flex-col gap-4 h-full overflow-hidden">
                
                {/* 1. Live Telemetry List */}
                <div className="flex-1 bg-white rounded-xl border border-gray-200 flex flex-col min-h-0 shadow-xl overflow-hidden">
                  <div className="p-4 border-b border-gray-100 space-y-3 bg-gray-50/50">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-slate-800 flex items-center gap-2">
                         <Tractor size={16} className="text-emerald-600"/>
                         Live Telemetry
                      </h3>
                    </div>
                    
                    <div className="flex gap-2 flex-wrap">
                      <select 
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value as any)}
                        className="bg-white text-xs text-slate-700 rounded-md border border-gray-300 px-2 py-1.5 focus:ring-1 focus:ring-emerald-500 outline-none shadow-sm"
                      >
                        <option value="all">All Brands</option>
                        <option value="DJI">DJI Only</option>
                        <option value="XAG">XAG Only</option>
                        <option value="TTA">TTA Only</option>
                      </select>

                      <select 
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as any)}
                        className="bg-white text-xs text-slate-700 rounded-md border border-gray-300 px-2 py-1.5 focus:ring-1 focus:ring-emerald-500 outline-none shadow-sm"
                      >
                        <option value="all">All Status</option>
                        <option value="active">Active</option>
                        <option value="issue">Issues</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2 bg-white">
                     {isLoading ? (
                       <div className="flex flex-col items-center justify-center h-full text-gray-500 gap-2">
                          <div className="h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-sm">Connecting to Vendor APIs...</span>
                       </div>
                     ) : (
                       filteredDrones.map((drone) => (
                         <div key={drone.id} className="group relative bg-white hover:bg-emerald-50 rounded-lg p-3 border border-gray-200 hover:border-emerald-300 transition-all duration-200 shadow-sm">
                            
                            <div className="flex justify-between items-start mb-2">
                               <div>
                                  <div className="flex items-center gap-2">
                                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${getBrandColor(drone.manufacturer)} font-bold`}>{drone.manufacturer}</span>
                                    <span className="font-mono font-bold text-sm text-slate-800 group-hover:text-emerald-700 transition-colors">{drone.id}</span>
                                  </div>
                                  <div className="text-[10px] text-gray-400 mt-1 font-mono">SN: {drone.serialNumber}</div>
                               </div>
                               <button 
                                  onClick={() => setExpandedDrone(expandedDrone === drone.id ? null : drone.id)}
                                  className="text-[10px] px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded text-gray-600 border border-gray-300"
                               >
                                  {expandedDrone === drone.id ? 'Hide Raw' : 'Raw API'}
                               </button>
                            </div>

                            {expandedDrone === drone.id ? (
                              <div className="bg-slate-900 rounded p-2 mb-2 font-mono text-[10px] text-emerald-400 overflow-x-auto border border-slate-800">
                                  <pre>{JSON.stringify({
                                      source: drone.apiSource,
                                      fw: drone.firmwareVersion,
                                      telemetry: {
                                          lat: drone.lat,
                                          lng: drone.lng,
                                          bat: drone.battery,
                                          volt: drone.voltage,
                                          rssi: drone.signalStrength
                                      }
                                  }, null, 2)}</pre>
                              </div>
                            ) : (
                              <>
                                  <div className="space-y-2 mb-3 bg-slate-50 p-2 rounded-md border border-gray-100">
                                      <div className="flex items-center justify-between text-[10px]">
                                          <div className="text-gray-500">Model</div>
                                          <div className="text-slate-800 font-bold">{drone.model}</div>
                                      </div>
                                      {/* Tech Specs */}
                                      <div className="grid grid-cols-2 gap-2 mt-1">
                                          <div>
                                              <div className="flex justify-between text-[9px] text-gray-500">
                                                  <span>Spray Eff.</span>
                                                  <span className="text-emerald-600 font-bold">{drone.sprayingEffectiveness.toFixed(0)}%</span>
                                              </div>
                                              <div className="h-1 bg-gray-200 rounded-full mt-0.5">
                                                  <div className="h-full bg-emerald-500" style={{ width: `${drone.sprayingEffectiveness}%` }}></div>
                                              </div>
                                          </div>
                                          <div>
                                              <div className="flex justify-between text-[9px] text-gray-500">
                                                  <span>Mix Qual.</span>
                                                  <span className="text-blue-600 font-bold">{drone.mixingQuality.toFixed(0)}%</span>
                                              </div>
                                              <div className="h-1 bg-gray-200 rounded-full mt-0.5">
                                                  <div className="h-full bg-blue-500" style={{ width: `${drone.mixingQuality}%` }}></div>
                                              </div>
                                          </div>
                                      </div>
                                  </div>
                                  
                                  <div className="flex items-center gap-2 mt-2">
                                      <div className="flex-1 h-6 opacity-80 group-hover:opacity-100 transition-opacity">
                                          <BatteryGraph data={drone.batteryHistory} color={drone.battery < 20 ? '#ef4444' : '#10b981'} width={120} height={24} />
                                      </div>
                                      <div className="text-xs font-bold text-gray-600">{drone.battery}%</div>
                                  </div>
                              </>
                            )}
                         </div>
                       ))
                     )}
                  </div>
                </div>

                {/* 2. Spray Planning Section */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-xl p-4 flex flex-col shrink-0">
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-100">
                    <h3 className="font-bold text-slate-800 flex items-center gap-2">
                       <FlaskConical size={18} className="text-purple-600"/>
                       Spray Mission Planner
                    </h3>
                  </div>

                  <div className="space-y-4 overflow-y-auto custom-scrollbar pr-1">
                    {/* Chemical Selection */}
                    <div>
                       <label className="text-xs font-bold text-gray-500 mb-1.5 block">Chemical Mix</label>
                       <div className="flex gap-2">
                          <select 
                            value={selectedChemical} 
                            onChange={(e) => setSelectedChemical(e.target.value)}
                            className="flex-1 text-sm border border-gray-300 rounded-lg p-2 bg-gray-50 text-slate-700 outline-none focus:ring-2 focus:ring-purple-500 transition-all"
                          >
                            <option value="Glyphosate 48">Glyphosate 48 (Weed)</option>
                            <option value="Fungicide X2">Fungicide X2 (Rice)</option>
                            <option value="Foliar Fert A">Foliar Fertilizer A</option>
                          </select>
                          <div className="bg-purple-50 text-purple-700 font-bold text-xs px-2 rounded-lg border border-purple-100 flex items-center justify-center">
                             1:50
                          </div>
                       </div>
                    </div>

                    {/* Flight Parameters Grid */}
                    <div className="grid grid-cols-2 gap-3">
                       <div className="bg-slate-50 p-2 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                             <ArrowUpDown size={12} /> Boom Height
                          </div>
                          <div className="flex items-center justify-between">
                             <span className="font-bold text-slate-800">{boomHeight}m</span>
                             <input 
                               type="range" min="1" max="5" step="0.5" 
                               value={boomHeight} onChange={(e) => setBoomHeight(parseFloat(e.target.value))}
                               className="w-16 accent-purple-600"
                             />
                          </div>
                       </div>
                       <div className="bg-slate-50 p-2 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                             <Ruler size={12} /> Swath Width
                          </div>
                          <div className="flex items-center justify-between">
                             <span className="font-bold text-slate-800">{swathWidth}m</span>
                             <input 
                               type="range" min="3" max="8" step="0.5" 
                               value={swathWidth} onChange={(e) => setSwathWidth(parseFloat(e.target.value))}
                               className="w-16 accent-purple-600"
                             />
                          </div>
                       </div>
                       <div className="bg-slate-50 p-2 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                             <Droplets size={12} /> Rate (L/Rai)
                          </div>
                          <div className="flex items-center justify-between">
                             <span className="font-bold text-slate-800">{sprayRate}L</span>
                             <input 
                               type="range" min="5" max="20" step="1" 
                               value={sprayRate} onChange={(e) => setSprayRate(parseFloat(e.target.value))}
                               className="w-16 accent-purple-600"
                             />
                          </div>
                       </div>
                       <div className="bg-slate-50 p-2 rounded-lg border border-gray-200">
                          <div className="flex items-center gap-1.5 text-xs text-gray-500 mb-1">
                             <Timer size={12} /> Est. Time
                          </div>
                          <div className="text-slate-800 font-bold text-sm pt-0.5">14m 20s</div>
                       </div>
                    </div>

                    <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 rounded-xl shadow-lg shadow-purple-500/20 transition-all flex items-center justify-center gap-2 group">
                       <Play size={16} className="fill-current" /> Upload & Start Mission
                    </button>
                    
                    <div className="flex justify-center gap-4 text-[10px] text-gray-400 font-medium">
                       <span className="flex items-center gap-1"><CheckCircle2 size={10} className="text-green-500"/> RTK Active</span>
                       <span className="flex items-center gap-1"><CheckCircle2 size={10} className="text-green-500"/> Obstacle Sense</span>
                    </div>

                  </div>
                </div>

              </div>
            </div>
            </div>
          )}
        </div>
      </main>
      <Documentation isOpen={showDocs} onClose={() => setShowDocs(false)} />

      {/* AI Agent Chat Widget */}
      <AgentChat />

      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
}

export default App;