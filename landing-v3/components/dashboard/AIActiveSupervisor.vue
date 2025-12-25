<template>
  <div class="bg-[#0d1117] border border-slate-800/50 rounded-[2.5rem] p-8 relative overflow-hidden h-full flex flex-col">
    <!-- Background Glow -->
    <div class="absolute right-0 top-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-3xl"></div>
    <div class="absolute left-0 bottom-0 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl"></div>

    <!-- Header -->
    <div class="flex items-center justify-between mb-8 relative z-10">
      <div class="flex items-center gap-4">
        <div class="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20">
          <Bot class="w-6 h-6 text-emerald-400" />
        </div>
        <div>
          <h2 class="text-xl font-black text-white uppercase tracking-tighter italic">AI Dashboard Manager</h2>
          <p class="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">Active Supervisor Core</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 rounded-full">
          <Cloud class="w-3 h-3 text-blue-400" />
          <span class="text-[9px] font-black text-blue-400 uppercase tracking-widest">Cloudflare Backend</span>
        </div>
      </div>
    </div>

    <!-- Supervisor Capabilities -->
    <div class="grid grid-cols-1 gap-4 relative z-10 flex-1">
      <div v-for="capability in capabilities" :key="capability.id"
           class="group p-4 bg-slate-900/40 border border-slate-800/50 rounded-2xl hover:border-emerald-500/30 transition-all cursor-pointer">
        <div class="flex items-start gap-4">
          <div :class="capability.bgColor" class="w-10 h-10 rounded-xl flex items-center justify-center shrink-0">
            <component :is="capability.icon" :class="capability.iconColor" class="w-5 h-5" />
          </div>
          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between mb-1">
              <h4 class="text-xs font-black text-white uppercase tracking-tight">{{ capability.title }}</h4>
              <span v-if="capability.active" class="flex h-2 w-2 relative">
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span class="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>
            <p class="text-[10px] text-slate-500 leading-relaxed">{{ capability.desc }}</p>

            <!-- Real-time Data Point -->
            <div v-if="capability.data" class="mt-3 pt-3 border-t border-slate-800/50 flex items-center justify-between">
              <span class="text-[9px] font-bold text-slate-600 uppercase tracking-widest">{{ capability.dataLabel }}</span>
              <span class="text-[10px] font-black text-emerald-400 font-mono">{{ capability.data }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer Action -->
    <button class="mt-8 w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2">
      <Zap class="w-4 h-4" />
      Initialize Autonomous Protocol
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import axios from 'axios';
import {
  Bot, BarChart3, Settings, Bell, TrendingUp, Target,
  Cloud, Zap, Cpu, MousePointer2, Activity, ShieldAlert
} from 'lucide-vue-next';

const capabilities = ref([
  {
    id: 'analyze',
    title: 'Auto-analyzes Metrics',
    desc: 'Continuous scanning of fleet telemetry and environmental data points.',
    icon: BarChart3,
    bgColor: 'bg-emerald-500/10',
    iconColor: 'text-emerald-400',
    active: true,
    dataLabel: 'Points Analyzed/sec',
    data: '1,240 p/s'
  },
  {
    id: 'optimize',
    title: 'Suggests Optimizations',
    desc: 'AI-driven flight path and battery discharge curve improvements.',
    icon: Settings,
    bgColor: 'bg-blue-500/10',
    iconColor: 'text-blue-400',
    active: false,
    dataLabel: 'Efficiency Gain',
    data: '+14.2%'
  },
  {
    id: 'alerts',
    title: 'Proactive Alerts',
    desc: 'Early warning system for component fatigue and weather anomalies.',
    icon: Bell,
    bgColor: 'bg-amber-500/10',
    iconColor: 'text-amber-400',
    active: true,
    dataLabel: 'Alerts Pre-empted',
    data: '3 Today'
  },
  {
    id: 'insights',
    title: 'Generates Insights',
    desc: 'Deep learning models converting raw data into actionable yield forecasts.',
    icon: TrendingUp,
    bgColor: 'bg-purple-500/10',
    iconColor: 'text-purple-400',
    active: false,
    dataLabel: 'Confidence Score',
    data: '98.4%'
  },
  {
    id: 'actions',
    title: 'Autonomous Actions',
    desc: 'Real-time decision making for emergency landings and mission rerouting.',
    icon: Target,
    bgColor: 'bg-red-500/10',
    iconColor: 'text-red-400',
    active: true,
    dataLabel: 'Decisions Executed',
    data: '42 Active'
  },
  {
    id: 'security',
    title: 'Security Task Core',
    desc: 'Mistral-powered anomaly detection and threat mitigation.',
    icon: ShieldAlert,
    bgColor: 'bg-indigo-500/10',
    iconColor: 'text-indigo-400',
    active: true,
    dataLabel: 'Threat Level',
    data: 'Nominal'
  }
]);

const apiLogs = ref([
  { time: '14:20:05', method: 'GET', status: '200', endpoint: '/api/v1/telemetry' },
  { time: '14:20:02', method: 'POST', status: '200', endpoint: '/api/v1/auth' },
  { time: '14:19:58', method: 'GET', status: '404', endpoint: '/api/v1/unknown', threat: true },
  { time: '14:19:55', method: 'PATCH', status: '200', endpoint: '/api/v1/config' },
]);

let intervalId = null;
let logIntervalId = null;

const fetchAnalysis = async () => {
  try {
    const response = await axios.get('/api/ai/supervisor/analysis');
    const data = response.data;

    // Update capabilities with real data
    const analyze = capabilities.value.find(c => c.id === 'analyze');
    if (analyze) analyze.data = data.metrics.points_analyzed_sec.toLocaleString() + ' p/s';

    const optimize = capabilities.value.find(c => c.id === 'optimize');
    if (optimize) optimize.data = '+' + data.optimizations[0].gain;

    const alerts = capabilities.value.find(c => c.id === 'alerts');
    if (alerts) alerts.data = data.alerts.length + ' Active';

    const insights = capabilities.value.find(c => c.id === 'insights');
    if (insights) insights.data = (data.insights[0].confidence * 100).toFixed(1) + '%';

    const actions = capabilities.value.find(c => c.id === 'actions');
    if (actions) actions.data = data.autonomous_actions.length + ' Executed';

    const security = capabilities.value.find(c => c.id === 'security');
    if (security) security.data = data.security_status || 'Nominal';

  } catch (error) {
    // Fallback for local dev if API not ready
    console.warn('AI supervisor API not responding, using simulated data');
  }
};

const addRandomLog = () => {
  const methods = ['GET', 'POST', 'PATCH', 'DELETE'];
  const endpoints = ['/api/v1/telemetry', '/api/v1/auth', '/api/v1/mission', '/api/v1/config', '/api/v1/health'];
  const statuses = ['200', '200', '200', '404', '500'];
  const now = new Date();
  const time = now.getHours().toString().padStart(2, '0') + ':' +
               now.getMinutes().toString().padStart(2, '0') + ':' +
               now.getSeconds().toString().padStart(2, '0');

  const method = methods[Math.floor(Math.random() * methods.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];
  const endpoint = endpoints[Math.floor(Math.random() * endpoints.length)];

  apiLogs.value.unshift({
    time,
    method,
    status,
    endpoint,
    threat: status === '404' || status === '500' ? Math.random() > 0.7 : false
  });

  if (apiLogs.value.length > 20) apiLogs.value.pop();
};

onMounted(() => {
  fetchAnalysis();
  intervalId = setInterval(fetchAnalysis, 5000);
  logIntervalId = setInterval(addRandomLog, 2000);
});

onUnmounted(() => {
  if (intervalId) clearInterval(intervalId);
  if (logIntervalId) clearInterval(logIntervalId);
});
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
}
</style>
