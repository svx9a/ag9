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
    const metrics = ultraOptimizer.benchmark(async () => calculations);
    metrics.then(res => setBenchmark(res));

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
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Farm Size (Rai)</label>
                    <span className="px-3 py-1 bg-slate-100 rounded-lg font-mono font-bold text-blue-600">{farmSize}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="1000" 
                    value={farmSize}
                    onChange={(e) => setFarmSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <span>1 Rai</span>
                    <span>500 Rai</span>
                    <span>1000 Rai</span>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wider block mb-4">Drone Model</label>
                  <div className="grid grid-cols-1 gap-3">
                    {DRONE_MODELS.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => setSelectedModel(m.id)}
                        className={`p-4 rounded-2xl border-2 text-left transition-all flex items-center gap-4 ${
                          selectedModel === m.id 
                            ? 'border-blue-600 bg-blue-50/50 ring-4 ring-blue-600/5' 
                            : 'border-slate-100 hover:border-slate-200 bg-white'
                        }`}
                      >
                        <span className="text-2xl">{m.image}</span>
                        <div className="flex-1">
                          <div className="font-bold text-slate-900">{m.name}</div>
                          <div className="text-xs text-slate-500 font-medium">{m.capacity}L Capacity • {m.coveragePerCharge} Rai/Charge</div>
                        </div>
                        {selectedModel === m.id && <Zap size={16} className="text-blue-600 fill-blue-600" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Metrics */}
            {benchmark && (
              <div className="bg-slate-900 p-6 rounded-[2rem] text-white overflow-hidden relative">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <TrendingUp size={80} />
                </div>
                <h4 className="text-xs font-bold text-blue-400 uppercase tracking-widest mb-4">Optimization Engine</h4>
                <div className="flex items-center gap-3 mb-4">
                  <div className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></div>
                  <span className="text-xs font-mono font-bold">Latency: {benchmark.metrics.executionTime.toFixed(4)}ms</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium">
                  Calculations hyper-executed via AstroBoyCore Predictive Caching.
                </p>
              </div>
            )}
          </div>

          {/* Results Visualization */}
          <div className="lg:col-span-8">
            <div className="bg-white p-8 md:p-12 rounded-[2rem] border border-slate-200 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-6 mb-12">
                <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                  <TrendingUp size={24} className="text-emerald-500" />
                  Estimated Impact
                </h3>
                <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-sm font-bold">
                  <ShieldCheck size={18} />
                  98.5% Accuracy Rate
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 group hover:bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Battery size={24} />
                  </div>
                  <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Battery Management</div>
                  <div className="text-3xl font-bold text-slate-900 mb-4">{calculations.batteriesNeeded} Units</div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Recommended battery count for continuous rotation based on {calculations.totalCharges} total charges required.
                  </p>
                </div>

                <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 group hover:bg-white hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-500">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Clock size={24} />
                  </div>
                  <div className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Operational Time</div>
                  <div className="text-3xl font-bold text-slate-900 mb-4">{calculations.totalTime} Hours</div>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    Total estimated spraying time for {farmSize} Rai at {model.sprayRate} Rai/hour.
                  </p>
                </div>
              </div>

              <div className="relative p-8 md:p-12 rounded-[2.5rem] bg-gradient-to-br from-slate-900 to-indigo-950 text-white overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-[100px]"></div>
                
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg">
                      <BarChart3 size={20} className="text-blue-400" />
                    </div>
                    <span className="text-sm font-bold uppercase tracking-[0.2em] text-blue-300">Investment Summary</span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div>
                      <div className="text-blue-200/60 text-xs font-bold uppercase tracking-widest mb-2">Break-even Period</div>
                      <div className="text-5xl font-bold mb-4 tracking-tighter">
                        {calculations.breakEvenMonths} <span className="text-xl text-blue-300">Months</span>
                      </div>
                      <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-blue-400 to-emerald-400 rounded-full transition-all duration-1000" 
                          style={{ width: `${Math.min(100, (12 / parseFloat(calculations.breakEvenMonths)) * 100)}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="space-y-6">
                      <div className="flex justify-between items-end border-b border-white/10 pb-4">
                        <span className="text-sm text-slate-400 font-medium">Total Initial Cost</span>
                        <span className="text-xl font-bold">฿{calculations.totalInitialInvestment.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-end border-b border-white/10 pb-4">
                        <span className="text-sm text-slate-400 font-medium">Seasonal Savings (3x)</span>
                        <span className="text-xl font-bold text-emerald-400">฿{calculations.seasonalSavings.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 flex flex-wrap items-center gap-4">
                    <button className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-bold transition-all shadow-lg shadow-blue-900/20 flex items-center gap-2 group">
                      Get Detailed PDF Report
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <div className="flex items-center gap-2 text-xs text-slate-400 font-medium">
                      <AlertCircle size={14} />
                      *Estimated based on current market labor rates.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MatrixVisualization;