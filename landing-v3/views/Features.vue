<template>
  <div class="pt-24 min-h-screen bg-slate-50">
    <section class="py-20 max-w-7xl mx-auto px-6">
      <div class="text-center mb-20">
        <h1 class="text-5xl font-bold mb-6 tracking-tight">Powerful Capabilities</h1>
        <p class="text-xl text-slate-500 max-w-2xl mx-auto">
          The Smart Farming OS provides everything you need to manage your agricultural operations with surgical precision.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div v-for="feature in features" :key="feature.title"
             class="bg-white p-10 rounded-3xl shadow-sm hover:shadow-xl transition-all group">
          <div class="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
            <component :is="feature.icon" class="w-8 h-8" />
          </div>
          <h3 class="text-2xl font-bold mb-4">{{ feature.title }}</h3>
          <p class="text-slate-600 leading-relaxed">{{ feature.desc }}</p>
        </div>
      </div>
    </section>

    <!-- Interactive Section -->
    <section class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div class="order-2 md:order-1">
          <img src="@/landing-v3/assets/drone.png" class="rounded-3xl shadow-2xl w-full h-auto object-cover" />
        </div>
        <div class="order-1 md:order-2">
          <h2 class="text-4xl font-bold mb-8 leading-tight">Intelligent Mission Planning</h2>
          <p class="text-lg text-slate-600 mb-8">
            Our AI-powered mission planner automatically calculates the most efficient flight paths based on terrain, obstacles, and crop density.
          </p>
          <ul class="space-y-4 mb-10">
            <li v-for="item in missionItems" :key="item" class="flex items-center gap-3 font-medium text-slate-700">
              <div class="w-2 h-2 bg-emerald-500 rounded-full"></div>
              {{ item }}
            </li>
          </ul>
          <button class="px-8 py-4 bg-emerald-600 text-white rounded-full font-bold hover:bg-emerald-700 transition-all">
            See Demo
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import {
  Zap,
  Map as MapIcon,
  ShieldCheck,
  BarChart3,
  Cpu,
  CloudRain
} from 'lucide-vue-next';

const features = [
  { icon: Zap, title: 'Rapid Deployment', desc: 'Set up your fleet in minutes with our plug-and-play cloud synchronization.' },
  { icon: MapIcon, title: '3D Terrain Mapping', desc: 'Generate high-resolution 3D maps of your fields for precise obstacle avoidance.' },
  { icon: ShieldCheck, title: 'Safety First', desc: 'Advanced radar systems and real-time telemetry ensure your equipment stays safe.' },
  { icon: BarChart3, title: 'Yield Analytics', desc: 'Track your productivity and predict harvest yields with 95% accuracy.' },
  { icon: Cpu, title: 'Edge Processing', desc: 'Analyze data on the fly directly on your drone hardware for instant feedback.' },
  { icon: CloudRain, title: 'Weather Integration', desc: 'Automatic mission pausing based on local hyper-accurate weather data.' }
];

const missionItems = [
  'Automatic obstacle detection and rerouting',
  'Variable rate application based on multispectral data',
  'Multi-drone swarm coordination',
  'Offline operation capability'
];
</script>
