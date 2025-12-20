import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import { Drone } from '../types';
import { Navigation, Wind, Layers } from 'lucide-react';

interface DroneMapProps {
  drones: Drone[];
  isSidebarOpen: boolean;
}

const DroneMap: React.FC<DroneMapProps> = ({ drones, isSidebarOpen }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const clusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const fieldLayerRef = useRef<L.LayerGroup | null>(null);
  const flightPathRef = useRef<L.Polyline | null>(null);

  const [selectedDroneId, setSelectedDroneId] = useState<string | null>(null);

  // Initialize Map with Satellite Tiles
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [13.7563, 100.5018], // Thailand Center (Bangkok approx)
        zoom: 6,
        zoomControl: false,
        attributionControl: false,
      });

      // Esri World Imagery (Satellite)
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
        maxZoom: 19
      }).addTo(map);

      // CartoDB Light Labels (Overlay) - White text for visibility on satellite
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 20
      }).addTo(map);

      L.control.zoom({ position: 'bottomright' }).addTo(map);

      // Deselect on map click
      map.on('click', () => {
        setSelectedDroneId(null);
      });

      mapInstanceRef.current = map;
      fieldLayerRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        clusterGroupRef.current = null;
      }
    };
  }, []);

  // Handle Flight Path Drawing
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const drone = drones.find(d => d.id === selectedDroneId);

    // If no selection or drone not found, clear path
    if (!selectedDroneId || !drone) {
      if (flightPathRef.current) {
        flightPathRef.current.remove();
        flightPathRef.current = null;
      }
      return;
    }

    // Update or Create Path
    if (!flightPathRef.current) {
      flightPathRef.current = L.polyline(drone.pathHistory, {
        color: '#34d399', // Emerald 400 (Bright for satellite contrast)
        weight: 4,
        opacity: 0.9,
        dashArray: '10, 5',
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);
    } else {
      flightPathRef.current.setLatLngs(drone.pathHistory);
    }
    
  }, [selectedDroneId, drones]);

  // Update Markers & Fields
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // 1. Draw Simulated Fields
    if (fieldLayerRef.current) {
        fieldLayerRef.current.clearLayers();
        drones.forEach(d => {
            const lat = d.lat;
            const lng = d.lng;
            const offset = 0.005; 
            const fieldPoly = L.polygon([
                [lat - offset, lng - offset],
                [lat + offset, lng - offset],
                [lat + offset, lng + offset],
                [lat - offset, lng + offset]
            ], {
                color: d.ndvi < 0.5 ? '#facc15' : '#4ade80', // Bright Yellow / Bright Green
                weight: 2,
                fillOpacity: 0.2, // Lower opacity to see satellite details
                dashArray: '5, 5'
            });
            if (d.status !== 'Idle') {
                fieldLayerRef.current?.addLayer(fieldPoly);
            }
        });
    }

    // 2. Manage Clusters
    if (!clusterGroupRef.current) {
      const markers = L.markerClusterGroup({
        showCoverageOnHover: false,
        maxClusterRadius: 50,
        spiderfyOnMaxZoom: true,
        animate: true,
        iconCreateFunction: (cluster) => {
          const count = cluster.getChildCount();
          let size = 40;
          if (count > 10) size = 50;
          if (count > 50) size = 65;
          
          return L.divIcon({
            html: `<div class="cluster-inner backdrop-blur-sm bg-emerald-600/90 border-emerald-400"><span>${count}</span></div>`,
            className: 'custom-cluster-icon',
            iconSize: L.point(size, size)
          });
        }
      });
      map.addLayer(markers);
      clusterGroupRef.current = markers;
    }

    const markersGroup = clusterGroupRef.current;
    if (!markersGroup) return;
    markersGroup.clearLayers();

    drones.forEach((drone) => {
      // Agricultural Drone Icon
      const isSpraying = drone.status === 'Spraying';
      const isSelected = drone.id === selectedDroneId;
      // Brighter colors for satellite visibility
      const color = isSpraying ? '#34d399' : '#fbbf24'; // Emerald-400 vs Amber-400
      const ringColor = isSelected ? '#ffffff' : color;

      const droneHtml = `
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" class="drone-icon-svg w-10 h-10 drop-shadow-lg">
          <!-- Selection Ring -->
          ${isSelected ? `<circle cx="12" cy="12" r="11" stroke="#ffffff" stroke-width="2" stroke-dasharray="3 2" class="animate-spin-slow" />` : ''}

          <!-- Central Body -->
          <circle cx="12" cy="12" r="4" fill="${color}" fill-opacity="0.4" stroke="${ringColor}" stroke-width="2"/>
          <circle cx="12" cy="12" r="2" fill="${color}" stroke="#fff" stroke-width="1"/>
          
          <!-- Arms -->
          <path d="M12 8L12 4" stroke="${color}" stroke-width="2.5"/>
          <path d="M12 16L12 20" stroke="${color}" stroke-width="2.5"/>
          <path d="M15.5 10L19 8" stroke="${color}" stroke-width="2.5"/>
          <path d="M8.5 10L5 8" stroke="${color}" stroke-width="2.5"/>
          <path d="M15.5 14L19 16" stroke="${color}" stroke-width="2.5"/>
          <path d="M8.5 14L5 16" stroke="${color}" stroke-width="2.5"/>

          <!-- Propellers (White for visibility on dark map) -->
          <g class="drone-propeller" style="transform-origin: 12px 4px;"><rect x="8" y="3" width="8" height="2" rx="1" fill="#ffffff" fill-opacity="0.9" /></g>
          <g class="drone-propeller" style="transform-origin: 12px 20px;"><rect x="8" y="19" width="8" height="2" rx="1" fill="#ffffff" fill-opacity="0.9" /></g>
          <g class="drone-propeller" style="transform-origin: 19px 8px;"><rect x="15" y="7" width="8" height="2" rx="1" fill="#ffffff" fill-opacity="0.9" transform="rotate(30 19 8)"/></g>
          <g class="drone-propeller" style="transform-origin: 5px 8px;"><rect x="1" y="7" width="8" height="2" rx="1" fill="#ffffff" fill-opacity="0.9" transform="rotate(-30 5 8)"/></g>
          <g class="drone-propeller" style="transform-origin: 19px 16px;"><rect x="15" y="15" width="8" height="2" rx="1" fill="#ffffff" fill-opacity="0.9" transform="rotate(-30 19 16)"/></g>
          <g class="drone-propeller" style="transform-origin: 5px 16px;"><rect x="1" y="15" width="8" height="2" rx="1" fill="#ffffff" fill-opacity="0.9" transform="rotate(30 5 16)"/></g>
        </svg>
      `;

      const customIcon = L.divIcon({
        className: 'bg-transparent',
        html: droneHtml,
        iconSize: [40, 40],
        iconAnchor: [20, 20],
        popupAnchor: [0, -20]
      });

      const marker = L.marker([drone.lat, drone.lng], { icon: customIcon });

      // Click handler for selection
      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e); 
        setSelectedDroneId(drone.id);
      });

      // Ag Popup (Light Theme)
      const popupContent = `
        <div class="p-4 min-w-[280px] font-sans text-slate-800">
          <div class="flex items-center justify-between mb-3 border-b border-gray-100 pb-2">
            <div>
              <div class="font-bold text-emerald-700 text-lg tracking-tight">${drone.id}</div>
              <div class="text-[10px] text-gray-500 font-medium uppercase tracking-wider">${drone.manufacturer} • ${drone.cropType}</div>
            </div>
            <span class="text-xs px-2 py-0.5 rounded-full font-bold shadow-sm ${drone.status === 'Spraying' ? 'bg-emerald-100 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}">${drone.status}</span>
          </div>

          <!-- Technical Specs Section -->
          <div class="mb-4 bg-slate-50 rounded-lg p-3 border border-gray-100 shadow-inner">
            <div class="text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wide flex items-center gap-1">
              Performance Metrics
            </div>
            
            <div class="flex justify-between items-center text-xs mb-1.5">
               <span class="text-gray-500">Spraying Effectiveness</span>
               <span class="font-bold text-emerald-600">${drone.sprayingEffectiveness.toFixed(1)}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-1.5 mb-2.5">
               <div class="bg-emerald-500 h-1.5 rounded-full" style="width: ${drone.sprayingEffectiveness}%"></div>
            </div>

             <div class="flex justify-between items-center text-xs mb-1.5">
               <span class="text-gray-500">Chemical Mix Quality</span>
               <span class="font-bold text-blue-600">${drone.mixingQuality.toFixed(1)}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-1.5">
               <div class="bg-blue-500 h-1.5 rounded-full" style="width: ${drone.mixingQuality}%"></div>
            </div>
          </div>

          <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
             <div class="text-gray-500">NDVI Health</div>
             <div class="text-right font-bold ${drone.ndvi > 0.6 ? 'text-emerald-600' : 'text-amber-500'}">${drone.ndvi.toFixed(2)}</div>

             <div class="text-gray-500">Tank Level</div>
             <div class="text-right font-mono font-medium ${drone.tankLevel < 20 ? 'text-red-500' : 'text-slate-700'}">${drone.tankLevel}%</div>

             <div class="text-gray-500">Battery</div>
             <div class="text-right font-mono font-medium ${drone.battery < 20 ? 'text-red-500' : 'text-emerald-600'}">${drone.battery}%</div>
             
             <div class="text-gray-500">Altitude</div>
             <div class="text-right font-mono text-slate-700">${drone.altitude}m</div>
          </div>
          
          <div class="mt-3 pt-2 border-t border-gray-100 flex justify-between text-[10px] text-gray-400">
             <span>Field: ${drone.fieldId}</span>
             <span class="flex items-center gap-1"><span class="w-1.5 h-1.5 rounded-full bg-green-500"></span> Live</span>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        className: 'glass-popup',
        closeButton: false,
        maxWidth: 320
      });

      markersGroup.addLayer(marker);
    });

  }, [drones, selectedDroneId]);

  useEffect(() => {
    if (mapInstanceRef.current) {
      setTimeout(() => {
        mapInstanceRef.current?.invalidateSize();
      }, 300);
    }
  }, [isSidebarOpen]);

  return (
    <div className="relative h-full w-full rounded-xl overflow-hidden shadow-inner bg-slate-900 border border-slate-700">
      <div ref={mapContainerRef} className="h-full w-full z-0" />
      <div className="absolute top-4 right-4 z-[400] flex flex-col gap-2">
        <button 
          onClick={() => {
            const map = mapInstanceRef.current;
            if(map) map.setView([13.7563, 100.5018], 6);
            setSelectedDroneId(null);
          }}
          className="bg-white/90 text-emerald-800 p-2 rounded-lg border border-white/20 hover:bg-white transition-colors shadow-lg backdrop-blur"
          title="Reset Global View"
        >
          <Navigation size={20} />
        </button>
        <button 
           className="bg-white/90 text-emerald-800 p-2 rounded-lg border border-white/20 hover:bg-white transition-colors shadow-lg backdrop-blur"
           title="Layers"
        >
           <Layers size={20} />
        </button>
      </div>
      <div className="absolute bottom-4 left-4 z-[400] bg-black/50 backdrop-blur-md px-3 py-1.5 rounded-full text-[10px] text-white border border-white/10 shadow-lg flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
        <span className="font-bold tracking-wider">LIVE SATELLITE FEED</span>
      </div>
    </div>
  );
};

export default DroneMap;