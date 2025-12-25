<template>
  <div class="min-h-screen bg-white font-sans selection:bg-emerald-100 selection:text-emerald-900">
    <Navbar v-if="$route.path !== '/drone-hub'" @toggle-menu="isMenuOpen = !isMenuOpen" />

    <main>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <Footer />

    <ChatWidget v-if="$route.path !== '/drone-hub'" />

    <!-- Mobile Menu Overlay -->
    <div v-if="isMenuOpen"
         class="fixed inset-0 z-[60] bg-white p-8 flex flex-col animate-slideIn">
      <div class="flex justify-between items-center mb-16">
        <div class="flex items-center gap-2">
          <img src="@/landing-v3/assets/logo.png" class="h-14 w-14 object-contain" alt="logo" />
        </div>
        <button @click="isMenuOpen = false" class="p-3 bg-slate-100 rounded-full shadow-lg"><X class="w-10 h-10 text-slate-900" /></button>
      </div>
      <div class="flex flex-col gap-10">
        <router-link v-for="item in menuItems"
           :key="item.name" :to="item.path"
           class="text-4xl font-black text-slate-900 uppercase tracking-tighter hover:text-emerald-600 transition-colors" @click="isMenuOpen = false">
          {{ item.name }}
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { X } from 'lucide-vue-next';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import ChatWidget from './components/ChatWidget.vue';

const isMenuOpen = ref(false);

const menuItems = [
  { name: 'Products', path: '/' },
  { name: 'About', path: '/about' },
  { name: 'Features', path: '/features' },
  { name: 'Contact', path: '/contact' },
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Smart Farming', path: '/kaset/role' },
  { name: 'Drone Hub', path: '/drone-hub' },
  { name: 'Marketplace', path: '/drone-hub#marketplace' }
];
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

body {
  font-family: 'Inter', sans-serif;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(100%); }
  to { opacity: 1; transform: translateX(0); }
}

.animate-slideIn {
  animation: slideIn 0.3s ease-out forwards;
}
</style>
