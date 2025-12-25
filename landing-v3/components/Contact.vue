<template>
  <section class="py-24 bg-white">
    <div class="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16">
      <div>
        <h2 class="text-4xl font-bold text-slate-900 mb-8">{{ $t('sections.contact') }}</h2>
        <p class="text-lg text-slate-600 mb-10">
          Ready to elevate your farm? Contact our global team for a custom solution or find your nearest certified dealer.
        </p>
        
        <div class="space-y-6">
          <div v-for="item in contacts" :key="item.label" class="flex items-start gap-4">
            <div class="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600">
              <component :is="item.icon" class="w-6 h-6" />
            </div>
            <div>
              <div class="font-bold text-slate-900">{{ item.label }}</div>
              <div class="text-slate-500">{{ item.value }}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-slate-50 p-10 rounded-3xl border border-slate-100 shadow-sm">
        <form @submit.prevent="handleSubmit" class="space-y-6">
          <div class="grid grid-cols-2 gap-6">
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700">First Name</label>
              <input type="text" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="John" />
            </div>
            <div class="space-y-2">
              <label class="text-sm font-semibold text-slate-700">Last Name</label>
              <input type="text" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="Doe" />
            </div>
          </div>
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700">Email Address</label>
            <input type="email" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="john@example.com" />
          </div>
          <div class="space-y-2">
            <label class="text-sm font-semibold text-slate-700">Message</label>
            <textarea rows="4" class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all" placeholder="How can we help?"></textarea>
          </div>
          <button class="w-full py-4 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-900/10">
            Send Message
          </button>
        </form>
      </div>
    </div>
  </section>
</template>

<script setup>
import { MapPin, Mail, Phone } from 'lucide-vue-next';

const contacts = [
  { icon: MapPin, label: 'Global HQ', value: 'Bangkok, Thailand' },
  { icon: Mail, label: 'Email Support', value: 'hello@kasetgeny.global' },
  { icon: Phone, label: '24/7 Hotline', value: '+66 2 123 4567' }
];

const handleSubmit = () => {
  alert('Thank you! Our heroic team will contact you shortly.');
};
</script>
