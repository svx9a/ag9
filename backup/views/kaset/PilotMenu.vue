<template>
  <div class="min-h-screen bg-slate-900 font-sans pb-20 text-white">
    <!-- Header -->
    <header class="p-6 border-b border-slate-800 flex items-center justify-between sticky top-0 bg-slate-900/90 backdrop-blur-md z-10">
      <div class="flex items-center gap-3">
        <button @click="router.back()" class="p-2 hover:bg-slate-800 rounded-full transition-colors">
          <ChevronLeft class="w-6 h-6 text-slate-400" />
        </button>
        <h1 class="text-xl font-bold">{{ $t('kaset.pilot.header') }}</h1>
      </div>

      <!-- Status Toggle -->
      <button
        @click="isReady = !isReady"
        class="flex items-center gap-2 px-4 py-2 rounded-full border transition-all"
        :class="isReady ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400' : 'bg-red-500/10 border-red-500 text-red-400'"
      >
        <div class="w-2 h-2 rounded-full" :class="isReady ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'"></div>
        <span class="text-xs font-black uppercase">{{ isReady ? $t('kaset.pilot.ready') : $t('kaset.pilot.not_ready') }}</span>
      </button>
    </header>

    <!-- Pilot Profile Summary -->
    <div class="m-4 p-6 bg-gradient-to-br from-red-900/40 to-slate-800 rounded-3xl border border-red-900/30">
      <div class="flex items-center gap-4 mb-6">
        <div class="w-16 h-16 bg-red-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-900/40">
          <User class="w-10 h-10 text-white" />
        </div>
        <div>
          <h2 class="text-lg font-bold">Pilot Alpha-01</h2>
          <p class="text-slate-400 text-xs font-mono">ID: SF-99234-TH</p>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-slate-900/50 p-3 rounded-xl border border-white/5">
          <p class="text-[10px] text-slate-500 uppercase font-bold">{{ $t('kaset.pilot.total_jobs') }}</p>
          <p class="text-xl font-black text-white">128</p>
        </div>
        <div class="bg-slate-900/50 p-3 rounded-xl border border-white/5">
          <p class="text-[10px] text-slate-500 uppercase font-bold">{{ $t('kaset.pilot.rating') }}</p>
          <p class="text-xl font-black text-amber-400">4.9 ★</p>
        </div>
      </div>
    </div>

    <!-- Menu Items -->
    <div class="px-4 space-y-3">
      <button
        v-for="item in menuItems"
        :key="item.key"
        @click="handleMenuClick(item)"
        class="w-full bg-slate-800 p-5 rounded-2xl border border-slate-700/50 flex items-center gap-4 transition-transform active:scale-[0.98] group"
      >
        <div :class="`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`">
          <component :is="item.icon" :class="`w-6 h-6 ${item.iconColor}`" />
        </div>
        <div class="flex-1 text-left">
          <span class="text-sm font-bold text-slate-200">{{ $t(`kaset.pilot.menu.${item.key}`) }}</span>
          <p class="text-[10px] text-slate-500 mt-0.5">{{ $t(`kaset.pilot.menu_desc.${item.key}`) }}</p>
        </div>
        <ChevronRight class="w-5 h-5 text-slate-600" />
      </button>
    </div>

    <!-- Logout -->
    <div class="p-8">
      <button
        @click="handleLogout"
        class="w-full py-4 text-slate-500 text-sm font-bold hover:text-red-400 transition-colors flex items-center justify-center gap-2"
      >
        <LogOut class="w-4 h-4" />
        {{ $t('auth.logout') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {
  ChevronLeft, ChevronRight, User, Gamepad2,
  Clock, Activity, Wallet, MapPin,
  History, FileText, LogOut
} from 'lucide-vue-next';

const router = useRouter();
const isReady = ref(true);

const menuItems = [
  { key: 'pending', icon: Clock, bgColor: 'bg-amber-500/10', iconColor: 'text-amber-500' },
  { key: 'active', icon: Activity, bgColor: 'bg-emerald-500/10', iconColor: 'text-emerald-500' },
  { key: 'income', icon: Wallet, bgColor: 'bg-blue-500/10', iconColor: 'text-blue-500' },
  { key: 'drone_info', icon: Gamepad2, bgColor: 'bg-red-500/10', iconColor: 'text-red-500' },
  { key: 'location', icon: MapPin, bgColor: 'bg-purple-500/10', iconColor: 'text-purple-500' },
  { key: 'history', icon: History, bgColor: 'bg-slate-500/10', iconColor: 'text-slate-400' },
  { key: 'certs', icon: FileText, bgColor: 'bg-indigo-500/10', iconColor: 'text-indigo-400' }
];

const handleMenuClick = (item) => {
  if (item.path) router.push(item.path);
};

const handleLogout = () => {
  router.push('/kaset/role');
};
</script>

<style scoped>
.font-sans {
  font-family: 'Kanit', sans-serif;
}
</style>
