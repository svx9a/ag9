<script setup>
import { ArrowUpRight } from 'lucide-vue-next';
import droneImg from '@/landing-v3/assets/drone_spraying_agtech.webp';
import academyImg from '@/landing-v3/assets/acedemy.jpg';
import marketplaceImg from '@/landing-v3/assets/dronehub3man.jpg';
import communityImg from '@/landing-v3/assets/hero-kgy.jpg';
import promotionImg from '@/landing-v3/assets/promotion.png';
import riceImg from '@/landing-v3/assets/rice.png';
import logoImg from '@/landing-v3/assets/logo.png';

const products = [
  {
    title: 'services',
    desc: 'services_desc',
    image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?q=80&w=2070&auto=format&fit=crop',
    link: '/kaset/drone-hub'
  },
  {
    title: 'academy',
    desc: 'academy_desc',
    image: academyImg,
    link: '/drone-hub#academy'
  },
  {
    title: 'marketplace',
    desc: 'marketplace_desc',
    image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2074&auto=format&fit=crop',
    link: '/drone-hub#marketplace'
  },
  {
    title: 'community',
    desc: 'community_desc',
    image: communityImg,
    link: '/kaset'
  },
  {
    title: 'production',
    desc: 'production_desc',
    image: '/landing-v3/assets/quality-rice-logo.png',
    link: '/kaset'
  },
  {
    title: 'logistics',
    desc: 'logistics_desc',
    image: 'https://images.unsplash.com/photo-1536304993881-ff6e9eefa2a6?q=80&w=2070&auto=format&fit=crop',
    link: '/kaset'
  }
];
</script>

<template>
  <section class="py-24 bg-slate-50 text-slate-900 relative overflow-hidden border-y border-slate-200">
    <!-- Background Atomic Glow -->
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]"></div>

    <div class="max-w-7xl mx-auto px-6 relative z-10">
      <div class="text-center mb-16">
        <h2 class="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-none mb-6">
          {{ $t('sections.highlights') }}
        </h2>
        <p class="text-slate-600 text-lg font-medium max-w-2xl mx-auto">
          Join the future of precision agriculture with our fully integrated ecosystem designed for maximum efficiency.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-12">
        <div v-for="product in products" :key="product.title"
             class="group relative rounded-[3rem] overflow-hidden bg-white h-[500px] border border-slate-200 hover:border-emerald-500 transition-all duration-500 hover:-translate-y-4 shadow-lg hover:shadow-xl">
          <a :href="product.link" class="block h-full">
            <div class="absolute inset-0 w-full h-full">
               <img :src="product.image || logoImg" :alt="$t('sections.' + product.title)" class="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" />
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-slate-800/20 to-transparent"></div>

            <div class="relative h-full p-10 flex flex-col justify-end z-10">
              <h3 class="text-3xl font-black uppercase mb-4 text-white group-hover:text-emerald-400 transition-colors">
                {{ $t('sections.' + product.title) }}
              </h3>
              <p class="text-slate-200 group-hover:text-white mb-8 font-medium leading-relaxed line-clamp-3">
                {{ $t('sections.' + product.desc) }}
              </p>
              <span class="flex items-center gap-2 font-black uppercase text-xs tracking-widest text-emerald-400 group-hover:text-emerald-300 transition-all">
                Explore <ArrowUpRight class="w-4 h-4" />
              </span>
            </div>
          </a>
        </div>
      </div>
    </div>
  </section>
</template>
