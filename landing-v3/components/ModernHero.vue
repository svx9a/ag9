<template>
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-950 font-sans">
    <!-- Atomic Energy Background Layer -->
    <div class="absolute inset-0 z-0">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.1),transparent_70%)]"></div>
      <div class="absolute inset-0 bg-grid-white/[0.02] bg-[bottom_1px_center] [mask-image:linear-gradient(to_bottom,transparent,black,transparent)]"></div>

      <!-- Floating Tech Elements -->
      <div class="absolute top-1/4 left-10 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"></div>
      <div class="absolute bottom-1/4 right-10 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>

      <!-- Main Visual -->
      <img src="/landing-v3/assets/drone_spraying_agtech.webp"
           class="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay"
           alt="Advanced Drone Technology" />

      <!-- Gradient Overlays -->
      <div class="absolute inset-0 bg-gradient-to-b from-slate-950 via-transparent to-slate-950"></div>
      <div class="absolute inset-0 bg-gradient-to-r from-slate-950 via-transparent to-slate-950"></div>
    </div>

    <!-- Content Container -->
    <div class="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-32 flex flex-col items-center text-center">
      <!-- Main Headline -->
      <h1 class="text-5xl md:text-8xl font-black text-white mb-8 tracking-tighter uppercase leading-none italic">
        The Future of <br/>
        <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
          Global Farming
        </span>
      </h1>

      <!-- Subheadline -->
      <p class="text-slate-400 text-lg md:text-2xl max-w-3xl mb-12 font-medium leading-relaxed">
        Empowering the next generation of agriculture with <span class="text-emerald-400 font-bold">Autonomous Drone Fleets</span> and <span class="text-emerald-400 font-bold">AI-Driven Insights</span>. Scale your operations with heroic efficiency.
      </p>

      <!-- Action Hub -->
      <div class="flex flex-col sm:flex-row items-center gap-6 w-full max-w-2xl">
        <button @click="router.push('/auth')"
                class="w-full sm:w-auto flex-1 px-10 py-6 bg-emerald-600 hover:bg-emerald-500 text-white rounded-[2rem] font-black text-xl uppercase tracking-widest transition-all shadow-[0_20px_50px_rgba(16,185,129,0.3)] hover:shadow-[0_30px_60px_rgba(16,185,129,0.4)] hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 group">
          <Play class="w-6 h-6 fill-white" />
          {{ $t('hero.cta') }}
        </button>
        <button @click="router.push('/drone-hub')"
                class="w-full sm:w-auto px-10 py-6 bg-white/5 hover:bg-white/10 text-white rounded-[2rem] border border-white/10 backdrop-blur-md font-black text-xl uppercase tracking-widest transition-all hover:-translate-y-1 active:scale-95">
          Explore Hub
        </button>
      </div>

      <!-- Live Telemetry Ticker -->
      <div class="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 w-full">
        <div v-for="stat in liveStats" :key="stat.label"
             class="flex flex-col items-center p-6 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md group hover:bg-white/10 transition-all shadow-sm">
          <component :is="stat.icon" class="w-6 h-6 text-emerald-400 mb-3 group-hover:scale-110 transition-transform" />
          <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{{ stat.label }}</span>
          <span class="text-2xl font-black text-white tracking-tighter">{{ stat.value }}</span>
        </div>
      </div>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
      <span class="text-[10px] font-black text-slate-500 uppercase tracking-widest">Scroll to Explore</span>
      <div class="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center p-1">
        <div class="w-1 h-2 bg-emerald-500 rounded-full animate-scroll"></div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { Play, Zap, Activity, Globe, Shield, Cpu } from 'lucide-vue-next';

const router = useRouter();

const liveStats = ref([
  { label: 'Active Drones', value: '1,284', icon: Activity },
  { label: 'Global Hubs', value: '42', icon: Globe },
  { label: 'Uptime', value: '99.9%', icon: Shield },
  { label: 'AI Cycles', value: '1.2M', icon: Cpu }
]);

onMounted(() => {
  // Heroic Telemetry Simulation
  setInterval(() => {
    const droneStat = liveStats.value.find(s => s.label === 'Active Drones');
    if (droneStat) {
      const current = parseInt(droneStat.value.replace(',', ''));
      droneStat.value = (current + Math.floor(Math.random() * 5) - 2).toLocaleString();
    }

    const cycleStat = liveStats.value.find(s => s.label === 'AI Cycles');
    if (cycleStat) {
      const current = parseFloat(cycleStat.value.replace('M', ''));
      cycleStat.value = (current + 0.01).toFixed(2) + 'M';
    }
  }, 2000);
});
</script>

<style scoped>
@keyframes scroll {
  0% { transform: translateY(0); opacity: 1; }
  100% { transform: translateY(12px); opacity: 0; }
}

.animate-scroll {
  animation: scroll 2s infinite;
}

@keyframes bounce-subtle {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}

.animate-bounce-subtle {
  animation: bounce-subtle 3s ease-in-out infinite;
}

.bg-grid-slate-900\/\[0\.05\] {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(15 23 42 / 0.05)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e");
}
</style>
