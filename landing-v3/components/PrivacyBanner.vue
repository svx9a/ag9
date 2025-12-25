<template>
  <Transition name="slide-up">
    <div v-if="!accepted" class="fixed bottom-8 left-8 right-8 md:left-auto md:right-8 md:max-w-md z-[100]">
      <div class="bg-slate-900/95 backdrop-blur-xl border border-white/10 p-6 rounded-[2rem] shadow-2xl text-white">
        <div class="flex items-start gap-4 mb-4">
          <div class="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center shrink-0">
            <Shield class="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h4 class="font-black uppercase tracking-widest text-sm mb-1">Global Privacy Controls</h4>
            <p class="text-xs text-slate-400 leading-relaxed font-medium">
              We use cookies to enhance your experience and comply with GDPR/CCPA standards. Your data is encrypted and handled with atomic precision.
            </p>
          </div>
        </div>
        <div class="flex gap-3">
          <button @click="accept" class="flex-1 py-3 bg-emerald-500 hover:bg-emerald-400 text-white font-black rounded-xl text-[10px] uppercase tracking-widest transition-all">
            Accept All
          </button>
          <button @click="accept" class="px-6 py-3 bg-white/5 hover:bg-white/10 text-white font-black rounded-xl text-[10px] uppercase tracking-widest transition-all border border-white/10">
            Decline
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Shield } from 'lucide-vue-next';

const accepted = ref(true); // Default to true so it doesn't flicker if already set

onMounted(() => {
  const status = localStorage.getItem('agriflight_privacy_accepted');
  if (!status) {
    accepted.value = false;
  }
});

const accept = () => {
  localStorage.setItem('agriflight_privacy_accepted', 'true');
  accepted.value = true;
};
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%) scale(0.9);
  opacity: 0;
}
</style>
