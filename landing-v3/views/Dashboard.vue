<template>
  <div class="pt-24 min-h-screen bg-slate-50 text-slate-900" :dir="isRTL($i18n.locale) ? 'rtl' : 'ltr'">
    <div class="max-w-7xl mx-auto px-6 py-12">
      <!-- Welcome Header -->
      <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div>
          <h1 class="text-4xl font-black text-slate-900 mb-2 uppercase tracking-tighter italic">{{ $t('dashboard.title') }}</h1>
          <p class="text-slate-500 font-bold uppercase tracking-widest text-[10px]">
            {{ $t('dashboard.hub') }} • {{ authStore.user?.name || $t('dashboard.pilot_mode') }}
          </p>
        </div>
        <div class="flex items-center gap-4">
          <!-- Performance & Compliance Indicators -->
          <div class="hidden lg:flex items-center gap-6 px-6 py-3 bg-white rounded-2xl border border-slate-200 shadow-sm mr-4">
            <div class="flex flex-col">
              <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Global CDN</span>
              <div class="flex items-center gap-1.5">
                <div class="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                <span class="text-[10px] font-bold text-slate-700">Active (Edge)</span>
              </div>
            </div>
            <div class="w-px h-6 bg-slate-200"></div>
            <div class="flex flex-col">
              <span class="text-[8px] font-black text-slate-400 uppercase tracking-widest">Compliance</span>
              <div class="flex items-center gap-1.5">
                <ShieldCheck class="w-3 h-3 text-emerald-600" />
                <span class="text-[10px] font-bold text-slate-700 uppercase">GDPR/CCPA</span>
              </div>
            </div>
          </div>

          <div class="flex bg-slate-200 p-1 rounded-xl overflow-x-auto max-w-[200px] md:max-w-none no-scrollbar shadow-inner">
            <button v-for="lang in ['en', 'th', 'zh', 'ja', 'es']" :key="lang"
                    @click="changeLocale(lang)"
                    class="px-3 py-2 rounded-lg text-[10px] md:text-sm font-bold transition-all uppercase whitespace-nowrap"
                    :class="[$i18n.locale === lang ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700']">
              {{ lang }}
            </button>
          </div>
          <button @click="handleLogout"
                  class="p-3 bg-white hover:bg-red-50 text-slate-400 hover:text-red-500 rounded-xl transition-all border border-slate-200">
            <LogOut class="w-6 h-6" />
          </button>
        </div>
      </div>

      <!-- Main Dashboard Content (Unified) -->
      <div v-if="authStore.role === 'provider'">
        <!-- Provider Unified View (Minible Style) -->
        <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <!-- Quick Stats Row -->
          <div v-if="dashboardData" class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
             <div v-for="stat in platformStats" :key="stat.id"
                  class="bg-white border border-slate-200 p-6 rounded-[2rem] shadow-sm group hover:border-emerald-500 transition-all">
               <div class="flex items-center justify-between mb-4">
                 <div :class="`p-3 rounded-2xl ${stat.iconBg}`">
                   <component :is="stat.icon" :class="`w-6 h-6 ${stat.iconColor}`" />
                 </div>
                 <span :class="`text-[10px] font-black uppercase tracking-widest ${stat.trend > 0 ? 'text-emerald-600' : 'text-amber-600'}`">
                   {{ stat.trend > 0 ? '+' : '' }}{{ stat.trend }}%
                 </span>
               </div>
               <p class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{{ stat.label }}</p>
               <h3 class="text-2xl font-black text-slate-900 tracking-tighter">{{ stat.value }}</h3>
             </div>
          </div>

          <!-- Main Grid -->
          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Left: Fleet Oversight -->
            <div class="lg:col-span-8 space-y-8">
              <AIActiveSupervisor />
              <div class="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div class="p-8 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 class="text-xl font-black text-slate-900 uppercase tracking-tighter italic">{{ $t('dashboard.oversight') }}</h2>
                    <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{{ $t('dashboard.ops_status') }}</p>
                  </div>
                  <div class="flex gap-2">
                    <button @click="dashboardView = dashboardView === 'grid' ? 'focus' : 'grid'"
                            class="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all flex items-center gap-2">
                      <LayoutDashboard v-if="dashboardView === 'focus'" class="w-4 h-4" />
                      <Maximize2 v-else class="w-4 h-4" />
                      <span class="text-[10px] font-bold uppercase hidden md:inline">{{ dashboardView === 'grid' ? 'Focus Mode' : 'Grid View' }}</span>
                    </button>
                    <button @click="fetchDashboardData" class="p-2 rounded-xl bg-slate-100 text-slate-600 hover:bg-slate-200 transition-all">
                      <RefreshCw class="w-4 h-4" :class="{ 'animate-spin': isLoading }" />
                    </button>
                  </div>
                </div>
                <div class="p-0">
                   <DroneMap :dronePosition="dronePosition" :path="flightPath" />
                </div>
              </div>

              <!-- Telemetry Aggregator -->
              <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div v-for="t in telemetryMetrics" :key="t.label" class="bg-white border border-slate-200 p-6 rounded-3xl shadow-sm">
                  <div class="flex items-center justify-between mb-4">
                    <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">{{ t.label }}</span>
                    <component :is="t.icon || Zap" class="w-4 h-4 text-emerald-500 opacity-50" />
                  </div>
                  <div class="flex items-baseline gap-2">
                    <span class="text-2xl font-black text-slate-900 tracking-tighter">{{ t.value }}</span>
                    <span class="text-[10px] font-bold text-slate-500">{{ t.unit }}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Right: Control & Logs -->
            <div class="lg:col-span-4 space-y-8">
              <MissionControl />
              <div class="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                <div class="flex items-center justify-between mb-6">
                  <h3 class="text-lg font-black text-slate-900 uppercase tracking-tighter italic">{{ $t('provider.api.pulse') }}</h3>
                  <div class="flex items-center gap-2">
                    <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                    <span class="text-[10px] font-bold text-slate-500 uppercase">{{ $t('provider.stats.real_time') }}</span>
                  </div>
                </div>
                <!-- Interactive SVG Chart -->
                <div class="h-48 w-full relative group">
                  <svg class="w-full h-full" viewBox="0 0 100 40" preserveAspectRatio="none">
                    <!-- Grid Lines -->
                    <line v-for="i in 4" :key="i" x1="0" :y1="i*10" x2="100" :y2="i*10" stroke="currentColor" class="text-slate-100" stroke-width="0.1" />
                    <!-- Area -->
                    <path :d="chartAreaPath" fill="url(#chartGradient)" class="opacity-10" />
                    <!-- Line -->
                    <path :d="chartLinePath" fill="none" stroke="currentColor" class="text-emerald-500" stroke-width="0.5" stroke-linejoin="round" />
                    <!-- Dots -->
                    <circle v-for="(p, i) in chartPoints" :key="i" :cx="p.x" :cy="p.y" r="0.8" fill="white" stroke="currentColor" class="text-emerald-500" stroke-width="0.2">
                      <title>{{ apiTrafficData[i].time }}: {{ apiTrafficData[i].reqs }} reqs</title>
                    </circle>
                    <defs>
                      <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stop-color="currentColor" class="text-emerald-500" />
                        <stop offset="100%" stop-color="white" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <!-- Tooltip (Simulated) -->
                  <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 backdrop-blur-[1px] rounded-xl pointer-events-none">
                    <span class="bg-slate-900 text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-xl uppercase tracking-widest">
                      Live Throughput: {{ apiTrafficData[apiTrafficData.length-1].reqs }} reqs/sec
                    </span>
                  </div>
                </div>
                <div class="flex justify-between mt-4">
                  <span v-for="d in apiTrafficData" :key="d.time" class="text-[8px] font-bold text-slate-400 uppercase">{{ d.time }}</span>
                </div>
              </div>

              <div class="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                <h3 class="text-lg font-black text-slate-900 uppercase tracking-tighter mb-6 italic">{{ $t('dashboard.affiliate.marketing_hub') }}</h3>
                <AffiliateDashboard is-compact />
              </div>
              <MissionHistory />
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="authStore.role === 'client'">
        <!-- Client Unified View -->
        <div class="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <!-- Booking Banner -->
          <div class="p-8 bg-gradient-to-r from-emerald-600 to-emerald-800 rounded-[2.5rem] text-white shadow-xl relative overflow-hidden group cursor-pointer" @click="handleCallDrone">
            <div class="relative z-10">
              <span class="inline-block px-3 py-1 bg-white/20 text-white text-[10px] font-black uppercase rounded-full mb-4">{{ $t('dashboard.ready_takeoff') }}</span>
              <h2 class="text-3xl font-black mb-2 uppercase tracking-tight italic">{{ $t('kaset.farmer.banner_title') }}</h2>
              <p class="text-emerald-100/80 text-sm mb-6 max-w-md">{{ $t('kaset.farmer.banner_subtitle') }}</p>
              <button class="bg-white text-emerald-700 px-8 py-3 rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-emerald-50 transition-all shadow-lg">
                {{ $t('kaset.farmer.banner_cta') }}
              </button>
            </div>
            <Plane class="absolute right-[-20px] top-1/2 -translate-y-1/2 w-64 h-64 text-white/10 rotate-12 group-hover:scale-110 transition-transform duration-700" />
          </div>

          <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <!-- Left: Map & Status -->
            <div class="lg:col-span-8 space-y-8">
              <div class="bg-white rounded-[2.5rem] border border-slate-200 shadow-sm overflow-hidden">
                <div class="p-8 border-b border-slate-100">
                  <h3 class="text-lg font-black text-slate-900 uppercase tracking-tighter italic">{{ $t('dashboard.mission_progress') }}</h3>
                </div>
                <DroneMap :dronePosition="dronePosition" :path="flightPath" />
                <div class="p-8 bg-slate-50 border-t border-slate-100">
                  <TelemetryWidget :telemetry="telemetry" />
                </div>
              </div>

              <!-- Service Grid -->
              <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
                <button v-for="item in farmerMenuItems.slice(0, 4)" :key="item.key"
                        @click="handleFarmerMenuClick(item)"
                        class="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center gap-4 hover:border-emerald-500 transition-all active:scale-95">
                  <div :class="`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center`">
                    <component :is="item.icon" :class="`w-6 h-6 ${item.iconColor}`" />
                  </div>
                  <span class="text-xs font-bold text-slate-700 uppercase tracking-tighter text-center">{{ $t(`kaset.farmer.menu.${item.key}`) }}</span>
                </button>
              </div>
            </div>

            <!-- Right: Affiliate & History -->
            <div class="lg:col-span-4 space-y-8">
              <div class="bg-white rounded-[2.5rem] border border-slate-200 p-8 shadow-sm">
                <h3 class="text-lg font-black text-slate-900 uppercase tracking-tighter mb-6 italic">{{ $t('dashboard.earn') }}</h3>
                <AffiliateDashboard is-compact />
              </div>
              <div class="bg-slate-900 rounded-[2.5rem] p-8 text-white shadow-xl">
                <h3 class="text-lg font-black uppercase tracking-tighter mb-6 italic">{{ $t('dashboard.history') }}</h3>
                <div class="space-y-4">
                  <div v-for="job in jobs" :key="job.id" class="p-4 bg-white/5 rounded-2xl border border-white/10">
                    <div class="flex justify-between items-start mb-2">
                      <span :class="`text-[8px] font-black uppercase px-2 py-0.5 rounded-full ${job.statusBg}`">{{ job.status }}</span>
                      <span class="text-[10px] text-slate-400">{{ job.time }}</span>
                    </div>
                    <p class="text-sm font-bold text-white">{{ job.area }}</p>
                    <p class="text-[10px] text-slate-500 font-mono">{{ job.price }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <PrivacyBanner />
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { isRTL } from '../i18n';
import {
  LogOut, Plane, Activity, CloudRain, ShieldCheck, LayoutDashboard, Users, Zap, Signal, Map as MapIcon,
  Video, RefreshCw, Globe, Server, Database, ArrowUpRight, AlertCircle, CheckCircle, Fan, Radio,
  FileText, Search, Filter, CheckCircle2, AlertTriangle, XCircle,
  UserCheck, Clock, BarChart3, Settings, Package, Bell, Cpu, Maximize2,
  ChevronLeft, Gamepad2, Wallet, MapPin, History, Calculator, DollarSign, Calendar, PhoneCall, User, ChevronRight
} from 'lucide-vue-next';
import { useAuthStore } from '../stores';
import AffiliateDashboard from '../components/AffiliateDashboard.vue';
import PrivacyBanner from '../components/PrivacyBanner.vue';
import DroneMap from '../components/dashboard/DroneMap.vue';
import TelemetryWidget from '../components/dashboard/TelemetryWidget.vue';
import MissionControl from '../components/dashboard/MissionControl.vue';
import MediaCenter from '../components/dashboard/MediaCenter.vue';
import MissionHistory from '../components/dashboard/MissionHistory.vue';
import AIActiveSupervisor from '../components/dashboard/AIActiveSupervisor.vue';
import { DroneApiService } from '../services/droneApi';
import { telemetry as telemetryService } from '../services/telemetry';

const route = useRoute();
const activeTab = ref(route.query.tab || 'overview');
const dashboardView = ref('grid'); // 'grid' or 'focus'
const isAdmin = ref(false); // Simulated Role-based Access
const isLoading = ref(false);
const dashboardData = ref(null);
const { locale, t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();

// --- Platform Monitoring ---
const trackPlatformUsage = (action, props = {}) => {
  telemetryService.trackEvent(`dashboard_${action}`, {
    role: authStore.role,
    locale: locale.value,
    ...props
  });
};

// --- Provider Dashboard Logic ---
const searchTerm = ref('');
const statusFilter = ref('');

// Admin Data
const summaryStats = [
  { key: 'total_hubs', value: '42', trend: '+2' },
  { key: 'pilots_online', value: '18', trend: '+5' },
  { key: 'pending_jobs', value: '12', trend: '-3' },
  { key: 'active_jobs', value: '06', trend: '+1' },
  { key: 'completed_today', value: '84', trend: '+12' },
  { key: 'statistics', value: '94%', trend: '+2.1%' }
];

const adminMenu = [
  { key: 'hubs', icon: ShieldCheck },
  { key: 'pilots', icon: Users },
  { key: 'prices', icon: Package },
  { key: 'income', icon: BarChart3 },
  { key: 'training', icon: MapIcon },
  { key: 'settings', icon: Settings }
];

const jobs = [
  { id: 1, customer: 'Khun Somchai (Ratchaburi)', area: '12.5 Rai', price: '฿2,500', time: '2 mins ago', status: 'Pending', statusBg: 'bg-amber-500', statusColor: 'bg-amber-500', pilot: '-' },
  { id: 2, customer: 'Khun Somsri (Nakhon Nayok)', area: '45.0 Rai', price: '฿9,000', time: '15 mins ago', status: 'Active', statusBg: 'bg-blue-500', statusColor: 'bg-blue-500', pilot: 'Alpha-01' },
  { id: 3, customer: 'Farmer Group (Tak)', area: '120.0 Rai', price: '฿24,000', time: '1 hr ago', status: 'Completed', statusBg: 'bg-emerald-500', statusColor: 'bg-emerald-500', pilot: 'Gamma-04' }
];

const adminMarkers = [
  { label: 'FarmHub Ratchaburi', pos: [13.5283, 99.8134], info: 'Jobs: 12', type: 'pilot' },
  { label: 'FarmHub Suphan', pos: [14.4745, 100.1222], info: 'Jobs: 8', type: 'pilot' },
  { label: 'Farmer: Khun Somchai', pos: [13.5000, 99.8000], type: 'farmer' },
  { label: 'Farmer: Khun Somsri', pos: [14.4500, 100.1000], type: 'farmer' }
];

  // Advanced Provider Data
  const agentPulse = computed(() => [
    { label: 'Neural Load', value: '12.4%' },
    { label: 'NDVI Index', value: cropHealth.value ? cropHealth.value.ndvi_score : '0.72' },
    { label: 'Decision Confidence', value: '0.998' }
  ]);

  const agentLogs = [
    { id: 1, action: 'Fleet Optimization', details: 'Re-routing Alpha-01 to bypass localized turbulence in Suphan Buri.', time: 'Just now', status: 'success', icon: Zap },
    { id: 2, action: 'Resource Allocation', details: 'Allocated 5 additional battery packs to Ratchaburi Hub for peak demand.', time: '5m ago', status: 'success', icon: Database },
    { id: 3, action: 'Anomaly Detected', details: 'Minor telemetry drift on Beta-09. Automatic recalibration initiated.', time: '12m ago', status: 'warning', icon: AlertCircle }
  ];

  const platformStats = computed(() => [
    { id: 1, label: t('provider.stats.global_fleet'), value: '124', trend: 12, icon: Plane, iconBg: 'bg-blue-500/20', iconColor: 'text-blue-400' },
    { id: 2, label: t('provider.stats.active_sessions'), value: '42', trend: 8, icon: Activity, iconBg: 'bg-emerald-500/20', iconColor: 'text-emerald-400' },
    { id: 3, label: t('provider.stats.api_uptime'), value: '99.9%', trend: 0.1, icon: Globe, iconBg: 'bg-indigo-500/20', iconColor: 'text-indigo-400' },
    { id: 4, label: t('provider.stats.system_load'), value: '14.2%', trend: -2, icon: Cpu, iconBg: 'bg-amber-500/20', iconColor: 'text-amber-400' }
  ]);

  const tenants = [
    { id: 'HUB-001', name: 'Ratchaburi Central', location: 'Western Thailand', status: 'online', pilots: 12, health: 98, throughput: 145000 },
    { id: 'HUB-002', name: 'Suphan Buri North', location: 'Central Thailand', status: 'online', pilots: 8, health: 94, throughput: 89000 },
    { id: 'HUB-003', name: 'Nakhon Nayok East', location: 'Eastern Thailand', status: 'warning', pilots: 15, health: 82, throughput: 112000 },
    { id: 'HUB-004', name: 'Chiang Mai Valley', location: 'Northern Thailand', status: 'online', pilots: 6, health: 96, throughput: 67000 }
  ];

  const telemetryMetrics = [
    { label: 'Latency', value: 24, unit: 'ms', status: 'optimal' },
    { label: 'Packet Loss', value: 0.02, unit: '%', status: 'optimal' },
    { label: 'Jitter', value: 1.2, unit: 'ms', status: 'optimal' }
  ];

  const apiEndpoints = [
    { path: '/v1/fleet/status', method: 'GET', status: 200, latency: 12 },
    { path: '/v1/telemetry/push', method: 'POST', status: 201, latency: 45 },
    { path: '/v1/auth/verify', method: 'GET', status: 200, latency: 8 }
  ];

  const fleetEvents = [
    { id: 1, type: 'takeoff', drone: 'Alpha-01', location: 'Ratchaburi', time: '2m ago' },
    { id: 2, type: 'landing', drone: 'Gamma-04', location: 'Suphan Buri', time: '8m ago' },
    { id: 3, type: 'alert', drone: 'Beta-09', location: 'Nakhon Nayok', time: '15m ago', message: 'Low Battery (15%)' }
  ];

  const globalHealthScore = ref(98.4);
const cropHealth = ref(null);

const globalDrones = ref([
  { id: 'T40-AG-001', tenantName: 'AgriHub Thailand', model: 'Agras T40', status: 'flying', location: 'Suphan Buri, TH', lastPing: '2s ago' },
  { id: 'T40-AG-002', tenantName: 'AgriHub Thailand', model: 'Agras T40', status: 'charging', location: 'Suphan Buri, TH', lastPing: '1m ago' },
  { id: 'T20-MK-88', tenantName: 'Mekong Rice AI', model: 'Agras T20P', status: 'flying', location: 'Can Tho, VN', lastPing: '500ms ago' },
  { id: 'M3M-ID-05', tenantName: 'IndoPalm Solutions', model: 'Mavic 3M', status: 'idle', location: 'Sumatra, ID', lastPing: '5m ago' },
  { id: 'T50-SD-X1', tenantName: 'Siam Durian Tech', model: 'Agras T50', status: 'maintenance', location: 'Chanthaburi, TH', lastPing: '1h ago' },
]);

const systemLogs = ref([
  { id: 'log-1024', timestamp: '10:42:05', tenant: 'AgriHub Thailand', action: 'POST /api/telemetry/stream', status: 'success', latency: '45ms' },
  { id: 'log-1023', timestamp: '10:41:58', tenant: 'Mekong Rice AI', action: 'GET /api/weather/forecast', status: 'success', latency: '120ms' },
  { id: 'log-1022', timestamp: '10:41:15', tenant: 'IndoPalm Solutions', action: 'AUTH /login/device', status: 'warning', latency: '850ms' },
  { id: 'log-1021', timestamp: '10:40:00', tenant: 'System', action: 'CRON /maintenance/cleanup', status: 'success', latency: '200ms' },
  { id: 'log-1020', timestamp: '10:38:45', tenant: 'Siam Durian Tech', action: 'POST /api/mission/upload', status: 'error', latency: 'TIMEOUT' },
  { id: 'log-1019', timestamp: '10:38:10', tenant: 'AgriHub Thailand', action: 'GET /api/drones/status', status: 'success', latency: '55ms' },
  { id: 'log-1018', timestamp: '10:37:55', tenant: 'Mekong Rice AI', action: 'POST /api/auth/refresh', status: 'error', latency: '401 Unauthorized' },
]);

const apiTrafficData = ref([
  { time: '10:00', reqs: 1200 },
  { time: '10:10', reqs: 1800 },
  { time: '10:20', reqs: 2200 },
  { time: '10:30', reqs: 2100 },
  { time: '10:40', reqs: 2800 },
  { time: '10:50', reqs: 2400 },
]);

// --- Chart Computeds ---
const chartPoints = computed(() => {
  const maxReqs = Math.max(...apiTrafficData.value.map(d => d.reqs));
  return apiTrafficData.value.map((d, i) => ({
    x: (i / (apiTrafficData.value.length - 1)) * 100,
    y: 40 - (d.reqs / maxReqs) * 30 - 5 // Scaled to fit 40 height with margin
  }));
});

const chartLinePath = computed(() => {
  return chartPoints.value.reduce((path, p, i) => {
    return path + (i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`);
  }, '');
});

const chartAreaPath = computed(() => {
  if (chartPoints.value.length === 0) return '';
  const first = chartPoints.value[0];
  const last = chartPoints.value[chartPoints.value.length - 1];
  return `${chartLinePath.value} L ${last.x} 40 L ${first.x} 40 Z`;
});

const filteredLogs = computed(() => {
  return systemLogs.value.filter(log => {
    const matchesSearch =
      log.tenant.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.value.toLowerCase()) ||
      log.id.toLowerCase().includes(searchTerm.value.toLowerCase());

    const matchesStatus = statusFilter.value === 'all' || log.status === statusFilter.value;

    return matchesSearch && matchesStatus;
  });
});

const factors = computed(() => {
  const logs = filteredLogs.value;
  return {
    total: logs.length,
    success: logs.filter(l => l.status === 'success').length,
    warning: logs.filter(l => l.status === 'warning').length,
    error: logs.filter(l => l.status === 'error').length,
  };
});

const getDroneBadgeStyle = (status) => {
  const styles = {
    flying: 'bg-sky-100 text-sky-700 border-sky-200 animate-pulse',
    charging: 'bg-sky-100 text-sky-700 border-sky-200',
    maintenance: 'bg-red-100 text-red-700 border-red-200',
    idle: 'bg-slate-100 text-slate-700 border-slate-200',
  };
  return styles[status] || 'bg-slate-100 text-slate-700';
};

const fetchDashboardData = async () => {
  isLoading.value = true;
  const data = await DroneApiService.getDashboardSummary();
  if (data) {
    dashboardData.value = data;
    // Update telemetry from real data if available
    if (data.weather) {
      telemetry.value.temp = data.weather.temp;
      telemetry.value.condition = data.weather.condition;
    }
  }

  // Fetch GISTDA Crop Health Data
  const healthData = await DroneApiService.getCropHealth();
  if (healthData) {
    cropHealth.value = healthData;
  }

  isLoading.value = false;
};

onMounted(() => {
  telemetry.trackPageView('Dashboard');
  trackPlatformUsage('view');
  fetchDashboardData();

  // Connect Socket.io for Real-time Drone Updates
  DroneApiService.socket.on('drone-status-update', (drones) => {
    if (drones && drones.length > 0) {
      const mainDrone = drones[0];
      // Update Telemetry
      telemetry.value = {
        altitude: mainDrone.status === 'flying' ? 3.5 : 0,
        speed: mainDrone.status === 'flying' ? 12.5 : 0,
        battery: Math.round(mainDrone.battery),
        gps: `${mainDrone.location.lat.toFixed(4)}, ${mainDrone.location.lng.toFixed(4)}`
      };

      // Update Drone Position for Map
      dronePosition.value = {
        lat: mainDrone.location.lat,
        lng: mainDrone.location.lng
      };

      // Add to Flight Path if flying
      if (mainDrone.status === 'flying') {
        flightPath.value.push([mainDrone.location.lat, mainDrone.location.lng]);
        // Keep only last 20 points
        if (flightPath.value.length > 20) {
          flightPath.value.shift();
        }
      }

      // Update Global Drones List
      globalDrones.value = drones.map(d => ({
        id: d.id,
        tenantName: 'SmartFarming Hub',
        model: d.model,
        status: d.status,
        location: `${d.location.lat.toFixed(2)}, ${d.location.lng.toFixed(2)}`,
        lastPing: 'Just now'
      }));
    }
  });
});

onUnmounted(() => {
  DroneApiService.socket.off('drone-status-update');
});

const changeLocale = (lang) => {
  locale.value = lang;
  localStorage.setItem('user_locale', lang);
  trackPlatformUsage('change_locale', { new_lang: lang });
};

const handleLogout = () => {
  trackPlatformUsage('logout');
  authStore.logout();
  router.push('/auth');
};

const toggleRole = () => {
  isAdmin.value = !isAdmin.value;
};

const telemetry = ref({
  altitude: 45.5,
  speed: 12.8,
  battery: 84,
  gps: '14.21, 101.12'
});

const flightPath = ref([
  [14.21, 101.12],
  [14.215, 101.125],
  [14.22, 101.13]
]);

const quickStats = [
  { key: 'area', label: 'Rai Covered', value: '12,480', trend: '+12%', icon: Activity },
  { key: 'hours', label: 'Flight Hours', value: '450h', trend: '+5.4%', icon: Plane },
  { key: 'savings', label: 'Chemical Saved', value: '15.2%', trend: '+2.1%', icon: CloudRain },
  { key: 'pilots', label: 'Active Pilots', value: '32', trend: 'Stable', icon: Users }
];

const fleet = [
  { id: 1, name: 'Nakhon Nayok Hub A (T50)', status: 'Active - Rice Spraying', battery: 84 },
  { id: 2, name: 'Nakhon Nayok Hub B (T40)', status: 'In Transit', battery: 62 },
  { id: 3, name: 'Saraburi Border Hub (P100)', status: 'Standby', battery: 100 }
];

const missions = [
  { id: 1, name: 'Rice Paddy Spraying - Nakhon Nayok City', date: 'Ongoing', active: true, progress: 68 },
  { id: 2, name: 'Fruit Orchard Analysis - Ban Na District', date: '2 hours ago', active: false, progress: 100 },
  { id: 3, name: 'Pest Control Mission - Ongkharak', date: 'Yesterday', active: false, progress: 100 }
];

// --- Pilot Dashboard Logic ---
const isPilotReady = ref(true);
const pilotMenuItems = [
  { key: 'pending', icon: Clock, bgColor: 'bg-amber-500/10', iconColor: 'text-amber-500' },
  { key: 'active', icon: Activity, bgColor: 'bg-emerald-500/10', iconColor: 'text-emerald-500' },
  { key: 'income', icon: Wallet, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-500' },
  { key: 'drone_info', icon: Gamepad2, bgColor: 'bg-red-500/10', iconColor: 'text-red-500' },
  { key: 'location', icon: MapPin, bgColor: 'bg-purple-500/10', iconColor: 'text-purple-500' },
  { key: 'history', icon: History, bgColor: 'bg-slate-500/10', iconColor: 'text-slate-400' },
  { key: 'certs', icon: FileText, bgColor: 'bg-indigo-500/10', iconColor: 'text-indigo-400' }
];

const handlePilotMenuClick = (item) => {
  console.log('Pilot menu click:', item.key);
};

// --- Farmer Dashboard Logic ---
const farmerMenuItems = [
  { key: 'call_drone', icon: Plane, bgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
  { key: 'calc_area', icon: Calculator, bgColor: 'bg-emerald-100', iconColor: 'text-emerald-600' },
  { key: 'price_check', icon: DollarSign, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
  { key: 'booking', icon: Calendar, bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
  { key: 'history', icon: History, bgColor: 'bg-amber-100', iconColor: 'text-amber-600' },
  { key: 'map_near', icon: MapIcon, bgColor: 'bg-rose-100', iconColor: 'text-rose-600' },
  { key: 'contact', icon: PhoneCall, bgColor: 'bg-slate-100', iconColor: 'text-slate-600' }
];

const handleCallDrone = () => {
  alert('Request Sent! TASK-' + Math.floor(Math.random() * 10000));
};

const handleFarmerMenuClick = (item) => {
  if (item.key === 'call_drone') {
    handleCallDrone();
  } else {
    console.log('Farmer menu click:', item.key);
  }
};
</script>

<style scoped>
@keyframes progress {
  from { transform: translateX(-100%); }
  to { transform: translateX(0); }
}
.animate-progress {
  animation: progress 2s ease-out forwards;
}

/* Transitions */
.fade-in { animation: fadeIn 0.5s ease-out forwards; }
@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }

.slide-in-bottom { animation: slideInBottom 0.5s ease-out forwards; }
@keyframes slideInBottom { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
</style>
