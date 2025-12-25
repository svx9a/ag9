<template>
  <div class="bg-slate-900 rounded-3xl p-6 shadow-xl border border-slate-800 h-full overflow-hidden">
    <div class="flex justify-between items-center mb-6">
      <div class="flex items-center gap-3">
        <div class="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
        <h3 class="text-lg font-bold text-white">Live FPV Feed</h3>
      </div>
      <div class="flex gap-2">
        <button @click="isRecording = !isRecording" 
                :class="isRecording ? 'bg-red-500 text-white animate-pulse' : 'bg-white/10 text-white'"
                class="px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all">
          {{ isRecording ? 'Stop Rec' : 'Start Rec' }}
        </button>
        <button class="bg-white/10 text-white p-1.5 rounded-lg hover:bg-white/20 transition-all">
          <Settings class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Live Stream Placeholder -->
    <div class="relative aspect-video bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 mb-6 group">
      <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80" 
           alt="Drone Feed" class="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000" />
      
      <!-- HUD Overlays -->
      <div class="absolute inset-0 p-4 pointer-events-none flex flex-col justify-between">
        <div class="flex justify-between items-start">
          <div class="space-y-1">
            <div class="text-[10px] font-mono text-emerald-400">ISO 100</div>
            <div class="text-[10px] font-mono text-emerald-400">1/1000s</div>
            <div class="text-[10px] font-mono text-emerald-400">f/2.8</div>
          </div>
          <div class="text-right">
            <div class="text-[10px] font-mono text-white bg-black/40 px-2 py-1 rounded">REC 00:42:15</div>
          </div>
        </div>
        
        <!-- Crosshair -->
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12">
          <div class="absolute top-1/2 left-0 w-4 h-0.5 bg-white/40"></div>
          <div class="absolute top-1/2 right-0 w-4 h-0.5 bg-white/40"></div>
          <div class="absolute top-0 left-1/2 w-0.5 h-4 bg-white/40"></div>
          <div class="absolute bottom-0 left-1/2 w-0.5 h-4 bg-white/40"></div>
        </div>

        <div class="flex justify-between items-end">
          <div class="flex gap-4">
            <div class="text-[10px] font-mono text-white">4K 60FPS</div>
            <div class="text-[10px] font-mono text-white">BITRATE: 45MBPS</div>
          </div>
          <div class="flex gap-2 pointer-events-auto">
            <button class="p-2 bg-black/60 rounded-full text-white hover:bg-black/80"><Camera class="w-4 h-4" /></button>
            <button class="p-2 bg-black/60 rounded-full text-white hover:bg-black/80"><Maximize class="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>

    <!-- Media Gallery -->
    <div>
      <div class="flex justify-between items-center mb-4">
        <span class="text-xs font-bold text-slate-500 uppercase tracking-widest">Recent Assets</span>
        <button class="text-[10px] text-emerald-400 font-bold hover:underline">View Gallery</button>
      </div>
      <div class="grid grid-cols-4 gap-2">
        <div v-for="i in 4" :key="i" class="aspect-square bg-slate-800 rounded-xl overflow-hidden border border-slate-700 hover:border-emerald-500/50 transition-all cursor-pointer">
          <img :src="`https://picsum.photos/200/200?random=${i}`" class="w-full h-full object-cover opacity-80 hover:opacity-100" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { Settings, Camera, Maximize } from 'lucide-vue-next';

const isRecording = ref(false);
</script>
