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
      <!-- Middle Rice Logo with Fading Effect -->
      <div class="mb-10 flex justify-center">
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
import { Play, ChevronDown } from 'lucide-vue-next';
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
