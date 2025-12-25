<template>
  <div class="pt-24 min-h-screen bg-white">
    <Contact />
    
    <!-- Map Section -->
    <section class="h-[400px] w-full bg-slate-200 relative overflow-hidden">
      <div class="absolute inset-0 flex items-center justify-center">
        <p class="text-slate-500 font-medium">Interactive Global Map Loading...</p>
      </div>
      <!-- Placeholder for actual map integration -->
      <img src="@/landing-v3/assets/dronehub3man.jpg" class="w-full h-full object-cover opacity-30" />
    </section>

    <!-- FAQ Section -->
    <section class="py-24 max-w-3xl mx-auto px-6">
      <h2 class="text-3xl font-bold mb-12 text-center">Frequently Asked Questions</h2>
      <div class="space-y-6">
        <div v-for="faq in faqs" :key="faq.q" class="p-6 bg-slate-50 rounded-2xl border border-slate-100">
          <h4 class="font-bold text-lg mb-3">{{ faq.q }}</h4>
          <p class="text-slate-600">{{ faq.a }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import Contact from '../components/Contact.vue';

const faqs = [
  { q: 'What drone brands are supported?', a: 'Currently we support Drone Kraset Gen Y series and TTA M-Series out of the box.' },
  { q: 'Do I need an internet connection to fly?', a: 'No, our system supports full offline operation with pre-downloaded maps and local data sync.' },
  { q: 'Is there a trial period?', a: 'Yes, we offer a 30-day free trial for our Enterprise dashboard with full feature access.' }
];
</script>
