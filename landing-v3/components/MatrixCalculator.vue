<template>
  <section class="py-24 bg-white overflow-hidden font-sans">
    <div class="container mx-auto px-6">
      <!-- Section Header -->
      <div class="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
        <div class="max-w-2xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            <BarChart3 :size="12" /> {{ $t('sections.matrix') }}
          </div>
          <h2 class="text-4xl md:text-6xl font-black text-slate-900 leading-[0.9] tracking-tighter uppercase">
            เปรียบเทียบสเปก <br/>
            <span class="text-emerald-500">& ความคุ้มค่า</span>
          </h2>
        </div>
        <p class="text-slate-500 font-bold max-w-xs text-sm leading-relaxed">
            ข้อมูลเชิงลึกเปรียบเทียบประสิทธิภาพระหว่างโดรนทั่วไปและโดรนจาก <span class="text-emerald-600 font-black">DRONE HUB</span>
          </p>
        </div>

        <!-- Comparison Table -->
        <div class="bg-slate-50 rounded-[3rem] overflow-hidden border border-slate-200 shadow-sm mb-12">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-900 text-white">
                <th class="p-8 text-xs font-black uppercase tracking-widest">หัวข้อเปรียบเทียบ</th>
                <th class="p-8 text-xs font-black uppercase tracking-widest text-center">รุ่น 20 ลิตร (ทั่วไป)</th>
                <th class="p-8 text-xs font-black uppercase tracking-widest text-center bg-emerald-600">รุ่น 6Ls (SF)</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-200">
              <tr v-for="(row, idx) in tableData" :key="idx" class="hover:bg-white transition-colors">
                <td class="p-8 text-slate-900 font-bold text-sm">{{ row.label }}</td>
                <td class="p-8 text-slate-500 text-center font-medium">{{ row.gen20 }}</td>
                <td class="p-8 text-emerald-700 text-center font-black bg-emerald-50/50">{{ row.sf }}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Replacement Text -->
        <div class="calculator-section bg-white p-8 md:p-16 rounded-[3rem] shadow-2xl relative overflow-hidden border-4 border-red-600 text-center">
          <div class="relative z-10">
            <div class="flex flex-col items-center justify-center gap-6">
              <div class="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center text-red-600 animate-pulse">
                <Zap :size="40" />
              </div>
              <h3 class="text-3xl md:text-5xl font-black text-slate-900 uppercase tracking-tighter leading-none">
                {{ $t('promo.limited_offer') }}
              </h3>
              <p class="text-xl text-slate-500 font-bold uppercase tracking-widest">
                Special Promotion Atomic Save ฿15K
              </p>
            </div>
          </div>

          <div class="mt-12 pt-8 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
            <p class="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
              * Limited time offer. Terms and conditions apply.
            </p>
            <div class="flex items-center gap-2 text-emerald-500 font-black text-xs uppercase tracking-widest">
              <ShieldCheck :size="14" />
              <span>Verified SF Standards</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  </template>

  <script setup>
  import { ref, computed } from 'vue';
  import { BarChart3, Zap, ShieldCheck } from 'lucide-vue-next';

  const tableData = [
    { label: 'ราคาแบตเตอรี่ (บาท)', gen20: '15,000 - 20,000', sf: '13,500 - 15,000' },
    { label: 'อัตราการฉีดพ่น (ลิตร/ไร่)', gen20: '4 - 5', sf: '3 - 3.5' },
    { label: 'ระยะฉีดพ่น (เมตร)', gen20: '2.5 - 3', sf: '1 - 1.5' },
    { label: 'พื้นที่ครอบคลุม (ต่อชุดแบต)', gen20: '6 - 10 ไร่', sf: '20 - 30 ไร่' },
    { label: 'ต้นทุนแบตเตอรี่ (2 ชุด)', gen20: '30,000 - 40,000 บาท', sf: '27,000 - 30,000 บาท' }
  ];
  </script>

<style scoped>
.calculator-section {
  background-image: radial-gradient(circle at 2px 2px, rgba(0,0,0,0.02) 1px, transparent 0);
  background-size: 24px 24px;
}
</style>
