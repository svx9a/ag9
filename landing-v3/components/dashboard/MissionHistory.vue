<template>
  <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-bold text-slate-900">Mission Logs</h3>
      <div class="flex gap-2">
        <button @click="exportData('csv')" class="p-2 bg-slate-50 text-slate-400 hover:text-emerald-600 rounded-lg transition-all">
          <Table class="w-4 h-4" />
        </button>
        <button @click="exportData('json')" class="p-2 bg-slate-50 text-slate-400 hover:text-emerald-600 rounded-lg transition-all">
          <Terminal class="w-4 h-4" />
        </button>
      </div>
    </div>

    <div class="space-y-4">
      <div v-for="log in logs" :key="log.id" class="p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-emerald-500/20 transition-all">
        <div class="flex justify-between items-start mb-2">
          <div class="flex items-center gap-3">
            <div :class="log.type === 'alert' ? 'bg-red-50 text-red-500' : 'bg-blue-50 text-blue-500'" class="p-2 rounded-lg">
              <AlertCircle v-if="log.type === 'alert'" class="w-4 h-4" />
              <Info v-else class="w-4 h-4" />
            </div>
            <div>
              <div class="text-xs font-bold text-slate-900">{{ log.title }}</div>
              <div class="text-[10px] text-slate-500 font-medium">{{ log.time }}</div>
            </div>
          </div>
          <div v-if="log.coords" class="flex items-center gap-1 text-[10px] font-bold text-slate-400">
            <MapPin class="w-3 h-3" /> {{ log.coords }}
          </div>
        </div>
        <p class="text-[10px] text-slate-600 leading-relaxed">{{ log.description }}</p>
      </div>
    </div>

    <!-- Webhook Integration -->
    <div class="mt-8 pt-6 border-t border-slate-100">
      <div class="flex items-center justify-between mb-4">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Webhooks</span>
        <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
      </div>
      <div class="flex gap-2">
        <input type="text" placeholder="https://api.your-system.com/webhook"
               class="flex-1 px-3 py-2 bg-slate-50 rounded-lg text-[10px] border border-slate-200 focus:ring-1 focus:ring-emerald-500 outline-none" />
        <button class="px-3 py-2 bg-emerald-600 text-white text-[10px] font-bold rounded-lg hover:bg-emerald-700 transition-all">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Table, Terminal, AlertCircle, Info, MapPin } from 'lucide-vue-next';

const logs = ref([
  { id: 1, title: 'Geofence Breach Warning', time: '14:42:10', type: 'alert', coords: '14.225, 101.135', description: 'Drone approached eastern geofence boundary at Sector Gamma. Auto-correction applied.' },
  { id: 2, title: 'Waypoint Reached', time: '14:40:05', type: 'info', coords: '14.215, 101.125', description: 'Sector Alpha spraying mission started. Flow rate: 2.4L/min.' },
  { id: 3, title: 'System Health Check', time: '14:35:00', type: 'info', description: 'Pre-flight diagnostics completed. All systems nominal. Battery temp: 38°C.' }
]);

const exportData = (format) => {
  // Export logic here
  alert(`Mission data exported successfully in ${format.toUpperCase()} format!`);
};
</script>
