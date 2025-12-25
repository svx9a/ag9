<template>
  <footer class="bg-slate-950 text-white pt-24 pb-12 relative overflow-hidden">
    <!-- Background Glow for Atomic Feel -->
    <div class="absolute -top-24 -left-24 w-96 h-96 bg-emerald-600/10 rounded-full blur-[100px]"></div>
    <div class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[120px]"></div>

    <div class="max-w-7xl mx-auto px-6 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
        <!-- Brand Identity -->
        <div class="space-y-8">
          <div class="flex items-center gap-3">
            <img src="@/landing-v3/assets/logo.png" alt="Smart Farming Logo" class="h-16 w-auto" />
          </div>
          <p class="text-slate-400 text-sm font-medium leading-relaxed max-w-xs">
            Empowering the next generation of farmers with autonomous technology and data-driven intelligence.
          </p>
          <!-- Social Channels (Thai Similarity: Facebook & LINE) -->
          <div class="flex gap-4">
            <a v-for="social in socialLinks" :key="social.name" :href="social.url"
               class="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-emerald-600 hover:border-emerald-500 transition-all group">
              <component :is="social.icon" :size="20" class="text-slate-400 group-hover:text-white" />
            </a>
          </div>
        </div>

        <!-- Navigation Columns -->
        <div v-for="col in navigationGroups" :key="col.title">
          <h4 class="text-xs font-black uppercase tracking-[0.2em] text-emerald-500 mb-8">{{ $t(`footer.${col.key}`) }}</h4>
          <ul class="space-y-4">
            <li v-for="item in col.links" :key="item.label">
              <a :href="item.url" class="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-2 group">
                <span class="w-1.5 h-1.5 bg-emerald-500/0 group-hover:bg-emerald-500 rounded-full transition-all"></span>
                {{ $t(`footer.${item.key}`) }}
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact & Location (Thai Similarity) -->
        <div>
          <h4 class="text-xs font-black uppercase tracking-[0.2em] text-emerald-500 mb-8">{{ $t('footer.contact') }}</h4>
          <ul class="space-y-6">
            <li class="flex gap-4 items-start">
              <div class="w-10 h-10 shrink-0 bg-white/5 rounded-xl flex items-center justify-center text-emerald-500 border border-white/10">
                <MapPin :size="18" />
              </div>
              <div class="text-sm">
                <div class="font-bold text-white mb-1">Headquarters</div>
                <div class="text-slate-400 font-medium leading-relaxed">{{ $t('footer.address') }}</div>
              </div>
            </li>
            <li class="flex gap-4 items-start">
              <div class="w-10 h-10 shrink-0 bg-white/5 rounded-xl flex items-center justify-center text-emerald-500 border border-white/10">
                <Phone :size="18" />
              </div>
              <div class="text-sm">
                <div class="font-bold text-white mb-1">Direct Line</div>
                <div class="text-slate-400 font-medium">{{ $t('footer.phone') }}</div>
              </div>
            </li>
          </ul>
        </div>
      </div>

      <!-- Legal & Copyright -->
      <div class="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
        <div class="flex flex-col md:flex-row items-center gap-8">
          <div class="flex flex-wrap justify-center gap-8 text-[11px] font-black uppercase tracking-widest text-slate-500">
            <a href="#" class="hover:text-emerald-500 transition-colors">{{ $t('footer.privacy') }}</a>
            <a href="#" class="hover:text-emerald-500 transition-colors">{{ $t('footer.terms') }}</a>
            <a href="#" class="hover:text-emerald-500 transition-colors">Cookies</a>
          </div>
          <!-- Thai Trust Badge Mockup -->
          <div class="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10">
            <div class="w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center text-[8px] font-black text-slate-900">DBD</div>
            <span class="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Registered Hub</span>
          </div>
        </div>
        <div class="flex flex-col items-center md:items-end gap-2">
          <p class="text-slate-600 text-[11px] font-bold uppercase tracking-widest">
            {{ $t('footer.rights') }}
          </p>
          <!-- Payment Icons (Thai Similarity) -->
          <div class="flex gap-3 opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-500">
            <div class="text-[10px] font-black px-2 py-0.5 border border-white rounded text-white">PromptPay</div>
            <div class="text-[10px] font-black px-2 py-0.5 border border-white rounded text-white">VISA</div>
            <div class="text-[10px] font-black px-2 py-0.5 border border-white rounded text-white">MASTERCARD</div>
          </div>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup>
import {
  Facebook,
  MessageCircle, // Representing LINE
  Instagram,
  Youtube,
  MapPin,
  Phone,
  Mail
} from 'lucide-vue-next';

const socialLinks = [
  { name: 'Facebook', icon: Facebook, url: '#' },
  { name: 'LINE', icon: MessageCircle, url: '#' },
  { name: 'Instagram', icon: Instagram, url: '#' },
  { name: 'Youtube', icon: Youtube, url: '#' }
];

const navigationGroups = [
  {
    key: 'products',
    links: [
      { key: 'about', url: '#' },
      { key: 'news', url: '#' },
      { key: 'careers', url: '#' }
    ]
  },
  {
    key: 'support',
    links: [
      { key: 'help_center', url: '#' },
      { key: 'service_centers', url: '#' },
      { key: 'academy', url: '#' },
      { key: 'safety', url: '#' }
    ]
  }
];
</script>

<style scoped>
footer {
  font-family: 'Kanit', sans-serif;
}
</style>
