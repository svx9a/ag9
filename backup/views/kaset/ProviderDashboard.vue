<template>
  <div class="min-h-screen bg-[#0a0c10] text-slate-300 font-sans selection:bg-blue-500/30">
    <!-- Top Navigation / Status Bar -->
    <header class="h-16 border-b border-slate-800/50 bg-[#0d1117]/80 backdrop-blur-xl flex items-center justify-between px-8 sticky top-0 z-[2000]">
      <div class="flex items-center gap-6">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 bg-gradient-to-br from-emerald-600 to-emerald-800 rounded-lg flex items-center justify-center shadow-lg shadow-emerald-900/20">
            <Activity class="w-5 h-5 text-white" />
          </div>
          <span class="text-white font-black tracking-tighter text-xl uppercase italic">GreenDay<span class="text-emerald-500">Ops</span></span>
        </div>
        <div class="h-4 w-[1px] bg-slate-800"></div>
        <nav class="hidden md:flex items-center gap-4">
          <button v-for="m in ['Overview', 'Tenants', 'Fleet', 'API', 'Security']" :key="m"
                  :class="activeView === m.toLowerCase() ? 'text-emerald-400 bg-emerald-500/10' : 'hover:text-white'"
                  class="px-3 py-1.5 rounded-md text-xs font-bold uppercase tracking-widest transition-all">
            {{ m }}
          </button>
        </nav>
      </div>

      <div class="flex items-center gap-6">
        <div class="flex items-center gap-4">
          <div class="flex flex-col items-end">
            <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Platform Status</span>
            <div class="flex items-center gap-2">
              <span class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]"></span>
              <span class="text-xs font-bold text-emerald-400 uppercase tracking-tighter">{{ $t('dashboard.sys_online') }}</span>
            </div>
          </div>
          <div class="h-8 w-[1px] bg-slate-800"></div>
          <button class="relative group">
            <Bell class="w-5 h-5 text-slate-400 group-hover:text-white transition-colors" />
            <span class="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0d1117]"></span>
          </button>
          <div class="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden">
            <User class="w-4 h-4 text-slate-400" />
          </div>
        </div>
      </div>
    </header>

    <main class="p-8 max-w-[1600px] mx-auto space-y-8">
      <!-- High-Level Intelligence Row -->
      <section class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div v-for="stat in platformStats" :key="stat.id"
             class="bg-[#0d1117] border border-slate-800/50 p-6 rounded-3xl hover:border-blue-500/30 transition-all group relative overflow-hidden">
          <div class="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-all"></div>
          <div class="flex justify-between items-start mb-4 relative z-10">
            <div :class="stat.iconBg" class="w-10 h-10 rounded-xl flex items-center justify-center">
              <component :is="stat.icon" class="w-5 h-5" :class="stat.iconColor" />
            </div>
            <span :class="stat.trend > 0 ? 'text-emerald-400' : 'text-slate-500'" class="text-[10px] font-black bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
              {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
            </span>
          </div>
          <div class="relative z-10">
            <p class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{{ stat.label }}</p>
            <h3 class="text-3xl font-black text-white tracking-tighter">{{ stat.value }}</h3>
          </div>
        </div>
      </section>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <!-- Center-Left: Multi-Tenant Oversight & Fleet Map -->
        <div class="lg:col-span-8 space-y-8">
          <!-- Agent Intelligence & Pulse -->
          <div class="bg-[#0d1117] border border-slate-800/50 rounded-[2.5rem] p-8 relative overflow-hidden">
            <div class="absolute right-0 top-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
            <div class="flex items-center justify-between mb-8 relative z-10">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
                  <Cpu class="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h2 class="text-xl font-black text-white uppercase tracking-tighter italic">GreenDay AI Agent</h2>
                  <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Mistral-Powered Core Active</p>
                </div>
              </div>
              <div class="flex items-center gap-6">
                <div v-for="pulse in agentPulse" :key="pulse.label" class="text-right">
                  <p class="text-[9px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{{ pulse.label }}</p>
                  <p class="text-sm font-black text-white leading-none">{{ pulse.value }}</p>
                </div>
              </div>
            </div>

            <!-- Live Agent Activity -->
            <div class="space-y-4 relative z-10">
              <div v-for="log in agentLogs" :key="log.id"
                   class="flex items-center gap-4 p-4 bg-slate-900/40 border border-slate-800/50 rounded-2xl hover:border-emerald-500/20 transition-all">
                <div :class="log.status === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'"
                     class="w-8 h-8 rounded-lg flex items-center justify-center">
                  <component :is="log.icon" class="w-4 h-4" />
                </div>
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between">
                    <p class="text-[10px] font-black text-white uppercase tracking-tight truncate">{{ log.action }}</p>
                    <span class="text-[9px] font-bold text-slate-500">{{ log.time }}</span>
                  </div>
                  <p class="text-[10px] text-slate-500 truncate mt-0.5">{{ log.details }}</p>
                </div>
              </div>
            </div>

            <button class="w-full mt-6 py-4 bg-slate-900/50 hover:bg-slate-800/50 border border-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all">
              View Agent Analytics
            </button>
          </div>

          <!-- Multi-Tenant Control Panel -->
          <div class="bg-[#0d1117] border border-slate-800/50 rounded-[2.5rem] overflow-hidden">
            <div class="p-8 border-b border-slate-800/50 flex items-center justify-between bg-slate-900/20">
              <div>
                <h2 class="text-xl font-black text-white uppercase tracking-tighter italic">Tenant Oversight</h2>
                <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Managing {{ tenants.length }} Regional FarmHubs</p>
              </div>
              <div class="flex gap-2">
                <div class="relative">
                  <Search class="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-500" />
                  <input type="text" placeholder="Search tenants..."
                         class="bg-slate-950 border border-slate-800 rounded-xl py-2 pl-10 pr-4 text-[10px] font-bold text-slate-300 focus:ring-2 focus:ring-blue-500/20 outline-none w-48 transition-all" />
                </div>
                <button class="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-blue-900/20">
                  Deploy Hub
                </button>
              </div>
            </div>
            <div class="p-0">
              <table class="w-full text-left">
                <thead class="bg-slate-900/40 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  <tr>
                    <th class="px-8 py-4">FarmHub / Location</th>
                    <th class="px-6 py-4">Status</th>
                    <th class="px-6 py-4 text-center">Active Pilots</th>
                    <th class="px-6 py-4 text-center">Health</th>
                    <th class="px-8 py-4 text-right">Throughput</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-800/50">
                  <tr v-for="tenant in tenants" :key="tenant.id" class="hover:bg-slate-800/20 transition-colors group cursor-pointer">
                    <td class="px-8 py-6">
                      <div class="flex items-center gap-4">
                        <div class="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center font-black text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                          {{ tenant.id }}
                        </div>
                        <div>
                          <div class="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{{ tenant.name }}</div>
                          <div class="text-[10px] text-slate-500 font-medium">{{ tenant.location }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-6">
                      <div class="flex items-center gap-2">
                        <span :class="tenant.status === 'online' ? 'bg-emerald-500' : 'bg-amber-500'" class="w-1.5 h-1.5 rounded-full"></span>
                        <span class="text-[10px] font-black uppercase tracking-tighter" :class="tenant.status === 'online' ? 'text-emerald-400' : 'text-amber-400'">
                          {{ tenant.status }}
                        </span>
                      </div>
                    </td>
                    <td class="px-6 py-6 text-center">
                      <span class="text-sm font-black text-white">{{ tenant.pilots }}</span>
                    </td>
                    <td class="px-6 py-6">
                      <div class="w-24 h-1.5 bg-slate-800 rounded-full mx-auto overflow-hidden">
                        <div :class="tenant.health > 90 ? 'bg-emerald-500' : 'bg-blue-500'"
                             class="h-full rounded-full transition-all duration-1000"
                             :style="{ width: tenant.health + '%' }"></div>
                      </div>
                    </td>
                    <td class="px-8 py-6 text-right">
                      <div class="text-sm font-black text-white">฿{{ tenant.throughput.toLocaleString() }}</div>
                      <div class="text-[8px] text-slate-500 font-bold uppercase">Monthly Rev</div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Fleet Telemetry Aggregator -->
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="t in telemetryMetrics" :key="t.label" class="bg-[#0d1117] border border-slate-800/50 p-6 rounded-3xl">
              <div class="flex items-center justify-between mb-4">
                <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ t.label }}</span>
                <component :is="t.icon" class="w-4 h-4 text-blue-500 opacity-50" />
              </div>
              <div class="flex items-baseline gap-2">
                <span class="text-2xl font-black text-white tracking-tighter">{{ t.value }}</span>
                <span class="text-[10px] font-bold text-slate-500">{{ t.unit }}</span>
              </div>
              <div class="mt-4 h-1 bg-slate-800 rounded-full overflow-hidden">
                <div class="h-full bg-gradient-to-r from-blue-600 to-indigo-500 rounded-full" :style="{ width: t.percent + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Right Column: API Health & Real-time Logs -->
        <div class="lg:col-span-4 space-y-8">
          <!-- API Health Monitor -->
          <div class="bg-[#0d1117] border border-slate-800/50 rounded-[2.5rem] p-8">
            <div class="flex items-center justify-between mb-8">
              <h3 class="text-lg font-black text-white uppercase tracking-tighter flex items-center gap-3 italic">
                <Cpu class="w-5 h-5 text-blue-500" />
                API Pulse
              </h3>
              <div class="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-full text-[10px] font-black uppercase border border-emerald-500/20">
                99.98% Uptime
              </div>
            </div>

            <div class="space-y-6">
              <div v-for="api in apiEndpoints" :key="api.name" class="p-4 bg-slate-900/40 rounded-2xl border border-slate-800/50">
                <div class="flex justify-between items-start mb-3">
                  <div>
                    <div class="text-[10px] font-black text-white uppercase tracking-widest">{{ api.name }}</div>
                    <div class="text-[8px] text-slate-500 font-bold font-mono mt-0.5">{{ api.url }}</div>
                  </div>
                  <span :class="api.latency < 100 ? 'text-emerald-400' : 'text-amber-400'" class="text-[10px] font-mono font-black">
                    {{ api.latency }}ms
                  </span>
                </div>
                <div class="flex gap-1 h-3">
                  <div v-for="i in 20" :key="i"
                       :class="i === 15 ? 'bg-red-500/50' : i > 12 ? 'bg-amber-500/50' : 'bg-emerald-500/50'"
                       class="flex-1 rounded-sm opacity-80 hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Real-time Event Stream -->
          <div class="bg-[#0d1117] border border-slate-800/50 rounded-[2.5rem] p-8 flex flex-col h-[400px]">
            <div class="flex items-center justify-between mb-6">
              <h3 class="text-lg font-black text-white uppercase tracking-tighter italic">Fleet Events</h3>
              <div class="flex items-center gap-2">
                <span class="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></span>
                <span class="text-[10px] font-black text-blue-500 uppercase tracking-widest">Live</span>
              </div>
            </div>
            <div class="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              <div v-for="event in fleetEvents" :key="event.id" class="flex gap-4 group">
                <div class="flex flex-col items-center">
                  <div class="w-2 h-2 rounded-full mt-1.5" :class="event.color"></div>
                  <div class="flex-1 w-[1px] bg-slate-800 my-1"></div>
                </div>
                <div class="pb-4">
                  <div class="text-[10px] text-slate-500 font-mono mb-1">{{ event.time }}</div>
                  <div class="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">{{ event.message }}</div>
                  <div class="text-[9px] text-slate-600 font-black uppercase tracking-tighter mt-1">{{ event.hub }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import {
  Activity, Bell, User, Search, Shield,
  Database, Users, Globe, Zap, Cpu,
  CloudRain, Signal, AlertTriangle, CheckCircle,
  BarChart3, Plane, Server, XCircle
} from 'lucide-vue-next';

const activeView = ref('overview');

// Agent Intelligence Data
const agentPulse = [
  { label: 'Daily Throughput', value: '1,248 Tasks' },
  { label: 'Avg Response', value: '420ms' },
  { label: 'Token Efficiency', value: '98.2%' }
];

const agentLogs = [
  { id: 1, action: 'Flight Path Optimization', status: 'success', icon: Activity, time: '2m ago', details: 'Nakhon Nayok Hub: Recalculated 12 missions for wind shift' },
  { id: 2, action: 'Predictive Maintenance Alert', status: 'success', icon: AlertTriangle, time: '15m ago', details: 'Drone #HG-201: Battery cell imbalance detected' },
  { id: 3, action: 'API Authentication Sync', status: 'success', icon: Shield, time: '1h ago', details: 'Renewed session tokens for GISTDA Sphere Gateway' },
  { id: 4, action: 'Resource Allocation Failure', status: 'failure', icon: XCircle, time: '2h ago', details: 'Pilot assignment failed for Hub #4: No active standby' }
];

// Data Models (Platform Operator Level)
const platformStats = ref([
  { id: 1, label: 'Total Managed Rev', value: '฿12.4M', trend: 12.5, icon: Database, iconBg: 'bg-blue-500/10', iconColor: 'text-blue-500' },
  { id: 2, label: 'Active FarmHubs', value: '42', trend: 4.2, icon: Globe, iconBg: 'bg-indigo-500/10', iconColor: 'text-indigo-500' },
  { id: 3, label: 'Fleet Utilization', value: '84%', trend: -2.1, icon: Plane, iconBg: 'bg-emerald-500/10', iconColor: 'text-emerald-500' },
  { id: 4, label: 'Active Sessions', value: '1,284', trend: 18.4, icon: Users, iconBg: 'bg-amber-500/10', iconColor: 'text-amber-500' }
]);

const tenants = ref([
  { id: 'HUB-01', name: 'Nakhon Nayok Central', location: 'Thailand, Central', status: 'online', pilots: 18, health: 98, throughput: 450000 },
  { id: 'HUB-02', name: 'Ratchaburi Precision', location: 'Thailand, West', status: 'online', pilots: 12, health: 94, throughput: 280000 },
  { id: 'HUB-03', name: 'Suphanburi Logistics', location: 'Thailand, Central', status: 'warning', pilots: 24, health: 82, throughput: 590000 },
  { id: 'HUB-04', name: 'Chiang Mai Agro', location: 'Thailand, North', status: 'online', pilots: 8, health: 96, throughput: 150000 },
  { id: 'HUB-05', name: 'Ubon Smart Farm', location: 'Thailand, Isan', status: 'online', pilots: 15, health: 91, throughput: 310000 }
]);

const telemetryMetrics = ref([
  { label: 'Avg Signal Strength', value: '-64', unit: 'dBm', percent: 85, icon: Signal },
  { label: 'Battery Health Index', value: '92.4', unit: '%', percent: 92, icon: Zap },
  { label: 'Compute Load (Edge)', value: '34.1', unit: '%', percent: 34, icon: Server }
]);

const apiEndpoints = ref([
  { name: 'Core Flight API', url: 'api.kraset.ops/v1/flight', latency: 42 },
  { name: 'Telemetry Gateway', url: 'gw.kraset.ops/telemetry', latency: 18 },
  { name: 'Identity Service', url: 'auth.kraset.ops/v2', latency: 124 },
  { name: 'Asset Management', url: 'api.kraset.ops/v1/assets', latency: 68 }
]);

const fleetEvents = ref([
  { id: 1, time: '14:22:01', message: 'HUB-01: Auto-dispatching Pilot Alpha-04 for mission ID 8821', hub: 'Nakhon Nayok', color: 'bg-blue-500' },
  { id: 2, time: '14:21:45', message: 'System: Scaling API nodes to 8 instances due to load', hub: 'Platform', color: 'bg-emerald-500' },
  { id: 3, time: '14:20:12', message: 'HUB-03: Signal interference detected in Sector 4B', hub: 'Suphanburi', color: 'bg-amber-500' },
  { id: 4, time: '14:18:55', message: 'HUB-02: Mission completed - 45.2 Rai processed', hub: 'Ratchaburi', color: 'bg-emerald-500' },
  { id: 5, time: '14:15:30', message: 'Security: Blocked 12 unauthorized access attempts from 103.4.22.x', hub: 'Platform', color: 'bg-red-500' }
]);

// Derived Logic
const globalHealthScore = computed(() => {
  const sum = tenants.value.reduce((acc, t) => acc + t.health, 0);
  return (sum / tenants.value.length).toFixed(1);
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Kanit:wght@400;700;900&display=swap');

.font-sans {
  font-family: 'Kanit', sans-serif;
}

.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #1e293b;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #334155;
}

/* Operational confidence glow */
.group:hover .tenant-id-badge {
  box-shadow: 0 0 15px rgba(59, 130, 246, 0.4);
}
</style>
