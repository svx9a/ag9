<template>
  <div class="pt-24 min-h-screen bg-slate-50 font-sans">
    <section class="max-w-7xl mx-auto px-6 py-12">
      <!-- Header -->
      <div class="mb-12 text-center">
        <div class="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-black uppercase tracking-widest mb-6">
          <Zap class="w-4 h-4" />
          Atomic Powered AI
        </div>
        <h1 class="text-5xl font-black text-slate-900 mb-6 tracking-tighter uppercase">
          Intelligent <span class="text-emerald-600">Image Fill</span>
        </h1>
        <p class="text-xl text-slate-500 max-w-2xl mx-auto font-medium">
          Automatically detect and fill transparent or empty areas in your agricultural drone imagery using our advanced Laplacian diffusion algorithm.
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <!-- Controls Panel -->
        <div class="lg:col-span-4 space-y-8">
          <div class="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100">
            <h2 class="text-2xl font-black text-slate-900 mb-8 uppercase tracking-tight flex items-center gap-3">
              <Settings class="w-6 h-6 text-emerald-600" />
              Parameters
            </h2>

            <div class="space-y-6">
              <!-- Threshold -->
              <div>
                <div class="flex justify-between mb-2">
                  <label class="text-sm font-black text-slate-700 uppercase tracking-wider">Detection Threshold</label>
                  <span class="text-emerald-600 font-bold">{{ options.threshold }}</span>
                </div>
                <input type="range" v-model.number="options.threshold" min="0" max="255" class="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
                <p class="mt-2 text-xs text-slate-400 font-medium">Alpha value below which a pixel is considered "empty".</p>
              </div>

              <!-- Radius -->
              <div>
                <div class="flex justify-between mb-2">
                  <label class="text-sm font-black text-slate-700 uppercase tracking-wider">Search Radius</label>
                  <span class="text-emerald-600 font-bold">{{ options.radius }}px</span>
                </div>
                <input type="range" v-model.number="options.radius" min="1" max="10" class="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
                <p class="mt-2 text-xs text-slate-400 font-medium">How far to look for surrounding context pixels.</p>
              </div>

              <!-- Iterations -->
              <div>
                <div class="flex justify-between mb-2">
                  <label class="text-sm font-black text-slate-700 uppercase tracking-wider">Diffusion Passes</label>
                  <span class="text-emerald-600 font-bold">{{ options.iterations }}</span>
                </div>
                <input type="range" v-model.number="options.iterations" min="1" max="50" class="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
                <p class="mt-2 text-xs text-slate-400 font-medium">Higher values result in smoother fills but take longer.</p>
              </div>

              <!-- Blend Strength -->
              <div>
                <div class="flex justify-between mb-2">
                  <label class="text-sm font-black text-slate-700 uppercase tracking-wider">Edge Blending</label>
                  <span class="text-emerald-600 font-bold">{{ (options.blendStrength * 100).toFixed(0) }}%</span>
                </div>
                <input type="range" v-model.number="options.blendStrength" min="0" max="1" step="0.1" class="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600" />
                <p class="mt-2 text-xs text-slate-400 font-medium">How much to smooth the transition at the fill boundaries.</p>
              </div>
            </div>

            <div class="mt-10">
              <button 
                @click="processImage"
                :disabled="!hasImage || processing"
                class="w-full py-4 bg-slate-900 text-white font-black rounded-2xl hover:bg-emerald-600 disabled:bg-slate-200 disabled:cursor-not-allowed transition-all uppercase tracking-widest flex items-center justify-center gap-3"
              >
                <RefreshCw v-if="processing" class="w-5 h-5 animate-spin" />
                <Play v-else class="w-5 h-5" />
                {{ processing ? 'Processing...' : 'Run Atomic Fill' }}
              </button>
            </div>
          </div>

          <!-- Stats Card -->
          <div v-if="stats" class="bg-emerald-600 p-8 rounded-[2.5rem] shadow-xl text-white">
            <h3 class="text-xl font-black uppercase tracking-tight mb-4 flex items-center gap-3">
              <Activity class="w-6 h-6" />
              Performance
            </h3>
            <div class="grid grid-cols-2 gap-4">
              <div>
                <p class="text-emerald-100 text-xs font-black uppercase tracking-widest mb-1">Compute Time</p>
                <p class="text-2xl font-black">{{ stats.duration }}ms</p>
              </div>
              <div>
                <p class="text-emerald-100 text-xs font-black uppercase tracking-widest mb-1">Resolution</p>
                <p class="text-2xl font-black">{{ stats.width }}x{{ stats.height }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Canvas Area -->
        <div class="lg:col-span-8 space-y-8">
          <!-- Upload Box -->
          <div 
            v-if="!hasImage"
            @click="$refs.fileInput.click()"
            @dragover.prevent
            @drop.prevent="handleDrop"
            class="aspect-video bg-white border-4 border-dashed border-slate-200 rounded-[3rem] flex flex-col items-center justify-center cursor-pointer hover:border-emerald-400 hover:bg-emerald-50/50 transition-all group"
          >
            <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" class="hidden" />
            <div class="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Upload class="w-10 h-10 text-slate-400 group-hover:text-emerald-600" />
            </div>
            <p class="text-2xl font-black text-slate-900 uppercase tracking-tighter mb-2">Drop image or click</p>
            <p class="text-slate-400 font-medium uppercase tracking-widest text-sm">Supports JPEG, PNG, WebP</p>
          </div>

          <!-- Comparison View -->
          <div v-else class="space-y-8">
            <div class="flex justify-between items-center">
              <h3 class="text-2xl font-black text-slate-900 uppercase tracking-tight">Processing Canvas</h3>
              <button @click="reset" class="text-sm font-black text-slate-400 hover:text-red-500 uppercase tracking-widest flex items-center gap-2">
                <Trash2 class="w-4 h-4" /> Clear Canvas
              </button>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="space-y-4">
                <p class="text-xs font-black text-slate-400 uppercase tracking-widest px-4">Original / Mask Detection</p>
                <div class="bg-white p-4 rounded-[2rem] shadow-lg border border-slate-100 overflow-hidden">
                  <canvas ref="originalCanvas" class="w-full h-auto rounded-xl"></canvas>
                </div>
              </div>
              <div class="space-y-4">
                <p class="text-xs font-black text-emerald-600 uppercase tracking-widest px-4">Atomic Intelligent Fill</p>
                <div class="bg-white p-4 rounded-[2rem] shadow-lg border border-emerald-100 overflow-hidden">
                  <canvas ref="processedCanvas" class="w-full h-auto rounded-xl"></canvas>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div class="flex justify-center gap-6">
              <button 
                @click="downloadResult"
                class="px-10 py-4 bg-emerald-600 text-white font-black rounded-full hover:bg-emerald-500 transition-all shadow-lg shadow-emerald-900/20 flex items-center gap-3 uppercase tracking-widest"
              >
                <Download class="w-5 h-5" />
                Download Result
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { 
  Zap, 
  Settings, 
  Upload, 
  Trash2, 
  Play, 
  RefreshCw, 
  Activity, 
  Download 
} from 'lucide-vue-next';
import { AtomicImageProcessor } from '../services/image-processor';

const processor = new AtomicImageProcessor();
const fileInput = ref(null);
const originalCanvas = ref(null);
const processedCanvas = ref(null);

const hasImage = ref(false);
const processing = ref(false);
const stats = ref(null);

const options = reactive({
  threshold: 10,
  radius: 3,
  iterations: 20,
  blendStrength: 0.8
});

let originalImageData = null;

const handleFileChange = (e) => {
  const file = e.target.files[0];
  if (file) loadImage(file);
};

const handleDrop = (e) => {
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) loadImage(file);
};

const loadImage = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      hasImage.value = true;
      setupCanvases(img);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

const setupCanvases = (img) => {
  const canvases = [originalCanvas.value, processedCanvas.value];
  
  // Use a temporary canvas to get the full resolution image data
  const tempCanvas = document.createElement('canvas');
  tempCanvas.width = img.width;
  tempCanvas.height = img.height;
  const tempCtx = tempCanvas.getContext('2d');
  tempCtx.drawImage(img, 0, 0);
  originalImageData = tempCtx.getImageData(0, 0, img.width, img.height);

  // Set visible canvases dimensions
  canvases.forEach(canvas => {
    if (!canvas) return;
    canvas.width = img.width;
    canvas.height = img.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(img, 0, 0);
  });
};

const processImage = async () => {
  if (!processedCanvas.value || processing.value) return;
  
  processing.value = true;
  const startTime = performance.now();

  try {
    // Reset to original before processing
    const ctx = processedCanvas.value.getContext('2d');
    ctx.putImageData(originalImageData, 0, 0);

    // Run the intelligent fill
    await processor.intelligentFill(processedCanvas.value, { ...options });

    const endTime = performance.now();
    stats.value = {
      duration: Math.round(endTime - startTime),
      width: processedCanvas.value.width,
      height: processedCanvas.value.height
    };
  } catch (error) {
    console.error("Processing failed:", error);
  } finally {
    processing.value = false;
  }
};

const reset = () => {
  hasImage.value = false;
  stats.value = null;
  originalImageData = null;
};

const downloadResult = () => {
  if (!processedCanvas.value) return;
  const link = document.createElement('a');
  link.download = 'agriflight-filled-image.png';
  link.href = processedCanvas.value.toDataURL('image/png');
  link.click();
};
</script>

<style scoped>
.animate-fadeInUp {
  animation: fadeInUp 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

input[type=range]::-webkit-slider-thumb {
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  background: #10b981;
  cursor: pointer;
  border: 4px solid white;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}
</style>
