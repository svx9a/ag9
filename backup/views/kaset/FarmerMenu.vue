<template>
  <div class="min-h-screen bg-slate-50 font-sans pb-20">
    <!-- Header -->
    <header class="bg-gradient-to-r from-orange-500 to-red-600 p-6 text-white shadow-lg sticky top-0 z-10 flex items-center justify-between">
      <div class="flex items-center gap-3">
        <button @click="router.back()" class="p-2 hover:bg-white/20 rounded-full transition-colors">
          <ChevronLeft class="w-6 h-6" />
        </button>
        <h1 class="text-xl font-bold uppercase tracking-tighter">{{ $t('kaset.farmer.header') }}</h1>
      </div>
      <img src="@/landing-v3/assets/logo.png" class="h-10 w-10 object-contain brightness-0 invert" alt="Smart Farming Logo" />
    </header>

    <!-- Hero Banner -->
    <div class="m-4 p-6 bg-white rounded-3xl shadow-sm border border-orange-100 flex items-center justify-between overflow-hidden relative group cursor-pointer" @click="handleCallDrone">
      <div class="z-10">
        <span class="inline-block px-3 py-1 bg-orange-100 text-orange-600 text-[10px] font-black uppercase rounded-full mb-2">Instant Booking</span>
        <h2 class="text-2xl font-black text-orange-600 leading-tight">
          {{ $t('kaset.farmer.banner_title') }}
        </h2>
        <p class="text-slate-500 text-sm mt-1 font-medium">{{ $t('kaset.farmer.banner_subtitle') }}</p>
        <button class="mt-4 bg-orange-600 text-white px-6 py-2 rounded-full text-sm font-black shadow-lg shadow-orange-200 group-hover:bg-orange-500 transition-all">
          {{ $t('kaset.farmer.banner_cta') }}
        </button>
      </div>
      <div class="absolute right-[-20px] top-0 opacity-10 group-hover:opacity-20 transition-opacity">
        <Plane class="w-40 h-40 text-orange-600 rotate-12" />
      </div>
    </div>

    <!-- Main Grid -->
    <div class="px-4 grid grid-cols-2 gap-4">
      <button
        v-for="item in menuItems"
        :key="item.key"
        @click="handleMenuClick(item)"
        class="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex flex-col items-center gap-3 transition-transform active:scale-95"
      >
        <div :class="`w-14 h-14 ${item.bgColor} rounded-2xl flex items-center justify-center`">
          <component :is="item.icon" :class="`w-8 h-8 ${item.iconColor}`" />
        </div>
        <span class="text-sm font-bold text-slate-700 text-center leading-tight">
          {{ $t(`kaset.farmer.menu.${item.key}`) }}
        </span>
      </button>
    </div>

    <!-- Footer -->
    <footer class="mt-12 px-6 py-8 border-t border-slate-200 bg-white text-center">
      <div class="flex justify-center gap-6 mb-4">
        <a href="#" class="text-xs text-slate-400 font-medium">{{ $t('footer.policy') }}</a>
        <a href="#" class="text-xs text-slate-400 font-medium">{{ $t('footer.contact') }}</a>
      </div>
      <div class="flex items-center justify-center gap-2">
        <img src="@/landing-v3/assets/logo.png" class="h-4 w-4 object-contain opacity-30 grayscale" alt="Smart Farming Logo" />
        <p class="text-[10px] text-slate-300">© 2025 - Global Precision Agriculture</p>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import {
  ChevronLeft, Plane, Map, Calculator,
  DollarSign, Calendar, History, PhoneCall
} from 'lucide-vue-next';
import { LineNotificationService } from '../../services/notificationService';
import { LineAuthService } from '../../services/lineAuth';

const router = useRouter();

const handleCallDrone = async () => {
  // Simulate task creation
  const mockTask = {
    id: 'TASK-' + Math.floor(Math.random() * 10000),
    status: 'REQUESTED',
    location: 'Nakhon Nayok Sector A4'
  };

  alert(`Request Sent! ${mockTask.id}`);

  // Send LINE Notification if logged in
  if (LineAuthService.isLoggedIn()) {
    const profile = await LineAuthService.getProfile();
    if (profile && profile.userId) {
      await LineNotificationService.sendTaskUpdate(profile.userId, mockTask);
      // LINE notification sent
      alert('Notification sent via LINE!');
    }
  }
};

const menuItems = [
  { key: 'call_drone', icon: Plane, bgColor: 'bg-orange-100', iconColor: 'text-orange-600' },
  { key: 'calc_area', icon: Calculator, bgColor: 'bg-emerald-100', iconColor: 'text-emerald-600' },
  { key: 'price_check', icon: DollarSign, bgColor: 'bg-blue-100', iconColor: 'text-blue-600' },
  { key: 'booking', icon: Calendar, bgColor: 'bg-purple-100', iconColor: 'text-purple-600' },
  { key: 'history', icon: History, bgColor: 'bg-amber-100', iconColor: 'text-amber-600' },
  { key: 'map_near', icon: Map, bgColor: 'bg-rose-100', iconColor: 'text-rose-600' },
  { key: 'contact', icon: PhoneCall, bgColor: 'bg-slate-100', iconColor: 'text-slate-600' }
];

const handleMenuClick = (item) => {
  if (item.key === 'call_drone') {
    handleCallDrone();
  } else if (item.path) {
    router.push(item.path);
  }
};
</script>

<style scoped>
.font-sans {
  font-family: 'Kanit', sans-serif;
}
</style>
