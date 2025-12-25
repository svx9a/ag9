<template>
  <section class="py-24 bg-slate-50 overflow-hidden">
    <div class="max-w-7xl mx-auto px-6">
      <div class="text-center mb-16">
        <h2 class="text-4xl font-bold text-slate-900 mb-4">{{ $t('sections.testimonials') }}</h2>
        <p class="text-slate-500 max-w-2xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          Hear from the farmers and operators who are transforming their yields with
          <img src="@/landing-v3/assets/logo.png" alt="Logo" class="h-6 w-auto inline-block" />
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="t in testimonials" :key="t.name"
             class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500">
          <div class="flex gap-1 mb-6 text-emerald-500">
            <Star v-for="i in 5" :key="i" class="w-4 h-4 fill-current" />
          </div>
          <p class="text-slate-700 mb-8 italic leading-relaxed" v-html="'&ldquo;' + t.text + '&rdquo;'"></p>
          <div class="flex items-center gap-4">
            <img :src="t.avatar" class="w-12 h-12 rounded-full object-cover" alt="User" />
            <div>
              <div class="font-bold text-slate-900">{{ t.name }}</div>
              <div class="text-sm text-slate-500">{{ t.role }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { Star } from 'lucide-vue-next';
import logoImg from '@/landing-v3/assets/logo.png';

const logoHtml = `<img src="/landing-v3/assets/logo.png" alt="Logo" class="h-5 w-auto inline-block mx-1 align-middle" />`;

const testimonials = [
  {
    name: 'Somchai P.',
    role: 'Rice Farmer, Thailand',
    text: `Our platform has reduced my pesticide costs by 30% while increasing coverage accuracy. The T50 is a game changer.`.replace('Our platform', logoHtml),
    avatar: '/landing-v3/assets/dronehub3man.jpg'
  },
  {
    name: 'Maria G.',
    role: 'Vineyard Manager, Spain',
    text: 'The multispectral analysis allows us to spot disease before it spreads. Intelligent farming at its best.',
    avatar: '/landing-v3/assets/acedemy.jpg'
  },
  {
    name: 'Chen W.',
    role: 'Ag-Service Provider, China',
    text: `Managing a fleet of 20 drones was impossible until our platform. Now we handle 1000+ hectares a day with ease.`.replace('our platform', logoHtml),
    avatar: '/landing-v3/assets/hero-kgy.jpg'
  }
];
</script>
