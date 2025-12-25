<template>
  <div class="space-y-8">
    <!-- Header Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div v-for="stat in statsDisplay" :key="stat.label"
           class="bg-emerald-950/40 backdrop-blur-2xl border border-emerald-500/30 rounded-[2.5rem] p-8 relative overflow-hidden group hover:border-emerald-500/60 transition-all shadow-2xl shadow-emerald-950/50">
        <div class="absolute -right-4 -top-4 w-24 h-24 bg-emerald-400/10 rounded-full blur-2xl group-hover:bg-emerald-400/20 transition-all"></div>
        <div class="relative z-10">
          <div class="text-emerald-400 text-[10px] font-black uppercase tracking-widest mb-3 opacity-80">{{ $t(`dashboard.affiliate.${stat.key}`) }}</div>
          <div class="text-4xl font-black text-white tracking-tighter flex items-baseline gap-1">
            <span class="text-xl text-emerald-500 font-bold" v-if="stat.prefix">{{ stat.prefix }}</span>
            {{ formatNumber(stat.value) }}
          </div>
          <div v-if="stat.subtext" class="text-emerald-500/60 text-[10px] font-bold mt-3 uppercase tracking-tighter">{{ $t(`dashboard.affiliate.${stat.subtext_key}`) }}</div>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Withdrawal Section -->
      <div class="bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-[3rem] p-12 relative overflow-hidden group">
        <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none"></div>
        <h3 class="text-2xl font-black text-white mb-10 uppercase tracking-tighter flex items-center gap-4">
          <div class="w-2.5 h-10 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/50"></div>
          {{ $t('dashboard.affiliate.withdraw_funds') }}
        </h3>

        <div class="space-y-8 relative z-10">
          <div class="p-8 bg-emerald-950/40 rounded-[2rem] border border-emerald-500/20 shadow-inner">
            <div class="text-xs text-emerald-400 font-black mb-4 uppercase tracking-widest opacity-70">{{ $t('dashboard.affiliate.available_withdraw') }}</div>
            <div class="text-5xl font-black text-white tracking-tighter">฿{{ formatNumber(stats.balance) }}</div>
          </div>

          <div class="space-y-6">
            <div class="relative">
              <label class="block text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3 ml-2">{{ $t('dashboard.affiliate.amount') }}</label>
              <div class="relative">
                <input v-model="withdrawAmount" type="number"
                       class="w-full bg-slate-950 border border-slate-700/50 rounded-2xl h-20 px-8 text-2xl font-black text-white focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all shadow-inner"
                       placeholder="0.00" />
                <div class="absolute right-8 top-1/2 -translate-y-1/2 text-slate-500 font-black text-lg">THB</div>
              </div>
            </div>

            <div class="flex items-start gap-3 p-4 bg-slate-950/50 rounded-2xl border border-slate-800">
              <Info class="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
              <p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                {{ $t('dashboard.affiliate.min_withdraw', { n: '฿500' }) }}
              </p>
            </div>

            <button @click="handleWithdraw"
                    :disabled="withdrawAmount < 500 || withdrawAmount > stats.balance"
                    class="w-full h-20 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed text-white rounded-2xl font-black text-xl transition-all shadow-2xl shadow-emerald-900/40 uppercase tracking-widest flex items-center justify-center gap-3">
              <Wallet class="w-6 h-6" />
              {{ $t('dashboard.affiliate.withdraw_now') }}
            </button>
          </div>
        </div>
      </div>

      <!-- Marketing Hub -->
      <div class="bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-[3rem] p-12 relative overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent pointer-events-none"></div>
        <h3 class="text-2xl font-black text-white mb-10 uppercase tracking-tighter flex items-center gap-4">
          <div class="w-2.5 h-10 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"></div>
          {{ $t('dashboard.affiliate.marketing_hub') }}
        </h3>

        <div class="space-y-8 relative z-10">
          <div class="p-8 bg-slate-950/40 rounded-[2rem] border border-slate-700/50 shadow-inner">
            <div class="text-xs text-slate-400 font-black mb-4 uppercase tracking-widest opacity-70">{{ $t('dashboard.affiliate.referral_link') }}</div>
            <div class="flex gap-3">
              <input readonly :value="referralLink"
                     class="flex-1 bg-slate-900 border border-slate-700/50 rounded-xl h-14 px-6 text-sm font-mono text-emerald-400 outline-none shadow-inner" />
              <button @click="copyLink" class="w-14 h-14 flex items-center justify-center bg-emerald-600 rounded-xl hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20 active:scale-95">
                <Copy class="w-6 h-6 text-white" />
              </button>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-6">
            <div v-for="asset in marketingAssets" :key="asset.name"
                 class="group relative aspect-video bg-slate-950 rounded-2xl overflow-hidden border border-slate-700/50 cursor-pointer shadow-lg hover:border-emerald-500/50 transition-all">
              <img :src="asset.preview" class="w-full h-full object-cover opacity-40 group-hover:opacity-60 group-hover:scale-110 transition-all duration-700" />
              <div class="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity">
                <div class="text-xs font-black text-white uppercase tracking-widest mb-2">{{ asset.name }}</div>
                <button class="flex items-center gap-2 text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:text-white transition-colors">
                  <Download class="w-3 h-3" />
                  {{ $t('dashboard.affiliate.download') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { Copy, Wallet, Info, Download } from 'lucide-vue-next';
import { useI18n } from 'vue-i18n';
import axios from 'axios';

const { t } = useI18n();

const stats = ref({
  balance: 0,
  total_earned: 0,
  total_referrals: 0,
  pending_commissions: 0
});

const withdrawAmount = ref(500);
const referralCode = ref('SF' + Math.random().toString(36).substring(7).toUpperCase());

const statsDisplay = computed(() => [
  { key: 'network_size', value: stats.value.total_referrals, subtext_key: 'direct_indirect' },
  { key: 'total_earned', value: stats.value.total_earned, prefix: '฿', subtext_key: 'lifetime' },
  { key: 'balance', value: stats.value.balance, prefix: '฿', subtext_key: 'available' },
  { key: 'pending', value: stats.value.pending_commissions, prefix: '฿', subtext_key: 'hold' }
]);

const referralLink = computed(() => `https://smartfarming.global/join?ref=${referralCode.value}`);

const marketingAssets = [
  { name: 'Banner v1', preview: '/landing-v3/assets/hero-kgy.jpg' },
  { name: 'Drone Specs', preview: '/landing-v3/assets/drone.png' },
  { name: 'Academy Intro', preview: '/landing-v3/assets/acedemy.jpg' },
  { name: 'Eco Promo', preview: '/landing-v3/assets/promotion.png' }
];

const fetchStats = async () => {
  try {
    const response = await axios.get('/api/affiliate/stats');
    stats.value = response.data;
  } catch (error) {
    console.error('Failed to fetch affiliate stats');
  }
};

const handleWithdraw = async () => {
  try {
    const response = await axios.post('/api/affiliate/withdraw', { amount: withdrawAmount.value });
    if (response.data.success) {
      alert(t('dashboard.affiliate.success'));
      fetchStats();
    } else {
      alert(response.data.message || t('dashboard.affiliate.failed'));
    }
  } catch (error) {
    alert(t('dashboard.affiliate.failed'));
  }
};

const copyLink = () => {
  navigator.clipboard.writeText(referralLink.value);
  alert(t('dashboard.affiliate.copied'));
};

const formatNumber = (num) => {
  return new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(num);
};

onMounted(fetchStats);
</script>

<style scoped>
.bg-emerald-900\/20 {
  background: rgba(6, 78, 59, 0.2);
}
</style>
