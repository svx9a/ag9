<template>
  <Transition name="fade">
    <div v-if="isOpen" class="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-slate-950/80 backdrop-blur-xl" @click="close"></div>
      
      <!-- Modal Content -->
      <div class="relative w-full max-w-2xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20 animate-scaleIn">
        <!-- Progress Bar -->
        <div class="h-1.5 w-full bg-slate-100 flex">
          <div v-for="i in 4" :key="i" 
               class="h-full transition-all duration-500"
               :class="[step >= i ? 'bg-emerald-500' : 'bg-transparent']"
               :style="{ width: '25%' }"></div>
        </div>

        <div class="p-8 md:p-12">
          <!-- Close Button -->
          <button @click="close" class="absolute top-8 right-8 text-slate-400 hover:text-slate-900 transition-colors">
            <X :size="24" />
          </button>

          <!-- Step 1: Personal Info -->
          <div v-if="step === 1" class="space-y-8 animate-fadeIn">
            <div class="space-y-2">
              <div class="text-emerald-600 font-black text-xs uppercase tracking-[0.2em]">Step 01/04</div>
              <h3 class="text-3xl font-black text-slate-900 tracking-tight">Basic Registration</h3>
              <p class="text-slate-500 font-medium">Let's start with your farmer registration details.</p>
            </div>
            
            <div class="space-y-4">
              <div class="space-y-2">
                <label class="text-xs font-black uppercase tracking-widest text-slate-400">Farmer ID Number</label>
                <input type="text" v-model="formData.farmerId" placeholder="1-XXXX-XXXXX-XX-X" 
                       class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold" />
              </div>
              <div class="space-y-2">
                <label class="text-xs font-black uppercase tracking-widest text-slate-400">Farm Location</label>
                <select v-model="formData.province" class="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all font-bold">
                  <option value="" disabled>Select Province</option>
                  <option value="central">Central Thailand (Nakhon Nayok, etc.)</option>
                  <option value="north">Northern Thailand</option>
                  <option value="northeast">Isan Region</option>
                  <option value="south">Southern Thailand</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Step 2: Drone Selection -->
          <div v-else-if="step === 2" class="space-y-8 animate-fadeIn">
            <div class="space-y-2">
              <div class="text-emerald-600 font-black text-xs uppercase tracking-[0.2em]">Step 02/04</div>
              <h3 class="text-3xl font-black text-slate-900 tracking-tight">Select Your Fleet</h3>
              <p class="text-slate-500 font-medium">Which technology are you looking to finance?</p>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div v-for="drone in drones" :key="drone.id" 
                   @click="formData.drone = drone.id"
                   class="p-6 border-2 rounded-3xl cursor-pointer transition-all flex flex-col items-center text-center gap-4"
                   :class="[formData.drone === drone.id ? 'border-emerald-500 bg-emerald-50 shadow-lg shadow-emerald-100' : 'border-slate-100 hover:border-emerald-200']">
                <div class="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <component :is="drone.icon" :size="32" :class="formData.drone === drone.id ? 'text-emerald-600' : 'text-slate-400'" />
                </div>
                <div>
                  <div class="font-black text-slate-900 uppercase tracking-tight">{{ drone.name }}</div>
                  <div class="text-xs font-bold text-slate-400">{{ drone.price }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 3: Financial Check -->
          <div v-else-if="step === 3" class="space-y-8 animate-fadeIn">
            <div class="space-y-2">
              <div class="text-emerald-600 font-black text-xs uppercase tracking-[0.2em]">Step 03/04</div>
              <h3 class="text-3xl font-black text-slate-900 tracking-tight">Credit Assessment</h3>
              <p class="text-slate-500 font-medium">Estimate your repayment capability.</p>
            </div>
            
            <div class="space-y-6">
              <div class="space-y-4">
                <div class="flex justify-between items-end">
                  <label class="text-xs font-black uppercase tracking-widest text-slate-400">Requested Amount</label>
                  <div class="text-xl font-black text-emerald-600">฿{{ formData.amount.toLocaleString() }}</div>
                </div>
                <input type="range" v-model.number="formData.amount" min="100000" max="2000000" step="50000" class="w-full accent-emerald-500" />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="p-6 bg-slate-50 rounded-3xl">
                  <div class="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Estimated Interest</div>
                  <div class="text-lg font-black text-slate-900">3.5% p.a.</div>
                </div>
                <div class="p-6 bg-emerald-600 rounded-3xl text-white">
                  <div class="text-[10px] font-black text-emerald-200 uppercase tracking-widest mb-1">Monthly Pay</div>
                  <div class="text-lg font-black">฿{{ calculateMonthly() }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Step 4: Success/Summary -->
          <div v-else-if="step === 4" class="text-center space-y-8 animate-fadeIn">
            <div class="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 :size="48" />
            </div>
            <div class="space-y-2">
              <h3 class="text-3xl font-black text-slate-900 tracking-tight">Eligibility Confirmed!</h3>
              <p class="text-slate-500 font-medium">Your profile matches the BAAC CCAT program requirements.</p>
            </div>
            <div class="p-8 bg-slate-900 rounded-[2rem] text-left text-white space-y-4">
              <div class="flex justify-between items-center border-b border-white/10 pb-4">
                <span class="text-slate-400 text-xs font-bold uppercase">Program</span>
                <span class="font-black text-emerald-400">CCAT-2026</span>
              </div>
              <div class="flex justify-between items-center border-b border-white/10 pb-4">
                <span class="text-slate-400 text-xs font-bold uppercase">Interest Rate</span>
                <span class="font-black">MRR - 2.0%</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-slate-400 text-xs font-bold uppercase">Status</span>
                <span class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-[10px] font-black uppercase">
                  <span class="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span> Pre-Approved
                </span>
              </div>
            </div>
            <button @click="close" class="w-full py-5 bg-emerald-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-500 transition-all shadow-xl shadow-emerald-100">
              Download Official Letter (PDF)
            </button>
          </div>

          <!-- Footer Actions -->
          <div v-if="step < 4" class="mt-12 flex gap-4">
            <button v-if="step > 1" @click="step--" class="px-8 py-5 border border-slate-200 text-slate-600 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-slate-50 transition-all">
              Back
            </button>
            <button @click="nextStep" class="flex-1 py-5 bg-slate-900 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-3">
              {{ step === 3 ? 'Finalize Check' : 'Continue' }}
              <ArrowRight v-if="step < 3" :size="18" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { X, ArrowRight, ClipboardCheck, Plane, Cpu, Zap, CheckCircle2 } from 'lucide-vue-next';

const props = defineProps({
  isOpen: Boolean
});

const emit = defineEmits(['close']);

const step = ref(1);
const formData = reactive({
  farmerId: '',
  province: '',
  drone: 'kaset-pro',
  amount: 500000
});

const drones = [
  { id: 'kaset-pro', name: 'Drone Kraset Gen Y (Pro)', price: '฿450,000+', icon: Plane },
  { id: 'kaset-v1', name: 'Drone Kraset Gen Y (V1)', price: '฿320,000+', icon: Cpu },
  { id: 'greenday-z1', name: 'GreenDay Z1', price: '฿580,000+', icon: Zap },
  { id: 'custom-fleet', name: 'Custom Fleet', price: 'Negotiable', icon: ClipboardCheck }
];

const nextStep = () => {
  if (step.value < 4) step.value++;
};

const close = () => {
  step.value = 1;
  emit('close');
};

const calculateMonthly = () => {
  const rate = 0.035 / 12;
  const n = 60; // 5 years
  const p = formData.amount;
  const m = (p * rate * Math.pow(1 + rate, n)) / (Math.pow(1 + rate, n) - 1);
  return Math.round(m).toLocaleString();
};
</script>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.95) translateY(20px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}
.animate-scaleIn {
  animation: scaleIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fadeIn {
  animation: fadeIn 0.4s ease-out forwards;
}
</style>