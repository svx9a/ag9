<template>
  <section class="py-32 relative overflow-hidden bg-white">
    <!-- Hyper-Parallel Background Gradients -->
    <div class="absolute inset-0 z-0">
      <div class="absolute top-0 left-1/3 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[150px] animate-pulse"></div>
      <div class="absolute bottom-0 right-1/3 w-[500px] h-[500px] bg-red-500/5 rounded-full blur-[150px] animate-pulse [animation-delay:3s]"></div>
      <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.03] grayscale"></div>
    </div>

    <div class="container mx-auto px-6 relative z-10">
      <div class="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

        <!-- Heroic Visual Terminal -->
        <div class="w-full lg:w-1/2 group relative">
          <!-- Atomic Energy Glow -->
          <div class="absolute -inset-8 bg-gradient-to-tr from-emerald-500 via-emerald-400 to-red-500 rounded-[3rem] opacity-10 blur-3xl group-hover:opacity-30 transition-all duration-1000 group-hover:rotate-3"></div>

          <div class="relative rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-[0_0_80px_rgba(16,185,129,0.1)] transform group-hover:scale-[1.01] transition-transform duration-700 backdrop-blur-3xl bg-white p-2">
            <img
              src="@/landing-v3/assets/promotion.png"
              alt="Special Promotion"
              class="w-full h-auto rounded-[2rem] object-cover"
            />

            <!-- Dynamic Overlay -->
            <div class="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent opacity-60"></div>

            <!-- Heroic Badge -->
            <div class="absolute bottom-6 left-6 flex items-center gap-3 bg-white/95 backdrop-blur-xl border border-slate-200 px-6 py-3 rounded-2xl shadow-2xl">
              <div class="w-3 h-3 bg-emerald-500 rounded-full animate-ping"></div>
              <span class="text-slate-900 font-black text-sm tracking-widest uppercase">{{ $t('promo.limited_offer') }}</span>
            </div>
          </div>

          <!-- Price Impact Badge -->
          <div class="absolute -top-10 -right-10 bg-white text-red-600 w-32 h-32 rounded-full flex flex-col items-center justify-center font-black rotate-12 shadow-[0_20px_40px_rgba(0,0,0,0.1)] border-4 border-red-600 animate-float z-20">
            <span class="text-xs uppercase tracking-tighter opacity-80">Atomic Save</span>
            <span class="text-3xl leading-none tracking-tighter">฿15K</span>
          </div>
        </div>

        <!-- Content Control Center -->
        <div class="w-full lg:w-1/2 space-y-10">
          <div class="inline-flex items-center gap-3 px-6 py-2 bg-white border border-emerald-500/20 rounded-full text-emerald-600 text-sm font-black uppercase tracking-[0.3em] shadow-sm">
            <Zap :size="16" class="animate-bounce" /> {{ $t('promo.badge') }}
          </div>

          <h2 class="text-5xl md:text-8xl font-black text-slate-900 leading-[0.9] tracking-tighter">
            {{ $t('promo.title_part1') }} <br/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-emerald-500 to-emerald-700">
              {{ $t('promo.title_part2') }}
            </span>
          </h2>

          <p class="text-2xl text-slate-600 leading-relaxed font-medium max-w-xl">
            {{ $t('promo.description') }}
          </p>

          <!-- Price & Features Core -->
          <div class="bg-slate-50 border border-slate-200 p-10 rounded-[3rem] relative overflow-hidden group/card shadow-xl">
            <div class="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/5 rounded-full blur-3xl group-hover/card:bg-emerald-500/10 transition-colors"></div>

            <div class="flex flex-col md:flex-row md:items-end gap-6 mb-10">
              <div class="space-y-1">
                <span class="text-slate-400 text-xl line-through font-black decoration-red-500/50">฿165,000</span>
                <div class="text-6xl md:text-8xl font-black text-slate-900 tracking-tighter flex items-start">
                  <span class="text-4xl mt-4 mr-2 text-emerald-600">฿</span>150,000
                </div>
              </div>
              <div class="bg-emerald-600 text-white px-4 py-1 rounded-lg text-xs font-black uppercase mb-4 shadow-lg">
                Best Price Guarantee
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div v-for="(feat, index) in promoFeatures" :key="index"
                   class="flex items-center gap-4 group/item">
                <div class="w-10 h-10 bg-white border border-slate-200 rounded-xl flex items-center justify-center group-hover/item:border-emerald-500/50 transition-colors shadow-sm">
                  <Check :size="20" class="text-emerald-600" />
                </div>
                <span class="text-lg font-bold text-slate-700 group-hover/item:text-slate-900 transition-colors">{{ feat }}</span>
              </div>
            </div>
          </div>

          <!-- Action Matrix -->
          <div class="flex flex-col sm:flex-row gap-6 pt-6 justify-center lg:justify-start">
            <button class="group h-20 px-16 bg-red-600 hover:bg-red-500 text-white rounded-[1.5rem] font-black text-2xl transition-all shadow-[0_20px_40px_rgba(220,38,38,0.2)] flex items-center justify-center gap-4 active:scale-95 w-full sm:w-auto">
              {{ $t('promo.cta') }}
              <ArrowRight :size="32" class="group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>

      </div>
    </div>
  </section>
</template>

<script setup>
import { Zap, ArrowRight, Check } from 'lucide-vue-next';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const promoFeatures = computed(() => [
  t('promo.feat1'),
  t('promo.feat2'),
  t('promo.feat3'),
  t('promo.feat4')
]);
</script>

<style scoped>
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(12deg); }
  50% { transform: translateY(-20px) rotate(15deg); }
}

.animate-float {
  animation: float 4s ease-in-out infinite;
}
</style>
