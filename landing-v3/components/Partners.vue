<template>
  <section
    class="relative py-16 bg-white border-y border-slate-100 overflow-hidden"
  >
    <!-- Background subtle pattern -->
    <div class="absolute inset-0 opacity-[0.02] pointer-events-none">
      <div class="absolute inset-0" style="background-image: radial-gradient(#10b981 1px, transparent 1px); background-size: 40px 40px;"></div>
    </div>

    <div class="max-w-7xl mx-auto px-6 mb-12 text-center relative z-10">
      <h3 class="text-[10px] font-black uppercase tracking-[0.5em] text-slate-400 mb-2">
        {{ $t('sections.partners') || 'Strategic Partners' }}
      </h3>
      <div class="w-8 h-1 bg-emerald-500/30 mx-auto rounded-full"></div>
    </div>

    <!-- Infinite Marquee -->
    <div class="relative flex overflow-hidden">
      <div class="flex animate-marquee whitespace-nowrap gap-12 md:gap-32 items-center py-8">
        <!-- Triple the partners array for extra smooth seamless looping -->
        <div
          v-for="(partner, index) in [...partners, ...partners, ...partners]"
          :key="`${partner.name}-${index}`"
          class="inline-flex items-center justify-center min-w-[180px] md:min-w-[240px] group"
        >
          <img
            v-if="partner.logo"
            :src="partner.logo"
            :alt="partner.name"
            class="h-16 md:h-24 w-auto object-contain opacity-100 transition-all duration-500 drop-shadow-md group-hover:scale-110"
            loading="lazy"
          />
          <component
            v-else
            :is="partner.icon"
            class="w-16 h-16 md:w-24 md:h-24 text-emerald-600 group-hover:text-emerald-500 transition-all duration-500 group-hover:scale-110"
          />
        </div>
      </div>

      <!-- Second instance for seamless loop -->
      <div class="flex animate-marquee whitespace-nowrap gap-12 md:gap-32 items-center py-8" aria-hidden="true">
        <div
          v-for="(partner, index) in [...partners, ...partners, ...partners]"
          :key="`loop-${partner.name}-${index}`"
          class="inline-flex items-center justify-center min-w-[180px] md:min-w-[240px] group"
        >
          <img
            v-if="partner.logo"
            :src="partner.logo"
            :alt="partner.name"
            class="h-16 md:h-24 w-auto object-contain opacity-100 transition-all duration-500 drop-shadow-md group-hover:scale-110"
            loading="lazy"
          />
          <component
            v-else
            :is="partner.icon"
            class="w-16 h-16 md:w-24 md:h-24 text-emerald-600 group-hover:text-emerald-500 transition-all duration-500 group-hover:scale-110"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ShieldCheck } from 'lucide-vue-next';

// Local asset imports
import ttaLogo from '../assets/TTALogo_kl.png';
import hetznerLogo from '../assets/hetzner_logo.png';
import gistdaLogo from '../assets/gistda-logo-png.png';
import baacLogo from '../assets/thai_bank.png';
import xagLogo from '../assets/XAG_Logo_2022.png';
import djiLogo from '../assets/dji-logo-png_seeklogo-492192.png';
import moacLogo from '../assets/moac_thailand.png';
import logoImg from '../assets/logo.png';

const partners = [
  { name: 'DRONE HUB AI', logo: logoImg },
  { name: 'TTA', logo: ttaLogo },
  { name: 'XAG', logo: xagLogo },
  { name: 'DJI', logo: djiLogo },
  { name: 'Hetzner', logo: hetznerLogo },
  { name: 'GISTDA', logo: gistdaLogo },
  { name: 'BAAC Bank', logo: baacLogo },
  { name: 'MOAC Thailand', logo: moacLogo }
];
</script>

<style scoped>
.animate-marquee {
  animation: marquee 60s linear infinite;
}

.animate-marquee:hover {
  animation-play-state: paused;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-100%); }
}
</style>
