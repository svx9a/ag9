<template>
  <div class="relative w-full h-full min-h-[400px] rounded-3xl overflow-hidden border border-slate-200 shadow-sm">
    <div ref="mapContainer" class="w-full h-full z-0"></div>
    
    <!-- Map Overlays -->
    <div class="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <button @click="toggleGeofence" 
              :class="geofenceEnabled ? 'bg-emerald-600 text-white' : 'bg-white text-slate-600'"
              class="p-2 rounded-lg shadow-md border border-slate-200 transition-all hover:scale-105">
        <ShieldCheck class="w-5 h-5" />
      </button>
      <button @click="resetView" class="p-2 bg-white text-slate-600 rounded-lg shadow-md border border-slate-200 hover:scale-105">
        <Target class="w-5 h-5" />
      </button>
    </div>

    <!-- Mission Status Overlay -->
    <div class="absolute bottom-4 left-4 z-[1000] bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-slate-100 max-w-xs">
      <div class="flex items-center gap-3 mb-2">
        <div class="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
        <span class="text-xs font-bold uppercase tracking-wider text-slate-500">Live Flight Path</span>
      </div>
      <div class="text-sm font-bold text-slate-900 mb-1">Mission: Rice Paddy Spraying</div>
      <div class="text-[10px] text-slate-500 font-medium">Location: Nakhon Nayok Central Hub</div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { ShieldCheck, Target } from 'lucide-vue-next';

const props = defineProps({
  dronePosition: {
    type: Object,
    default: () => ({ lat: 14.21, lng: 101.12 }) // Nakhon Nayok
  },
  path: {
    type: Array,
    default: () => []
  }
});

const mapContainer = ref(null);
let map = null;
let droneMarker = null;
let flightPath = null;
let geofence = null;
const geofenceEnabled = ref(true);

onMounted(() => {
  // Initialize map
  map = L.map(mapContainer.value).setView([props.dronePosition.lat, props.dronePosition.lng], 15);

  // Add Tile Layer (using a clean style)
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap contributors'
  }).addTo(map);

  // Custom Drone Icon
  const droneIcon = L.divIcon({
    className: 'custom-drone-icon',
    html: `<div class="w-8 h-8 bg-emerald-600 rounded-full border-4 border-white shadow-lg flex items-center justify-center">
             <svg class="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
               <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
             </svg>
           </div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  // Add Marker
  droneMarker = L.marker([props.dronePosition.lat, props.dronePosition.lng], { icon: droneIcon }).addTo(map);

  // Add Flight Path
  flightPath = L.polyline(props.path, { color: '#10b981', weight: 3, opacity: 0.6, dashArray: '5, 10' }).addTo(map);

  // Add Geofence (Example Circle)
  if (geofenceEnabled.value) {
    geofence = L.circle([14.21, 101.12], {
      color: '#ef4444',
      fillColor: '#ef4444',
      fillOpacity: 0.1,
      radius: 1000
    }).addTo(map);
  }

  // Force resize on load
  setTimeout(() => {
    map.invalidateSize();
  }, 100);
});

const toggleGeofence = () => {
  geofenceEnabled.value = !geofenceEnabled.value;
  if (geofenceEnabled.value) {
    geofence.addTo(map);
  } else {
    geofence.remove();
  }
};

const resetView = () => {
  map.setView([props.dronePosition.lat, props.dronePosition.lng], 15);
};

// Watch for position changes
watch(() => props.dronePosition, (newPos) => {
  if (droneMarker && map) {
    droneMarker.setLatLng([newPos.lat, newPos.lng]);
    // Optional: map.panTo([newPos.lat, newPos.lng]);
  }
}, { deep: true });

onUnmounted(() => {
  if (map) {
    map.remove();
  }
});
</script>

<style>
.custom-drone-icon {
  background: none !important;
  border: none !important;
}
</style>
