<template>
  <div class="pt-24 min-h-screen bg-white">
    <!-- Hero -->
    <section class="py-20 bg-slate-900 text-white overflow-hidden relative">
      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <h1 class="text-5xl md:text-7xl font-bold mb-6">Pioneering the<br/><span class="text-emerald-400">Future of Farming</span></h1>
        <p class="text-xl text-slate-300 max-w-2xl leading-relaxed">
          Founded in 2020, our company is on a mission to solve the global food security challenge through autonomous technology and data-driven insights.
        </p>
      </div>
      <div class="absolute right-0 top-0 w-1/2 h-full opacity-20">
        <img src="@/landing-v3/assets/acedemy.jpg" class="w-full h-full object-cover" />
      </div>
    </section>

    <!-- Content -->
    <section class="py-24 max-w-7xl mx-auto px-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div>
          <h2 class="text-4xl font-bold mb-8">Our Vision</h2>
          <p class="text-lg text-slate-600 mb-6">
            We believe that the integration of robotics and artificial intelligence in agriculture is not just an option, but a necessity. Our platform provides a unified operating system for the most advanced agricultural drones in the world.
          </p>
          <div class="space-y-4">
            <div v-for="point in points" :key="point" class="flex items-center gap-3">
              <div class="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600">
                <Check class="w-4 h-4" />
              </div>
              <span class="font-medium text-slate-700">{{ point }}</span>
            </div>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <img src="@/landing-v3/assets/drone_spraying_agtech.webp" class="rounded-2xl shadow-lg h-48 w-full object-cover" />
          <img src="@/landing-v3/assets/dronehub3man.jpg" class="rounded-2xl shadow-lg h-48 w-full object-cover" />
          <img src="@/landing-v3/assets/hero-kgy.jpg" class="rounded-2xl shadow-lg h-48 w-full object-cover" />
          <img src="@/landing-v3/assets/promotion.png" class="rounded-2xl shadow-lg h-48 w-full object-cover" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { Check } from 'lucide-vue-next';

const points = [
  'Zero-emission autonomous operations',
  'Precision application of resources',
  'Real-time crop health monitoring',
  'Unified fleet management across brands'
];
</script>
