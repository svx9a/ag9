<template>
  <div class="grid grid-cols-2 gap-4">
    <div v-for="item in telemetryData" :key="item.label" 
         class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-500/30 transition-all group">
      <div class="flex items-center gap-3 mb-2">
        <div class="p-2 bg-slate-50 rounded-lg group-hover:bg-emerald-50 transition-colors">
          <component :is="item.icon" class="w-4 h-4 text-slate-400 group-hover:text-emerald-600" />
        </div>
        <span class="text-[10px] font-bold uppercase tracking-widest text-slate-400">{{ item.label }}</span>
      </div>
      <div class="flex items-baseline gap-1">
        <span class="text-xl font-black text-slate-900">{{ item.value }}</span>
        <span class="text-[10px] font-bold text-slate-400 uppercase">{{ item.unit }}</span>
      </div>
      
      <!-- Mini Trend/Progress -->
      <div v-if="item.showProgress" class="mt-3 w-full h-1 bg-slate-100 rounded-full overflow-hidden">
        <div class="h-full transition-all duration-500" 
             :class="getProgressColor(item.value)"
             :style="{ width: item.value + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Navigation, Gauge, Battery, MapPin } from 'lucide-vue-next';

const props = defineProps({
  telemetry: {
    type: Object,
    default: () => ({
      altitude: 45.5,
      speed: 12.8,
      battery: 84,
      gps: '14.21, 101.12'
    })
  }
});

const telemetryData = computed(() => [
  { label: 'Altitude', value: props.telemetry.altitude, unit: 'm', icon: Navigation },
  { label: 'Speed', value: props.telemetry.speed, unit: 'm/s', icon: Gauge },
  { label: 'Battery', value: props.telemetry.battery, unit: '%', icon: Battery, showProgress: true },
  { label: 'GPS Location', value: props.telemetry.gps, unit: 'Fix', icon: MapPin }
]);

const getProgressColor = (value) => {
  if (value > 60) return 'bg-emerald-500';
  if (value > 20) return 'bg-amber-500';
  return 'bg-red-500 animate-pulse';
};
</script>
