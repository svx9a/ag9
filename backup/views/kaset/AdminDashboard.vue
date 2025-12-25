<template>
  <div class="min-h-screen bg-slate-100 font-sans flex flex-col">
    <!-- Top Stats Row -->
    <div class="grid grid-cols-2 md:grid-cols-6 gap-4 p-4 bg-white border-b border-slate-200">
      <div v-for="stat in summaryStats" :key="stat.key" class="p-4 bg-slate-50 rounded-2xl border border-slate-100">
        <p class="text-[10px] text-slate-500 uppercase font-black tracking-tighter">{{ $t(`admin.stats.${stat.key}`) }}</p>
        <div class="flex items-end justify-between mt-1">
          <p class="text-2xl font-black text-slate-900 leading-none">{{ stat.value }}</p>
          <span v-if="stat.trend" :class="`text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`">
            {{ stat.trend }}
          </span>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex overflow-hidden">
      <!-- Left Sidebar (Admin Menu) -->
      <div class="w-20 md:w-64 bg-slate-900 flex flex-col text-slate-400">
        <div class="p-6 text-white font-black text-xl hidden md:block">{{ $t('admin.panel') }}</div>
        <nav class="flex-1 p-2 space-y-1">
          <button v-for="item in adminMenu" :key="item.key"
                  class="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/10 hover:text-white transition-all group">
            <component :is="item.icon" class="w-6 h-6 group-hover:text-orange-500" />
            <span class="text-sm font-bold hidden md:block">{{ $t(`admin.menu.${item.key}`) }}</span>
          </button>
        </nav>
      </div>

      <!-- Center: Map -->
      <div class="flex-1 relative bg-slate-200">
        <div id="map" class="w-full h-full z-0"></div>

        <!-- Floating Map Controls -->
        <div class="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
          <div class="bg-white p-2 rounded-xl shadow-lg border border-slate-200">
            <div class="flex items-center gap-2 mb-2">
              <div class="w-3 h-3 bg-red-600 rounded-full"></div>
              <span class="text-[10px] font-bold uppercase">{{ $t('admin.stats.pilots_online') }}</span>
            </div>
            <div class="flex items-center gap-2">
              <div class="w-3 h-3 bg-emerald-600 rounded-full"></div>
              <span class="text-[10px] font-bold uppercase">{{ $t('admin.farmers') }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Panel: Job Timeline -->
      <div class="w-80 bg-white border-l border-slate-200 flex flex-col hidden lg:flex">
        <div class="p-6 border-b border-slate-100">
          <h3 class="font-black text-slate-900 uppercase tracking-tight">{{ $t('admin.timeline') }}</h3>
        </div>
        <div class="flex-1 overflow-y-auto p-4 space-y-4">
          <div v-for="job in jobs" :key="job.id" class="p-4 bg-slate-50 rounded-2xl border border-slate-100 relative overflow-hidden">
            <div :class="`absolute top-0 left-0 w-1 h-full ${job.statusColor}`"></div>
            <div class="flex justify-between items-start mb-2">
              <span :class="`text-[8px] font-black uppercase px-2 py-0.5 rounded-full text-white ${job.statusBg}`">
                {{ job.status }}
              </span>
              <span class="text-[10px] text-slate-400">{{ job.time }}</span>
            </div>
            <p class="text-sm font-bold text-slate-900">{{ job.customer }}</p>
            <p class="text-[10px] text-slate-500 font-mono">{{ job.area }} • {{ job.price }}</p>
            <div class="mt-3 flex items-center gap-2">
              <div class="w-6 h-6 bg-slate-200 rounded-full"></div>
              <span class="text-[10px] font-medium text-slate-600">{{ $t('admin.pilot') }}: {{ job.pilot }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Users, UserCheck, Clock, Activity,
  CheckCircle, BarChart3, Settings,
  ShieldCheck, Package, Map as MapIcon,
  Search, Bell
} from 'lucide-vue-next';

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

onMounted(() => {
  const map = L.map('map').setView([13.7367, 100.5231], 6); // Centered on Thailand

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap contributors'
  }).addTo(map);

  // Mock markers
  const pilots = [
    { name: 'FarmHub Ratchaburi', pos: [13.5283, 99.8134], jobs: 12 },
    { name: 'FarmHub Suphan', pos: [14.4745, 100.1222], jobs: 8 }
  ];

  const farmers = [
    { name: 'Khun Somchai', pos: [13.5000, 99.8000] },
    { name: 'Khun Somsri', pos: [14.4500, 100.1000] }
  ];

  pilots.forEach(p => {
    L.circleMarker(p.pos, {
      radius: 8,
      fillColor: "#dc2626", // red-600
      color: "#fff",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.8
    }).addTo(map).bindPopup(`<b>${p.name}</b><br>Jobs: ${p.jobs}<br><button class="text-[10px] text-blue-600 underline">Contact</button>`);
  });

  farmers.forEach(f => {
    L.circleMarker(f.pos, {
      radius: 6,
      fillColor: "#059669", // emerald-600
      color: "#fff",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.6
    }).addTo(map).bindPopup(`<b>Farmer: ${f.name}</b>`);
  });
});
</script>

<style scoped>
.font-sans {
  font-family: 'Kanit', sans-serif;
}
#map {
  background: #f1f5f9;
}
</style>
