<template>
  <div class="min-h-screen bg-slate-50 pt-32 pb-20 px-4">
    <div class="max-w-6xl mx-auto">
      <div class="mb-12 text-center">
        <h1 class="text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">
          Atomic Image Processor
        </h1>
        <p class="text-slate-600 font-bold">
          Intelligent Mask Detection & Context-Aware Fill Core
        </p>
      </div>

      <div class="grid lg:grid-cols-2 gap-12">
        <!-- Controls -->
        <div class="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
          <div class="space-y-8">
            <div>
              <label class="block text-xs font-black uppercase tracking-widest text-slate-400 mb-4">
                1. Upload Target Image (PNG/WebP with transparency)
              </label>
              <div 
                @dragover.prevent 
                @drop.prevent="handleDrop"
                class="border-4 border-dashed border-slate-100 rounded-3xl p-12 text-center hover:border-emerald-500/30 transition-all group cursor-pointer"
                @click="$refs.fileInput.click()"
              >
                <input type="file" ref="fileInput" class="hidden" @change="handleFileChange" accept="image/*" />
                <div class="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Upload :size="32" class="text-slate-400 group-hover:text-emerald-500" />
                </div>
                <p class="text-sm font-black text-slate-500 uppercase tracking-tight">
                  Click or drag image here
                </p>
              </div>
            </div>

            <div class="space-y-6">
              <label class="block text-xs font-black uppercase tracking-widest text-slate-400">
                2. Atomic Parameters
              </label>
              
              <div class="space-y-4">
                <div v-for="(val, key) in options" :key="key" class="space-y-2">
                  <div class="flex justify-between text-[10px] font-black uppercase tracking-widest">
                    <span>{{ key }}</span>
                    <span class="text-emerald-600">{{ val }}</span>
                  </div>
                  <input 
                    type="range" 
                    v-model.number="options[key]" 
                    :min="getMin(key)" 
                    :max="getMax(key)" 
                    step="1"
                    class="w-full accent-emerald-500"
                  />
                </div>
              </div>
            </div>

            <button 
              @click="processImage"
              :disabled="!originalImage || processing"
              class="w-full py-6 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-600 disabled:opacity-50 disabled:hover:bg-slate-900 transition-all shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-3"
            >
              <Zap v-if="!processing" :size="20" />
              <Loader2 v-else :size="20" class="animate-spin" />
              {{ processing ? 'Processing Atomic Core...' : 'Execute Intelligent Fill' }}
            </button>
          </div>
        </div>

        <!-- Preview -->
        <div class="space-y-6">
          <div class="bg-white p-6 rounded-[2.5rem] shadow-xl border border-slate-100 h-full flex flex-col">
            <div class="flex items-center justify-between mb-6">
              <span class="text-[10px] font-black uppercase tracking-widest text-slate-400">Live Preview</span>
              <div v-if="processTime" class="text-[10px] font-black text-emerald-500 uppercase">
                Executed in {{ processTime }}ms
              </div>
            </div>
            
            <div class="flex-1 rounded-2xl overflow-hidden bg-slate-100 relative flex items-center justify-center border-2 border-slate-50">
              <img v-if="processedUrl" :src="processedUrl" class="max-w-full max-h-full object-contain shadow-2xl" />
              <div v-else class="text-center p-12">
                <ImageIcon :size="48" class="text-slate-300 mx-auto mb-4" />
                <p class="text-xs font-black text-slate-400 uppercase tracking-widest">Awaiting Atomic Input</p>
              </div>
            </div>

            <div v-if="processedUrl" class="mt-6 flex gap-4">
              <button 
                @click="downloadResult"
                class="flex-1 py-4 bg-emerald-50 text-emerald-600 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-100 transition-all"
              >
                Download Result
              </button>
              <button 
                @click="processedUrl = null"
                class="px-6 py-4 bg-slate-50 text-slate-400 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-slate-100 transition-all"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { Upload, Zap, Loader2, Image as ImageIcon } from 'lucide-vue-next';
import { atomicImageProcessor } from '../../services/image-processor';

const fileInput = ref(null);
const originalImage = ref(null);
const processedUrl = ref(null);
const processing = ref(false);
const processTime = ref(null);

const options = reactive({
  threshold: 10,
  radius: 2,
  iterations: 20,
  blendStrength: 8
});

const getMin = (key) => ({ threshold: 1, radius: 1, iterations: 1, blendStrength: 1 }[key]);
const getMax = (key) => ({ threshold: 255, radius: 10, iterations: 50, blendStrength: 10 }[key]);

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) {
    originalImage.value = file;
    const reader = new FileReader();
    reader.onload = (ev) => {
      processedUrl.value = ev.target.result;
    };
    reader.readAsDataURL(file);
  }
};

const handleDrop = (e) => {
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    originalImage.value = file;
    handleFileChange({ target: { files: [file] } });
  }
};

const processImage = async () => {
  if (!originalImage.value) return;
  
  processing.value = true;
  const start = performance.now();
  
  try {
    const result = await atomicImageProcessor.processImageFile(originalImage.value, {
      ...options,
      blendStrength: options.blendStrength / 10
    });
    processedUrl.value = result;
    processTime.value = (performance.now() - start).toFixed(2);
  } catch (error) {
    console.error("Atomic Processing Error:", error);
    alert("Atomic processing failed. Check console for telemetry.");
  } finally {
    processing.value = false;
  }
};

const downloadResult = () => {
  const link = document.createElement('a');
  link.download = `atomic-processed-${Date.now()}.png`;
  link.href = processedUrl.value;
  link.click();
};
</script>

<style scoped>
input[type="range"]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #10b981;
  cursor: pointer;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.4);
}
</style>
