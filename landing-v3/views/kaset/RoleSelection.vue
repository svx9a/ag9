<template>
  <div class="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans relative overflow-hidden">
    <!-- Background Decoration -->
    <div class="absolute inset-0 z-0 opacity-10 pointer-events-none">
      <img src="@/landing-v3/assets/hero-kgy.jpg" class="w-full h-full object-cover" alt="background" />
    </div>

    <!-- Header -->
    <div class="text-center mb-12 relative z-10">
      <img src="@/landing-v3/assets/logo.png" class="w-32 h-32 mx-auto mb-6 drop-shadow-2xl" alt="Smart Farming Logo" />
      <h1 class="text-4xl font-black text-slate-900 mb-3 uppercase tracking-tighter">{{ $t('kaset.role_selection.title') }}</h1>
      <p class="text-slate-600 font-medium">{{ $t('kaset.role_selection.subtitle') }}</p>
    </div>

    <!-- Role Buttons -->
    <div class="w-full max-w-md space-y-6 relative z-10">
      <!-- Client Role -->
      <button
        @click="selectRole('client')"
        class="w-full bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-[2.5rem] shadow-2xl shadow-emerald-200 flex flex-col items-center gap-4 transition-all hover:scale-[1.02] active:scale-95 border-4 border-white group"
      >
        <div class="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md group-hover:bg-white/30 transition-colors">
          <User class="w-12 h-12 text-white" />
        </div>
        <div class="text-center">
          <h2 class="text-2xl font-black text-white uppercase tracking-wide">Client</h2>
          <p class="text-emerald-100 text-sm mt-1 font-medium">Book drones & manage missions</p>
        </div>
      </button>

      <!-- Provider Role -->
      <button
        @click="selectRole('provider')"
        class="w-full bg-gradient-to-br from-blue-600 to-indigo-900 p-8 rounded-[2.5rem] shadow-2xl shadow-blue-900/30 flex flex-col items-center gap-4 transition-all hover:scale-[1.02] active:scale-95 border-4 border-white group"
      >
        <div class="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-md group-hover:bg-white/20 transition-colors">
          <Shield class="w-12 h-12 text-white" />
        </div>
        <div class="text-center">
          <h2 class="text-2xl font-black text-white uppercase tracking-wide">Provider</h2>
          <p class="text-blue-200 text-sm mt-1 font-medium">Manage fleet & operations</p>
        </div>
      </button>

      <!-- LINE Login Integration -->
      <div class="pt-8 border-t border-slate-200">
        <button
          @click="loginWithLine"
          class="w-full bg-[#00B900] text-white py-4 rounded-2xl font-black flex items-center justify-center gap-3 shadow-lg shadow-green-100 hover:bg-[#009900] transition-all"
        >
          <MessageCircle class="w-6 h-6 fill-white" />
          {{ userProfile ? `Hello, ${userProfile.displayName}` : 'LOGIN WITH LINE' }}
        </button>
      </div>
    </div>


    <!-- Footer Decoration -->
    <div class="mt-12 opacity-40 relative z-10">
      <img src="@/landing-v3/assets/dronehub3man.jpg" class="w-48 rounded-2xl shadow-lg border-2 border-white grayscale hover:grayscale-0 transition-all cursor-pointer" alt="map layout" />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { User, Gamepad2, MessageCircle, Shield } from 'lucide-vue-next';
import { LineAuthService } from '../../services/lineAuth';
import { useAuthStore } from '../../stores';

const router = useRouter();
const authStore = useAuthStore();
const userProfile = ref(null);

onMounted(async () => {
  await LineAuthService.init();
  if (LineAuthService.isLoggedIn()) {
    userProfile.value = await LineAuthService.getProfile();
  }
});

const loginWithLine = () => {
  LineAuthService.login();
};

const selectRole = (role) => {
  if (authStore.isAuthenticated) {
    authStore.role = role;
  }
  router.push('/dashboard');
};
</script>

<style scoped>
.font-sans {
  font-family: 'Kanit', sans-serif;
}
</style>
