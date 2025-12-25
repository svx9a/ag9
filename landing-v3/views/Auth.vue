<template>
  <div class="min-h-screen bg-slate-50 flex items-center justify-center px-6 py-12">
    <div class="max-w-md w-full">
      <!-- Logo -->
      <div class="text-center mb-10">
        <img src="@/landing-v3/assets/logo.png" alt="Logo" class="w-20 h-20 object-contain mx-auto mb-6 drop-shadow-xl" />
        <h1 class="text-3xl font-bold text-slate-900 mb-2">{{ $t('auth.welcome') }}</h1>
        <p class="text-slate-500">{{ isLogin ? $t('auth.noAccount') : $t('auth.hasAccount') }}
          <button @click="isLogin = !isLogin" class="text-emerald-600 font-bold hover:underline">
            {{ isLogin ? $t('auth.register') : $t('auth.login') }}
          </button>
        </p>
      </div>

      <!-- Auth Card -->
      <div class="bg-white p-10 rounded-3xl shadow-sm border border-slate-100">
        <div v-if="isProviderMode" class="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-2xl flex items-center justify-between">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Shield class="w-4 h-4 text-white" />
            </div>
            <div>
              <p class="text-[10px] font-black text-blue-600 uppercase tracking-widest">Platform Access</p>
              <p class="text-xs font-bold text-blue-900">Operator Authentication</p>
            </div>
          </div>
          <button @click="isProviderMode = false" class="text-[10px] font-black text-slate-400 hover:text-slate-600 uppercase tracking-widest">Cancel</button>
        </div>

        <form @submit.prevent="handleAuth" class="space-y-6">
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700">{{ $t('auth.email') }}</label>
            <input v-model="form.email" type="email" required
                   class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                   placeholder="pilot@smartfarming.global" />
          </div>

          <div class="space-y-2">
            <div class="flex justify-between">
              <label class="text-sm font-semibold text-slate-700">{{ $t('auth.password') }}</label>
              <button type="button" class="text-xs text-emerald-600 font-medium hover:underline">{{ $t('auth.forgot') }}</button>
            </div>
            <input v-model="form.password" type="password" required
                   class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                   placeholder="••••••••" />
          </div>

          <div class="flex items-center gap-2">
            <input v-model="form.remember" type="checkbox" id="remember"
                   class="w-4 h-4 text-emerald-600 border-slate-300 rounded focus:ring-emerald-500" />
            <label for="remember" class="text-sm text-slate-600">{{ $t('auth.remember') }}</label>
          </div>

          <button :disabled="isLoading"
                  class="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10 flex items-center justify-center gap-2 disabled:opacity-50">
            <Loader2 v-if="isLoading" class="w-5 h-5 animate-spin" />
            {{ isLogin ? $t('auth.login') : $t('auth.register') }}
          </button>

          <div v-if="error" class="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium flex items-center gap-2 animate-shake">
            <AlertCircle class="w-5 h-5" />
            {{ error }}
          </div>
        </form>

        <!-- LINE Login Integration -->
        <div class="mt-8">
          <div class="relative flex items-center mb-8">
            <div class="flex-grow border-t border-slate-100"></div>
            <span class="flex-shrink-0 mx-4 text-slate-400 text-xs font-bold uppercase tracking-wider">{{ $t('auth.or') || 'OR' }}</span>
            <div class="flex-grow border-t border-slate-100"></div>
          </div>

          <button @click="handleLineLogin"
                  class="w-full py-4 bg-[#06C755] hover:bg-[#05b54d] text-white rounded-xl font-bold transition-all shadow-lg shadow-green-900/10 flex items-center justify-center gap-3 active:scale-[0.98]">
            <svg viewBox="0 0 24 24" fill="currentColor" class="w-6 h-6"><path d="M22.288 10.666c-.14-4.885-3.86-9.02-9.228-9.02-5.753 0-10.15 4.316-10.15 9.473 0 4.672 3.568 8.625 8.163 9.35l-.568 2.055c-.172.636.5.992.89.544l4.96-5.466c3.96-.86 6.185-3.6 6.033-6.936z"/></svg>
            {{ $t('auth.lineLogin') || 'Login with LINE' }}
          </button>
          <p class="text-center text-[10px] text-slate-400 mt-3 uppercase font-bold tracking-widest">
            Connect for instant drone task notifications
          </p>
        </div>

        <div v-if="!isProviderMode" class="mt-8 pt-6 border-t border-slate-50 flex flex-col items-center">
          <button @click="isProviderMode = true"
                  class="text-[10px] font-black text-slate-400 hover:text-blue-500 uppercase tracking-widest transition-colors flex items-center gap-2">
            <Shield class="w-3 h-3" />
            Platform Operator Login
          </button>
        </div>
      </div>

      <!-- Language Switcher -->
      <div class="mt-8 flex justify-center gap-4">
        <button v-for="lang in ['en', 'th']" :key="lang"
                @click="changeLocale(lang)"
                class="px-4 py-2 rounded-lg text-sm font-bold transition-all"
                :class="[$i18n.locale === lang ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600']">
          {{ lang.toUpperCase() }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { Loader2, AlertCircle, Shield } from 'lucide-vue-next';
import { useAuthStore } from '../stores';
import { LineAuthService } from '../services/lineAuth';

import axios from 'axios';

const { locale, t } = useI18n();
const router = useRouter();
const authStore = useAuthStore();

const isLogin = ref(true);
const isLoading = ref(false);
const error = ref('');
const isProviderMode = ref(false);

const form = reactive({
  email: '',
  password: '',
  remember: false
});

onMounted(async () => {
  await LineAuthService.init();
  if (LineAuthService.isLoggedIn()) {
    const profile = await LineAuthService.getProfile();
    if (profile) {
      authStore.login({
        email: profile.userId + '@line.auth',
        name: profile.displayName,
        picture: profile.pictureUrl,
        role: 'client' // Default for LINE
      }, 'line_token', true);
      router.push('/dashboard');
    }
  }
});

const handleLineLogin = () => {
  LineAuthService.login();
};

const changeLocale = (lang) => {
  locale.value = lang;
};

const handleAuth = async () => {
  isLoading.value = true;
  error.value = '';

  try {
    // 1. Try real API login
    const response = await axios.post('/api/login', {
      email: form.email,
      password: form.password
    });

    if (response.data && response.data.user) {
      const user = response.data.user;
      authStore.login(user, 'token_' + Date.now(), form.remember);

      // Role-based Redirection
      router.push('/dashboard');
    }
  } catch (err) {
    // 2. Fallback to Mock for Dev/Testing
    console.warn('API Login failed, using mock fallback', err.message);

    setTimeout(() => {
      let mockUser = null;

      if (form.email === 'pilot@smartfarming.global' && form.password === 'password') {
        mockUser = { email: form.email, name: 'Smart Pilot', role: 'provider' };
      } else if (form.email === 'farmer@smartfarming.global' && form.password === 'password') {
        mockUser = { email: form.email, name: 'Smart Farmer', role: 'client' };
      } else if (form.email === 'admin@smartfarming.global' && form.password === 'password') {
        mockUser = { email: form.email, name: 'System Admin', role: 'provider' };
      } else if (form.email === 'provider@kraset.ops' && form.password === 'password') {
        mockUser = { email: form.email, name: 'Platform Operator', role: 'provider' };
      }

      if (mockUser) {
        authStore.login(mockUser, 'token_mock_' + Date.now(), form.remember);
        router.push('/dashboard');
      } else {
        error.value = t('auth.error');
      }
      isLoading.value = false;
    }, 1000);
  }
};
</script>

<style scoped>
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  75% { transform: translateX(5px); }
}
.animate-shake {
  animation: shake 0.4s ease-in-out;
}
</style>
