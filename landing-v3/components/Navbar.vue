<template>
  <nav class="fixed top-0 w-full z-50 transition-all duration-300"
       :class="[isScrolled ? 'bg-white/90 backdrop-blur-md shadow-sm' : 'bg-transparent']">
    <div class="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
      <!-- Language Switcher (Mobile & Desktop) -->
      <div class="flex items-center bg-slate-100/10 backdrop-blur-md rounded-full p-1.5 mr-6 border border-white/10">
        <button v-for="lang in ['en', 'th']" :key="lang"
                @click="changeLocaleDirect(lang)"
                class="px-4 py-1.5 rounded-full text-xs font-black uppercase transition-all"
                :class="[locale === lang
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                  : (isScrolled ? 'text-slate-600 hover:text-emerald-600' : 'text-white/70 hover:text-white')]">
          {{ lang }}
        </button>
      </div>

      <!-- Logo -->
      <router-link to="/" class="flex items-center">
         <img src="@/landing-v3/assets/logo.png" alt="Smart Farming Logo"
              class="w-16 h-16 md:w-24 md:h-24 object-contain transition-all duration-300"
              :class="[!isScrolled ? 'drop-shadow-[0_0_20px_rgba(16,185,129,0.5)] filter drop-shadow-[0_4px_12px_rgba(0,0,0,0.4)]' : '']" />
       </router-link>

      <!-- Nav Links -->
      <div class="hidden md:flex items-center gap-10">
        <router-link v-for="item in navItems" :key="item.name" :to="item.path"
           class="text-base font-black uppercase tracking-tight transition-colors"
           :class="[isScrolled ? 'text-slate-900 hover:text-emerald-600' : 'text-white hover:text-emerald-400']">
          {{ $t(`nav.${item.name.toLowerCase().replace(/\s+/g, '_')}`) }}
        </router-link>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-6">
        <template v-if="!authStore.isAuthenticated">
          <router-link to="/auth"
             class="hidden md:block px-5 py-2 text-sm font-black uppercase tracking-widest transition-all rounded-full bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20"
             v-if="!isScrolled">
            {{ $t('auth.login') }}
          </router-link>
          <router-link to="/auth"
             class="hidden md:block px-5 py-2 text-sm font-black uppercase tracking-widest transition-all rounded-full bg-slate-900 text-white hover:bg-emerald-600 shadow-lg shadow-slate-900/20"
             v-else>
            {{ $t('auth.login') }}
          </router-link>
        </template>
        <template v-else>
          <router-link to="/dashboard"
             class="hidden md:block px-5 py-2 text-sm font-black uppercase tracking-widest transition-all rounded-full bg-emerald-500 text-white hover:bg-emerald-600 shadow-lg shadow-emerald-500/20">
            Dashboard
          </router-link>
        </template>

        <button class="p-2.5" :class="[isScrolled ? 'text-slate-900' : 'text-white']">
          <Search class="w-6 h-6" />
        </button>
        <button class="md:hidden p-2.5 text-white" @click="$emit('toggle-menu')">
          <Menu class="w-8 h-8" />
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { Search, Menu } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '../stores';

const { locale } = useI18n();
const authStore = useAuthStore();
const isScrolled = ref(false);
const navItems = [
  { name: 'Solutions', path: '/' },
  { name: 'Products', path: '/' },
  { name: 'Knowledge', path: '#knowledge-hub' },
  { name: 'Explore', path: '/contact' },
  { name: 'Support', path: '/dashboard' }
];

const handleScroll = () => {
  isScrolled.value = window.scrollY > 50;
};

const changeLocaleDirect = (val) => {
  locale.value = val;
};

onMounted(() => window.addEventListener('scroll', handleScroll));
onUnmounted(() => window.removeEventListener('scroll', handleScroll));
</script>
