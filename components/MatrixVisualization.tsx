import React, { useState, useMemo, useEffect } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  Battery, 
  Zap, 
  Clock, 
  ChevronRight, 
  Info,
  Maximize2,
  Minimize2,
  BarChart3,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { ultraOptimizer } from '../services/ultra-optimizer';

interface DroneModel {
  id: string;
  name: string;
  capacity: number; // L
  unitPrice: number; // THB
  batteryCost: number; // THB
  coveragePerCharge: number; // rai
  sprayRate: number; // rai/hour
  image: string;
}

const DRONE_MODELS: DroneModel[] = [
  {
    id: '20L',
    name: 'AgriFlight Pro 20L',
    capacity: 20,
    unitPrice: 295000,
    batteryCost: 28000,
    coveragePerCharge: 38, // Average of 35-40
    sprayRate: 60,
    image: '🚁'
  },
  {
    id: '6L',
    name: 'AgriFlight Compact 6L',
    capacity: 6,
    unitPrice: 135000,
    batteryCost: 9500,
    coveragePerCharge: 10, // Average of 8-12
    sprayRate: 25,
    image: '🛸'
  },
  {
    id: '6Ls',
    name: 'AgriFlight SE 6Ls',
    capacity: 6,
    unitPrice: 125000,
    batteryCost: 8500,
    coveragePerCharge: 9, // Average of 8-10
    sprayRate: 22,
    image: '🚁'
  }
];

export const MatrixVisualization: React.FC = () => {
  const [farmSize, setFarmSize] = useState<number>(50);
  const [selectedModel, setSelectedModel] = useState<string>('20L');
  const [isExpanded, setIsExpanded] = useState(false);
  const [benchmark, setBenchmark] = useState<any>(null);

  const model = useMemo(() => 
    DRONE_MODELS.find(m => m.id === selectedModel) || DRONE_MODELS[0]
  , [selectedModel]);

  const calculations = useMemo(() => {
    // Performance benchmarking for complex calculations
    return ultraOptimizer.auto_execute(() => {
      const totalCharges = Math.ceil(farmSize / model.coveragePerCharge);
      const totalTime = (farmSize / model.sprayRate).toFixed(1);
      const batteriesNeeded = Math.min(Math.ceil(totalCharges / 2), 4); // Assume charging while flying
      const totalBatteryInvestment = batteriesNeeded * model.batteryCost;
      const totalInitialInvestment = model.unitPrice + totalBatteryInvestment;
      
      // ROI Calculation (Estimated savings compared to manual labor at 150 THB/rai)
      const manualCostPerRai = 150;
      const droneOperationalCostPerRai = 40; // Including maintenance, battery wear, electricity
      const savingsPerRai = manualCostPerRai - droneOperationalCostPerRai;
      const seasonalSavings = farmSize * savingsPerRai * 3; // Assume 3 seasons/year
      const breakEvenMonths = (totalInitialInvestment / (seasonalSavings / 12)).toFixed(1);

      return {
        totalCharges,
        totalTime,
        batteriesNeeded,
        totalBatteryInvestment,
        totalInitialInvestment,
        seasonalSavings,
        breakEvenMonths
      };
    }, farmSize, model);
  }, [farmSize, model]);

  useEffect(() => {
    // Record telemetry for production monitoring
    const metrics = ultraOptimizer.benchmark(() => calculations);
    setBenchmark(metrics);

    // Mock Analytics Tracking
    console.log('[Analytics] Matrix Calculation Updated:', {
      farmSize,
      selectedModel,
      investment: calculations.totalInitialInvestment,
      timestamp: new Date().toISOString()
    });
  }, [calculations, farmSize, selectedModel]);

  return (
    <section 
      id="matrix-calculation"
      className="py-24 bg-slate-50 relative overflow-hidden"
      aria-labelledby="matrix-title"
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-indigo-50/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-semibold mb-6 animate-fadeIn">
            <Calculator size={16} />
            <span>Smart ROI Calculator</span>
          </div>
          <h2 id="matrix-title" className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 tracking-tight">
            Calculate Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Agricultural Efficiency</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            See exactly how much you can save and how quickly your investment pays off with AgriFlight's advanced drone technology.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Input Controls Panel */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-xl font-bold text-slate-900 mb-8 flex items-center gap-2">
                <Maximize2 size={20} className="text-blue-600" />
                Input Parameters
              </h3>

              <div className="space-y-8">
                {/* Farm Size Slider */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label htmlFor="farm-size" className="text-sm font-semibold text-slate-700">
                      Total Farm Area (Rai)
                    </label>
                    <span className="px-3 py-1 bg-blue-600 text-white rounded-lg font-bold text-sm">
                      {farmSize} Rai
                    </span>
                  </div>
                  <input
                    id="farm-size"
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={farmSize}
                    onChange={(e) => setFarmSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                    aria-valuemin={10}
                    aria-valuemax={500}
                    aria-valuenow={farmSize}
                  />
                  <div className="flex justify-between text-xs text-slate-400 font-medium">
                    <span>10 Rai</span>
                    <span>500 Rai</span>
                  </div>
                </div>

                {/* Model Selection */}
                <div className="space-y-4">
                  <label className="text-sm font-semibold text-slate-700 block">
                    Select Drone Model
                  </label>
                  <div className="space-y-3">
                    {DRONE_MODELS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedModel(m.id)}
                        className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-4 text-left ${
                          selectedModel === m.id
                            ? 'border-blue-600 bg-blue-50 shadow-sm'
                            : 'border-slate-100 hover:border-slate-200 bg-white'
                        }`}
                        aria-pressed={selectedModel === m.id}
                      >
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${
                          selectedModel === m.id ? 'bg-blue-600' : 'bg-slate-100'
                        }`}>
                          {m.image}
                        </div>
                        <div>
                          <p className={`font-bold text-sm ${selectedModel === m.id ? 'text-blue-900' : 'text-slate-900'}`}>
                            {m.name}
                          </p>
                          <p className="text-xs text-slate-500">{m.capacity}L Capacity</p>
                        </div>
                        {selectedModel === m.id && (
                          <ShieldCheck size={18} className="ml-auto text-blue-600" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Telemetry Card (Mock Production Feature) */}
            <div className="bg-slate-900 text-white p-6 rounded-[2rem] shadow-xl overflow-hidden relative group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap size={80} />
              </div>
              <h4 className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-4 flex items-center gap-2">
                <BarChart3 size={14} />
                Real-time Optimization
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Execution Speed</span>
                  <span className="font-mono text-emerald-400">{(benchmark?.execution_time * 1000 || 0.42).toFixed(2)}ms</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Memory Delta</span>
                  <span className="font-mono text-emerald-400">{(benchmark?.memory_delta || 124) / 1024} KB</span>
                </div>
                <div className="pt-3 border-t border-white/10 mt-3">
                  <p className="text-[10px] text-slate-500 leading-relaxed italic">
                    Powered by AgriFlight UltraOptimizer™ for zero-latency predictive calculations.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Matrix Results Visualization */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-[2.5rem] border border-slate-200 shadow-xl overflow-hidden flex flex-col h-full">
              {/* Visualization Header */}
              <div className="p-8 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">Projected Performance Matrix</h3>
                  <p className="text-slate-500 text-sm mt-1">Dynamic operational analysis for {farmSize} Rai</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex flex-col items-end">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Initial Investment</span>
                    <span className="text-2xl font-black text-blue-600">
                      ฿{calculations.totalInitialInvestment.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-px h-10 bg-slate-100 mx-2"></div>
                  <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors text-slate-600"
                    aria-label={isExpanded ? "Show less" : "Show detailed matrix"}
                  >
                    {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
                  </button>
                </div>
              </div>

              {/* Main Matrix Grid */}
              <div className="flex-grow p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Operation Matrix */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                      <Zap size={18} className="text-amber-500" />
                      <h4>Operational Metrics</h4>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="group bg-slate-50 p-5 rounded-2xl border border-transparent hover:border-blue-200 hover:bg-white transition-all duration-300">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                            <Battery size={16} /> Total Cycles
                          </span>
                          <span className="text-lg font-bold text-slate-900">{calculations.totalCharges} Charges</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-blue-600 h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${Math.min((calculations.totalCharges / 20) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="group bg-slate-50 p-5 rounded-2xl border border-transparent hover:border-blue-200 hover:bg-white transition-all duration-300">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                            <Clock size={16} /> Mission Time
                          </span>
                          <span className="text-lg font-bold text-slate-900">{calculations.totalTime} Hours</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                          <div 
                            className="bg-indigo-600 h-full rounded-full transition-all duration-1000 ease-out"
                            style={{ width: `${Math.min((parseFloat(calculations.totalTime) / 10) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="group bg-slate-50 p-5 rounded-2xl border border-transparent hover:border-blue-200 hover:bg-white transition-all duration-300">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
                            <ShieldCheck size={16} /> Batteries Needed
                          </span>
                          <span className="text-lg font-bold text-slate-900">{calculations.batteriesNeeded} Units</span>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(4)].map((_, i) => (
                            <div 
                              key={i} 
                              className={`h-2 flex-grow rounded-full ${i < calculations.batteriesNeeded ? 'bg-emerald-500' : 'bg-slate-200'}`}
                            ></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profit/ROI Matrix */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-slate-900 font-bold">
                      <TrendingUp size={18} className="text-emerald-500" />
                      <h4>Economic Impact</h4>
                    </div>

                    <div className="bg-gradient-to-br from-emerald-50 to-teal-50 p-8 rounded-[2rem] border border-emerald-100 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 p-4 text-emerald-100/50 -rotate-12 transform scale-150">
                        <TrendingUp size={120} />
                      </div>
                      
                      <div className="relative z-10 space-y-6">
                        <div>
                          <p className="text-emerald-700 font-bold text-sm mb-1">Annual Projected Savings</p>
                          <p className="text-4xl font-black text-emerald-900">
                            ฿{Math.round(calculations.seasonalSavings).toLocaleString()}
                          </p>
                        </div>
                        
                        <div className="flex items-center gap-4 bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/40">
                          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">
                            {calculations.breakEvenMonths}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Break-Even Period</p>
                            <p className="text-sm text-emerald-600 font-medium">Months to full ROI</p>
                          </div>
                        </div>

                        <div className="pt-2">
                          <button className="w-full py-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-200">
                            Get Detailed Report
                            <ChevronRight size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Extended Details (Conditional) */}
                {isExpanded && (
                  <div className="mt-8 pt-8 border-t border-slate-100 animate-fadeIn">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <h5 className="text-xs font-bold text-slate-400 uppercase mb-3">Unit Configuration</h5>
                        <ul className="space-y-2 text-sm text-slate-600">
                          <li className="flex justify-between"><span>Base Drone</span> <span className="font-bold text-slate-900">฿{model.unitPrice.toLocaleString()}</span></li>
                          <li className="flex justify-between"><span>Battery Pack (x{calculations.batteriesNeeded})</span> <span className="font-bold text-slate-900">฿{calculations.totalBatteryInvestment.toLocaleString()}</span></li>
                          <li className="flex justify-between"><span>Smart Hub</span> <span className="text-emerald-600 font-bold">FREE</span></li>
                        </ul>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <h5 className="text-xs font-bold text-slate-400 uppercase mb-3">Spray Statistics</h5>
                        <ul className="space-y-2 text-sm text-slate-600">
                          <li className="flex justify-between"><span>Efficiency</span> <span className="font-bold text-slate-900">98.4%</span></li>
                          <li className="flex justify-between"><span>Overlap Margin</span> <span className="font-bold text-slate-900">0.5m</span></li>
                          <li className="flex justify-between"><span>Auto-Terrain</span> <span className="text-emerald-600 font-bold">ACTIVE</span></li>
                        </ul>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                        <h5 className="text-xs font-bold text-slate-400 uppercase mb-3">Maintenance Index</h5>
                        <ul className="space-y-2 text-sm text-slate-600">
                          <li className="flex justify-between"><span>Service Interval</span> <span className="font-bold text-slate-900">200 Hrs</span></li>
                          <li className="flex justify-between"><span>Part Availability</span> <span className="font-bold text-slate-900">High</span></li>
                          <li className="flex justify-between"><span>Warranty</span> <span className="text-emerald-600 font-bold">2 Years</span></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Matrix Footer */}
              <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-400 text-[10px] font-medium">
                  <Info size={12} />
                  <span>Calculations based on average agricultural conditions in Southeast Asia.</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Live Data Feed</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning / Edge Case Handling */}
            {farmSize > 400 && selectedModel !== '20L' && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 animate-shake">
                <AlertCircle className="text-amber-600 shrink-0" size={20} />
                <div>
                  <p className="text-sm font-bold text-amber-900">Recommended Configuration Alert</p>
                  <p className="text-xs text-amber-700 leading-relaxed">
                    For farm sizes over 400 Rai, we strongly recommend the <strong>AgriFlight Pro 20L</strong> for optimal efficiency and mission continuity.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </section>
  );
};

export default MatrixVisualization;
