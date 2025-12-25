<template>
  <div class="drone-hub-landing min-h-screen bg-white font-sans overflow-x-hidden">
    <!-- SEO & Metadata -->
    <Teleport to="head">
      <title>{{ $t('drone_hub.seo.title') }}</title>
      <meta name="description" :content="$t('drone_hub.seo.description')" />
      <link rel="canonical" href="https://agriflight.global/drone-hub" />
      <meta property="og:title" :content="$t('drone_hub.seo.title')" />
      <meta property="og:description" :content="$t('drone_hub.seo.description')" />
      <meta property="og:image" content="/landing-v3/assets/hero-sf.jpg" />
      <meta name="keywords" content="drone farming, rice quality improvement, precision agriculture, agritech Thailand, drone spraying rice" />
      <!-- hreflang tags -->
      <link rel="alternate" hreflang="th" href="https://agriflight.global/drone-hub?lang=th" />
      <link rel="alternate" hreflang="en" href="https://agriflight.global/drone-hub?lang=en" />
    </Teleport>

    <!-- Schema Markup -->
    <component :is="'script'" type="application/ld+json">
      {{ JSON.stringify(schemaMarkup) }}
    </component>

    <!-- Hero Section -->
    <section class="relative min-h-[90vh] flex items-center pt-20 overflow-hidden bg-slate-900">
      <div class="absolute inset-0 z-0">
        <img src="@/landing-v3/assets/hero-kgy.jpg"
             class="w-full h-full object-cover opacity-60 scale-110 animate-pulse-slow"
             alt="Smart Farming Hero" />
        <div class="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent"></div>
      </div>

      <div class="max-w-7xl mx-auto px-6 relative z-10">
        <div class="max-w-3xl">
          <span class="inline-block px-4 py-1.5 bg-emerald-500 text-white text-xs font-black uppercase tracking-widest rounded-full mb-6 animate-bounce">
            {{ $t('drone_hub.hero.badge') }}
          </span>
          <h1 class="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            {{ $t('drone_hub.hero.title') }}
          </h1>
          <p class="text-xl text-slate-300 mb-10 leading-relaxed font-medium">
            {{ $t('drone_hub.hero.subtitle') }}
          </p>
          <div class="flex flex-col sm:flex-row gap-4">
            <button class="px-8 py-4 bg-emerald-600 text-white font-black rounded-2xl hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-900/40 flex items-center justify-center gap-3">
              {{ $t('drone_hub.hero.cta_farmer') }}
              <ArrowRight class="w-5 h-5" />
            </button>
            <button class="px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/20 font-black rounded-2xl hover:bg-white/20 transition-all">
              {{ $t('drone_hub.hero.cta_partner') }}
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Live Drone Map (Real-Time API Integration) -->
    <section class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <!-- Telemetry Dashboard -->
          <div class="lg:col-span-1 space-y-4">
            <div class="bg-slate-900 p-6 rounded-[2rem] text-white">
              <div class="flex items-center justify-between mb-6">
                <h3 class="font-black uppercase text-sm tracking-widest">Live Telemetry</h3>
                <div class="flex items-center gap-2">
                  <div class="w-2 h-2 bg-emerald-500 rounded-full animate-ping"></div>
                  <span class="text-[10px] font-bold text-emerald-500 uppercase">HiveGrid Active</span>
                </div>
              </div>

              <div class="space-y-6">
                <div v-for="(val, key) in telemetryData" :key="key" class="flex justify-between items-end border-b border-white/10 pb-2">
                  <span class="text-xs text-slate-400 font-bold uppercase">{{ key.replace('_', ' ') }}</span>
                  <span class="text-lg font-black" :class="key === 'battery' ? 'text-emerald-400' : ''">{{ val }}{{ key === 'battery' ? '%' : (key === 'altitude' ? 'm' : '') }}</span>
                </div>
              </div>

              <button @click="startMission" class="w-full mt-8 py-4 bg-emerald-600 hover:bg-emerald-500 rounded-2xl font-black transition-all flex items-center justify-center gap-2">
                <Plane class="w-5 h-5" />
                RE-SYNC MISSION
              </button>
            </div>

            <!-- GISTDA Satellite Insights -->
            <div class="bg-emerald-50 p-6 rounded-[2rem] border border-emerald-100">
              <h3 class="font-black text-emerald-900 uppercase text-sm tracking-widest mb-4">Satellite Insights</h3>
              <div class="flex items-center gap-4 mb-4">
                <div class="text-3xl font-black text-emerald-600">0.72</div>
                <div class="text-[10px] font-bold text-emerald-800 uppercase leading-tight">Average NDVI<br>(Healthy Crop)</div>
              </div>
              <p class="text-xs text-emerald-700 font-medium leading-relaxed">
                Source: GISTDA THEOS-2 & Sentinel-2. High chlorophyll levels detected in North-East sectors.
              </p>
            </div>
          </div>

          <!-- Real-Time Map -->
          <div class="lg:col-span-2 relative h-[600px] rounded-[3rem] overflow-hidden shadow-2xl border-4 border-slate-900">
            <div id="live-drone-map" class="w-full h-full bg-slate-100"></div>
            <!-- Map Overlay UI -->
            <div class="absolute top-6 left-6 z-[1000] bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg flex items-center gap-3">
              <Navigation class="w-4 h-4 text-slate-900" />
              <span class="text-xs font-black text-slate-900 uppercase tracking-widest">Nakhon Nayok Hub - Sector A4</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Science Section -->
    <section class="py-24 bg-slate-50">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">{{ $t('drone_hub.science.title') }}</h2>
          <p class="text-slate-600 max-w-2xl mx-auto font-medium">{{ $t('drone_hub.science.subtitle') }}</p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="(item, idx) in [
            { icon: Droplets, title: 'Droplet Control', desc: 'Precision ultra-low volume (ULV) nozzles ensure 95% coverage on rice leaves.' },
            { icon: Navigation, title: 'GISTDA Tracking', desc: 'Satellite-guided paths eliminate gaps and overlap, saving up to 20% on chemicals.' },
            { icon: Star, title: 'Yield Quality', desc: 'Uniform spraying leads to consistent grain size and higher milling recovery rates.' }
          ]" :key="idx" class="bg-white p-10 rounded-[3rem] shadow-xl hover:scale-[1.05] transition-all border border-slate-100 group">
            <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <component :is="item.icon" class="w-8 h-8" />
            </div>
            <h3 class="text-2xl font-black text-slate-900 mb-4 uppercase tracking-tight">{{ item.title }}</h3>
            <p class="text-slate-600 leading-relaxed font-medium">{{ item.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Case Study Section -->
    <section class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="bg-slate-900 rounded-[4rem] p-12 md:p-20 overflow-hidden relative">
          <div class="absolute right-0 top-0 w-1/2 h-full opacity-30">
            <img src="@/landing-v3/assets/dronehub3man.jpg" class="w-full h-full object-cover" alt="Case study background" />
          </div>
          <div class="relative z-10 max-w-2xl">
            <div class="flex items-center gap-2 text-emerald-400 mb-6 font-black uppercase tracking-widest text-sm">
              <Star class="w-5 h-5 fill-emerald-400" />
              Success Story
            </div>
            <h2 class="text-4xl md:text-5xl font-black text-white mb-8 leading-tight">Nakhon Nayok Rice Hub Increased Yield by 15%</h2>
            <p class="text-xl text-slate-300 mb-10 leading-relaxed font-medium">
              "By integrating <img src="@/landing-v3/assets/logo.png" alt="Logo" class="h-6 w-auto inline-block align-middle" /> drones with GISTDA satellite monitoring, we were able to detect pest outbreaks 4 days earlier and treat them with 100% precision."
            </p>
            <div class="flex items-center gap-6">
              <div class="w-16 h-16 bg-white rounded-full flex items-center justify-center text-slate-900 font-black text-2xl border-4 border-emerald-500">
                SJ
              </div>
              <div>
                <div class="text-white font-black text-lg">Somchai J.</div>
                <div class="text-slate-400 font-bold uppercase text-xs tracking-wider">Master Rice Farmer</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section class="py-24 bg-slate-50">
      <div class="max-w-7xl mx-auto px-6">
        <h2 class="text-3xl font-black text-center text-slate-900 mb-16 uppercase tracking-tight">Trusted by Leading Rice Hubs</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="t in testimonials" :key="t.name" class="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all duration-500">
            <div class="flex text-amber-400 mb-6">
              <Star v-for="s in 5" :key="s" class="w-5 h-5 fill-current" />
            </div>
            <p class="text-slate-600 font-medium leading-relaxed mb-8">
              "{{ t.text }}"
            </p>
            <div class="flex items-center gap-4">
              <img :src="t.image" class="w-12 h-12 rounded-full object-cover border-2 border-emerald-500" :alt="t.name" />
              <div>
                <div class="font-black text-slate-900">{{ t.name }}</div>
                <div class="text-xs text-slate-500 font-bold uppercase">{{ t.role }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Marketplace for Production Goods -->
    <section id="marketplace" class="py-24 bg-slate-50 border-t border-slate-200">
      <div class="max-w-7xl mx-auto px-6">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full text-sm font-bold mb-6">
          <ShoppingBag :size="16" />
          <span>{{ $t('marketplace.hero_badge') }}</span>
        </div>
        <h2 class="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-12 uppercase leading-none">
          {{ $t('marketplace.hero_title') }}
        </h2>

        <div class="flex flex-col lg:flex-row gap-12">
          <!-- Filters Sidebar -->
          <aside class="w-full lg:w-64 space-y-8">
            <div>
              <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">{{ $t('marketplace.filter_categories') }}</h3>
              <div class="space-y-2">
                <label v-for="cat in categories" :key="cat" class="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" class="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                  <span class="text-slate-600 font-bold group-hover:text-emerald-600 transition-colors">{{ cat }}</span>
                </label>
              </div>
            </div>

            <div>
              <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest mb-4">{{ $t('marketplace.filter_certs') }}</h3>
              <div class="space-y-2">
                <label v-for="cert in certifications" :key="cert" class="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" class="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                  <span class="text-slate-600 font-bold group-hover:text-emerald-600 transition-colors">{{ cert }}</span>
                </label>
              </div>
            </div>

            <div class="p-6 bg-emerald-600 rounded-3xl text-white">
              <h3 class="font-black mb-2 uppercase text-lg">{{ $t('marketplace.expert_sidebar_title') }}</h3>
              <p class="text-sm text-emerald-50 mb-4 font-medium">{{ $t('marketplace.expert_sidebar_desc') }}</p>
              <button class="w-full py-3 bg-white text-emerald-600 font-black rounded-xl hover:bg-emerald-50 transition-colors text-sm uppercase tracking-widest">
                {{ $t('marketplace.expert_sidebar_cta') }}
              </button>
            </div>
          </aside>

          <!-- Product Grid -->
          <div class="flex-1">
            <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              <div v-for="product in products" :key="product.id" class="bg-white rounded-[2rem] border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all group">
                <div class="aspect-square relative overflow-hidden">
                  <img :src="product.image" :alt="product.name" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div class="absolute top-4 left-4 flex flex-wrap gap-2">
                    <span v-for="badge in product.badges" :key="badge" class="px-3 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-black uppercase tracking-wider rounded-full shadow-sm">
                      {{ badge }}
                    </span>
                  </div>
                </div>
                <div class="p-6">
                  <div class="flex justify-between items-start mb-2">
                    <h3 class="text-xl font-black text-slate-900 leading-tight">{{ product.name }}</h3>
                    <div class="flex items-center gap-1 text-amber-500 font-bold text-sm">
                      <Star :size="14" class="fill-current" />
                      <span>{{ product.rating }}</span>
                    </div>
                  </div>
                  <p class="text-slate-500 text-sm font-medium mb-6 line-clamp-2">{{ product.description }}</p>

                  <div class="flex items-center gap-2 mb-6">
                    <button class="flex-1 px-4 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 uppercase tracking-widest">
                      <FileCheck :size="14" />
                      {{ $t('marketplace.view_report') }}
                    </button>
                  </div>

                  <div class="flex items-center justify-between mt-auto">
                    <div class="text-2xl font-black text-emerald-600">
                      {{ product.price }}
                    </div>
                    <button class="p-3 bg-slate-900 text-white rounded-xl hover:bg-emerald-600 transition-colors">
                      <ArrowRight :size="20" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Quality Control Hub -->
    <section class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div class="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-sm font-bold mb-6">
              <ShieldCheck :size="16" />
              <span>{{ $t('marketplace.qc_badge') }}</span>
            </div>
            <h2 class="text-4xl font-black text-slate-900 tracking-tighter mb-8 uppercase leading-none">
              {{ $t('marketplace.qc_title') }}
            </h2>
            <div class="space-y-8">
              <div v-for="feature in qcFeatures" :key="feature.title" class="flex gap-6">
                <div class="w-14 h-14 shrink-0 bg-slate-50 rounded-2xl flex items-center justify-center text-emerald-600">
                  <component :is="feature.icon" :size="28" />
                </div>
                <div>
                  <h4 class="font-black text-slate-900 uppercase tracking-tight text-lg mb-1">{{ feature.title }}</h4>
                  <p class="text-slate-500 font-medium leading-relaxed">{{ feature.desc }}</p>
                </div>
              </div>
            </div>
          </div>
          <div class="relative">
            <div class="aspect-square bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl">
              <img src="@/landing-v3/assets/drone.jpg" class="w-full h-full object-cover" />
            </div>
            <div class="absolute -bottom-8 -left-8 p-8 bg-emerald-600 rounded-3xl text-white shadow-2xl max-w-xs">
              <div class="flex items-center gap-4 mb-4">
                <div class="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <FileCheck :size="24" />
                </div>
                <div class="font-black uppercase tracking-tight">Verified Standards</div>
              </div>
              <p class="text-sm text-emerald-50 font-medium leading-relaxed">
                All hardware and supplies undergo 12-point atomic inspection before deployment.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Final CTA -->
    <section class="py-24 bg-emerald-600 relative overflow-hidden">
      <div class="absolute inset-0 opacity-10">
        <Plane class="w-full h-full rotate-12 scale-150" />
      </div>
      <div class="max-w-7xl mx-auto px-6 text-center relative z-10">
        <h2 class="text-4xl md:text-5xl font-black text-white mb-8 uppercase tracking-tighter">Ready to Upgrade Your Rice Hub?</h2>
        <div class="flex flex-col sm:flex-row gap-6 justify-center">
          <button class="px-12 py-5 bg-white text-emerald-700 font-black rounded-2xl hover:bg-slate-50 transition-all shadow-2xl">
            Book a Demo
          </button>
          <a href="#marketplace" class="px-12 py-5 bg-transparent border-2 border-white text-white font-black rounded-2xl hover:bg-white/10 transition-all inline-block">
            Production Marketplace
          </a>
        </div>
      </div>
    </section>

    <!-- Super Value Special Offer (Relocated) -->
    <PromoSection />

    <!-- End-to-End Traceability -->
    <section class="py-24 bg-slate-900 text-white overflow-hidden">
      <div class="max-w-7xl mx-auto px-6 relative">
        <div class="text-center mb-16">
          <h2 class="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-6">
            {{ $t('marketplace.trace_title') }}
          </h2>
          <p class="text-slate-400 max-w-2xl mx-auto font-medium">
            {{ $t('marketplace.trace_subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="step in traceSteps" :key="step.title" class="p-8 bg-white/5 rounded-[2rem] border border-white/10 hover:bg-white/10 transition-colors">
            <div class="w-16 h-16 bg-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-xl">
              <component :is="step.icon" :size="32" />
            </div>
            <h3 class="text-xl font-black uppercase mb-4">{{ step.title }}</h3>
            <p class="text-slate-400 font-medium leading-relaxed">{{ step.desc }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Educational Content -->
    <section id="academy" class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div>
            <h2 class="text-4xl font-black text-slate-900 tracking-tighter uppercase mb-4">{{ $t('marketplace.edu_title') }}</h2>
            <p class="text-slate-500 font-medium">{{ $t('marketplace.edu_subtitle') }}</p>
          </div>
          <button class="px-8 py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-emerald-600 transition-all uppercase text-sm tracking-widest">
            View All Resources
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div v-for="post in blogPosts" :key="post.title" class="group cursor-pointer">
            <div class="aspect-video overflow-hidden rounded-[2.5rem] mb-6 shadow-lg">
              <img :src="post.image" :alt="post.title" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <div class="flex items-center gap-4 mb-4">
              <span class="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-full">{{ post.category }}</span>
              <span class="text-xs text-slate-400 font-bold">{{ post.date }}</span>
            </div>
            <h3 class="text-2xl font-black text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight mb-4">{{ post.title }}</h3>
            <p class="text-slate-500 font-medium line-clamp-2">{{ post.excerpt }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import {
  ArrowRight, Droplets, Plane, Star, Navigation,
  ShoppingBag, ShieldCheck, Search, Factory,
  ClipboardCheck, BarChart3, Microscope, FileCheck,
  Zap, MapIcon, ChevronRight
} from 'lucide-vue-next';
import Navbar from '../../components/Navbar.vue';
import Footer from '../../components/Footer.vue';
import { DroneApiService } from '../../services/droneApi';
import PromoSection from '../../components/PromoSection.vue';
import MatrixCalculator from '../../components/MatrixCalculator.vue';
import Products from '../../components/Products.vue';

// Import Assets
import droneImg from '@/landing-v3/assets/drone.jpg';
import academyImg from '@/landing-v3/assets/acedemy.jpg';
import marketplaceImg from '@/landing-v3/assets/dronehub3man.jpg';
import communityImg from '@/landing-v3/assets/hero-kgy.jpg';
import promotionImg from '@/landing-v3/assets/promotion.png';

const testimonials = [
  {
    name: 'Khun Prapat',
    role: 'Nakhon Nayok Rice Hub',
    image: droneImg,
    text: "Since switching to our Drone Hub technology, our Jasmine rice aroma has intensified, and the grain uniformity is the best we've seen in decades."
  },
  {
    name: 'Khun Somchai',
    role: 'Central Thailand Farmer',
    image: academyImg,
    text: "The efficiency gain is incredible. We can now cover 100 rai in a fraction of the time with 100% precision."
  },
  {
    name: 'Khun Malee',
    role: 'Agri-Tech Hub Manager',
    image: marketplaceImg,
    text: "The integrated ecosystem from our platform has transformed our operations. Traceability and quality control are now effortless."
  }
];

const telemetryData = ref({
  status: 'IDLE',
  battery: 100,
  altitude: 0,
  flow_rate: 0
});

let map;
let droneMarker;
let telemetryInterval;

const startMission = async () => {
  telemetryData.value.status = 'SYNCING...';
  // Mock API call
  const result = await DroneApiService.getLiveTelemetry('task_123');
  telemetryData.value = {
    status: result.status,
    battery: result.battery,
    altitude: result.altitude,
    flow_rate: result.flow_rate
  };
};

onMounted(() => {
  // Initialize Leaflet Map
  if (typeof L !== 'undefined') {
    map = L.map('live-drone-map').setView([14.2069, 101.2133], 13); // Nakhon Nayok coordinates
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add Drone Marker
    const droneIcon = L.divIcon({
      className: 'drone-icon',
      html: `<div class="w-8 h-8 bg-emerald-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center animate-pulse"><div class="w-2 h-2 bg-white rounded-full"></div></div>`,
      iconSize: [32, 32]
    });

    droneMarker = L.marker([14.2069, 101.2133], { icon: droneIcon }).addTo(map);

    // Start Telemetry Polling
    telemetryInterval = setInterval(async () => {
      const data = await DroneApiService.getLiveTelemetry('task_123');
      telemetryData.value = {
        status: data.status,
        battery: data.battery,
        altitude: data.altitude,
        flow_rate: data.flow_rate
      };

      // Update Marker Position
      if (droneMarker) {
        droneMarker.setLatLng(data.location);
        map.panTo(data.location);
      }
    }, 3000);
  }
});

onUnmounted(() => {
  if (telemetryInterval) clearInterval(telemetryInterval);
});

const categories = ['Equipment', 'Machinery', 'Packaging', 'Supplies'];
const certifications = ['ISO 9001', 'ISO 22000', 'Organic', 'HACCP'];

const products = [
  {
    id: 1,
    name: 'Industrial Rice Polisher X5',
    description: 'Advanced polishing machinery for premium long-grain rice with minimal breakage.',
    price: '฿450,000',
    rating: 4.9,
    image: droneImg,
    badges: ['High Efficiency', 'ISO Certified']
  },
  {
    id: 2,
    name: 'Smart Moisture Analyzer',
    description: 'Precision moisture testing tool for real-time grain quality monitoring.',
    price: '฿12,500',
    rating: 4.8,
    image: communityImg,
    badges: ['Precision', 'Portable']
  },
  {
    id: 3,
    name: 'Eco-Friendly Bio-Fertilizer',
    description: 'Organic nutrient booster specifically formulated for high-aroma rice varieties.',
    price: '฿1,200',
    rating: 4.7,
    image: promotionImg,
    badges: ['Organic', 'Eco-Safe']
  }
];

const qcFeatures = [
  {
    icon: Factory,
    title: 'Supplier Audits',
    desc: 'Every supplier on our platform undergoes a 50-point quality and compliance inspection.'
  },
  {
    icon: Microscope,
    title: 'Product Testing',
    desc: 'Batch-level testing for purity, performance, and safety standards.'
  },
  {
    icon: ClipboardCheck,
    title: 'Certification Hub',
    desc: 'Access all necessary compliance badges and documents directly from the product page.'
  }
];

const traceSteps = [
  {
    icon: Droplets,
    title: 'Moisture Analysis',
    desc: 'Real-time monitoring of moisture content during storage and processing to prevent spoilage.'
  },
  {
    icon: BarChart3,
    title: 'Grain Grading',
    desc: 'AI-powered grading systems ensuring consistency in size, shape, and color of every batch.'
  },
  {
    icon: Search,
    title: 'Contamination Check',
    desc: 'Comprehensive screening for heavy metals, pesticides, and other contaminants.'
  }
];

const blogPosts = [
  {
    title: 'Maximizing Rice Aroma through Precision Harvesting',
    category: 'Expert Tips',
    date: 'Dec 20, 2025',
    excerpt: 'Learn how timing and equipment settings can drastically impact the natural aroma of Jasmine rice.',
    image: '@/landing-v3/assets/acedemy.jpg'
  },
  {
    title: 'Understanding ISO 22000 in Rice Production',
    category: 'Compliance',
    date: 'Dec 15, 2025',
    excerpt: 'A comprehensive guide to food safety management systems for modern agricultural hubs.',
    image: '@/landing-v3/assets/dronehub3man.jpg'
  }
];

const schemaMarkup = {
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Drone Hub Farming Technology",
  "provider": {
    "@type": "Organization",
    "name": "Smart Farming Global",
    "url": "https://agriflight.global"
  },
  "description": "Bilingual drone farming technology for precision agriculture and rice quality improvement.",
  "areaServed": "Thailand",
  "serviceType": "Agricultural Technology"
};
</script>

<style scoped>
@keyframes float {
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
}
.animate-float {
  animation: float 4s ease-in-out infinite;
}
.animate-pulse-slow {
  animation: pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
@keyframes pulse {
  0%, 100% { opacity: 0.4; transform: scale(1.1); }
  50% { opacity: 0.5; transform: scale(1.15); }
}
.drone-hub-landing {
  font-family: 'Kanit', sans-serif;
}
</style>
