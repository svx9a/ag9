<template>
  <div class="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm h-full">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-lg font-bold text-slate-900">Mission Control</h3>
      <div class="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase rounded-full">
        Auto-Mode Active
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="grid grid-cols-3 gap-3 mb-8">
      <button @click="handleAction('pause')"
              class="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl hover:bg-amber-50 hover:text-amber-600 transition-all border border-transparent hover:border-amber-200">
        <Pause class="w-6 h-6 mb-2" />
        <span class="text-[10px] font-bold uppercase">Pause</span>
      </button>
      <button @click="confirmRTH"
              class="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 hover:text-blue-600 transition-all border border-transparent hover:border-blue-200">
        <Home class="w-6 h-6 mb-2" />
        <span class="text-[10px] font-bold uppercase">RTH</span>
      </button>
      <button @click="handleAction('land')"
              class="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-200 text-red-500">
        <ArrowDownCircle class="w-6 h-6 mb-2" />
        <span class="text-[10px] font-bold uppercase">Land</span>
      </button>
    </div>

    <!-- Waypoint Management -->
    <div class="space-y-4">
      <div class="flex justify-between items-center mb-2">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">Active Waypoints</span>
        <button class="text-[10px] text-emerald-600 font-bold hover:underline">+ Add Point</button>
      </div>

      <div class="space-y-2 max-h-[200px] overflow-y-auto pr-2 custom-scrollbar">
        <div v-for="(wp, index) in waypoints" :key="index"
             class="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group">
          <div class="flex items-center gap-3">
            <div class="w-6 h-6 bg-white rounded-lg flex items-center justify-center text-[10px] font-bold text-slate-400 border border-slate-100">
              {{ index + 1 }}
            </div>
            <div>
              <div class="text-xs font-bold text-slate-900">{{ wp.name }}</div>
              <div class="text-[10px] text-slate-500">{{ wp.coords }}</div>
            </div>
          </div>
          <div v-if="wp.status === 'completed'" class="p-1 bg-emerald-100 rounded-full">
            <Check class="w-3 h-3 text-emerald-600" />
          </div>
          <div v-else-if="wp.status === 'active'" class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <div v-else class="w-2 h-2 bg-slate-200 rounded-full"></div>
        </div>
      </div>
    </div>

    <!-- System Health -->
    <div class="mt-8 pt-6 border-t border-slate-100">
      <div class="flex justify-between items-center mb-4">
        <span class="text-xs font-bold text-slate-400 uppercase tracking-widest">System Health</span>
        <span class="text-[10px] font-bold text-emerald-600">Nominal</span>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="flex items-center gap-2">
          <Signal class="w-3 h-3 text-emerald-500" />
          <span class="text-[10px] font-medium text-slate-600">Signal: 98%</span>
        </div>
        <div class="flex items-center gap-2">
          <Cpu class="w-3 h-3 text-emerald-500" />
          <span class="text-[10px] font-medium text-slate-600">CPU: 42°C</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Pause, Home, ArrowDownCircle, Check, Signal, Cpu } from 'lucide-vue-next';

const waypoints = ref([
  { name: 'Launch Point', coords: '14.21, 101.12', status: 'completed' },
  { name: 'Sector Alpha', coords: '14.215, 101.125', status: 'active' },
  { name: 'Sector Beta', coords: '14.22, 101.13', status: 'pending' },
  { name: 'Sector Gamma', coords: '14.225, 101.135', status: 'pending' },
  { name: 'Return Point', coords: '14.21, 101.12', status: 'pending' }
]);

const handleAction = (action) => {
  // Logic for mission actions
  // Implement logic here
};

const confirmRTH = () => {
  if (confirm('Initiate Return To Home sequence? The drone will climb to safety altitude before returning.')) {
    handleAction('rth');
  }
};
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 4px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 10px;
}
</style>
