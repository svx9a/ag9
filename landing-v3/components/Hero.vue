<template>
  <section class="relative h-screen flex items-center justify-center overflow-hidden">
    <!-- Video/Image Background -->
    <div class="absolute inset-0 z-0">
      <img src="@/landing-v3/assets/hero-kgy.jpg"
           class="w-full h-full object-cover brightness-[0.85]" alt="Smart Farming Banner Background" />
      <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-slate-900/60"></div>
    </div>

    <!-- Content -->
    <div class="relative z-10 text-center px-6 max-w-5xl animate-fadeInUp">
      <!-- Top Badge -->
      <div class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 rounded-full mb-8">
        <div class="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
        <span class="text-[10px] font-black text-emerald-400 uppercase tracking-widest">Global Agri-Tech Standard</span>
      </div>

      <!-- Main Titles -->
      <h1 class="text-6xl md:text-9xl font-black text-white mb-6 tracking-tighter leading-none">
        {{ $t('hero.title1') }}<span class="text-emerald-500">.</span><br/>
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">{{ $t('hero.title2') }}</span>
      </h1>

      <p class="text-xl md:text-2xl text-slate-300 mb-12 font-medium tracking-tight max-w-2xl mx-auto leading-relaxed">
        {{ $t('hero.subtitle') }}
      </p>

      <!-- Live Data Ticker -->
      <div class="mb-12 flex flex-wrap justify-center gap-4 md:gap-8 overflow-hidden whitespace-nowrap">
        <div v-for="stat in liveStats" :key="stat.label" class="flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-md rounded-xl border border-white/10">
          <component :is="stat.icon" class="w-4 h-4 text-emerald-400" />
          <span class="text-[10px] font-black text-white/50 uppercase tracking-widest">{{ stat.label }}</span>
          <span class="text-sm font-black text-white">{{ stat.value }}</span>
        </div>
      </div>

      <!-- Middle Rice Logo with Fading Effect -->
      <div class="mb-12 flex justify-center">
        <div class="relative group">
          <div class="absolute inset-0 bg-emerald-500 blur-3xl opacity-20 group-hover:opacity-40 transition-opacity animate-pulse"></div>
          <img src="@/landing-v3/assets/quality-rice-logo.png"
               alt="Quality Rice"
               class="relative w-32 h-32 md:w-40 md:h-40 object-contain opacity-80 hover:opacity-100 transition-all duration-700 animate-fadePulse" />
        </div>
      </div>

      <div class="flex flex-col sm:flex-row items-center justify-center gap-6">
        <button class="w-full sm:w-auto px-10 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-black text-lg uppercase tracking-widest transition-all shadow-2xl shadow-emerald-900/40 flex items-center justify-center gap-3 group active:scale-95">
          <Play class="w-6 h-6 fill-current" />
          {{ $t('hero.cta') }}
        </button>
        <button class="w-full sm:w-auto px-10 py-5 bg-white/10 hover:bg-white/20 text-white backdrop-blur-xl rounded-2xl font-black text-lg uppercase tracking-widest transition-all border border-white/20 flex items-center justify-center active:scale-95">
          Learn More
        </button>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce text-white/50">
      <ChevronDown class="w-8 h-8" />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Play, ChevronDown, Activity, Globe, Zap, Shield } from 'lucide-vue-next';

const liveStats = ref([
  { label: 'Active Drones', value: '1,284', icon: Activity },
  { label: 'Area Covered', value: '42.5k Ha', icon: Globe },
  { label: 'System Uptime', value: '99.9%', icon: Zap },
  { label: 'Trust Score', value: '4.9/5', icon: Shield }
]);

onMounted(() => {
  // Simulate live updates
  setInterval(() => {
    const droneStat = liveStats.value.find(s => s.label === 'Active Drones');
    if (droneStat) {
      const current = parseInt(droneStat.value.replace(',', ''));
      droneStat.value = (current + Math.floor(Math.random() * 3) - 1).toLocaleString();
    }
  }, 3000);
});
</script>

<style scoped>
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(40px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes fadePulse {
  0%, 100% { opacity: 0.6; transform: scale(0.98); }
  50% { opacity: 0.9; transform: scale(1.02); }
}
.animate-fadePulse {
  animation: fadePulse 4s ease-in-out infinite;
}
.animate-fadeInUp {
  animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.animate-fadeIn {
  animation: fadeIn 1.5s ease-out forwards;
}
</style>
