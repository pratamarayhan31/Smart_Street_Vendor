import React, { useEffect, useRef, useState } from 'react';
import { Vendor } from '@/types';
import { Loader2, MapPin, Compass } from 'lucide-react';

interface LeafletMapProps {
  vendors: Vendor[];
  selectedVendor?: Vendor | null;
  onSelectVendor?: (vendor: Vendor) => void;
  height?: string;
  interactive?: boolean;
}

declare global {
  interface Window {
    L: any;
  }
}

export const LeafletMap: React.FC<LeafletMapProps> = ({
  vendors,
  selectedVendor,
  onSelectVendor,
  height = '500px',
  interactive = true,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersLayerRef = useRef<any>(null);
  const markerMapRef = useRef<Record<string, any>>({});
  
  const [isLeafletReady, setIsLeafletReady] = useState<boolean>(() => {
    return typeof window !== 'undefined' && !!window.L;
  });
  const [loadError, setLoadError] = useState<string | null>(null);

  // 1. Memastikan Leaflet Library Ter-load dengan Benar
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (window.L) {
      setIsLeafletReady(true);
      return;
    }

    let isMounted = true;

    const loadLeafletAssets = async () => {
      if (!document.getElementById('leaflet-css-fallback')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css-fallback';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = () => {
          if (isMounted) setIsLeafletReady(true);
        };
        script.onerror = () => {
          const fallbackScript = document.createElement('script');
          fallbackScript.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
          fallbackScript.onload = () => {
            if (isMounted) setIsLeafletReady(true);
          };
          fallbackScript.onerror = () => {
            if (isMounted) setLoadError('Gagal memuat pustaka peta. Periksa koneksi internet.');
          };
          document.body.appendChild(fallbackScript);
        };
        document.body.appendChild(script);
      }
    };

    loadLeafletAssets();

    const interval = setInterval(() => {
      if (window.L) {
        setIsLeafletReady(true);
        clearInterval(interval);
      }
    }, 200);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  // 2. Inisialisasi Peta & Sinkronisasi Markers
  useEffect(() => {
    if (!isLeafletReady || !mapContainerRef.current) return;
    if (typeof window === 'undefined' || !window.L) return;

    const L = window.L;

    if (!mapInstanceRef.current) {
      try {
        const map = L.map(mapContainerRef.current, {
          center: [-5.4297, 105.2625],
          zoom: 13,
          zoomControl: false,
          scrollWheelZoom: interactive,
          attributionControl: true,
        });

        L.control.zoom({ position: 'topright' }).addTo(map);

        const osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &bull; Smart Street Vendor Bandar Lampung',
        });

        osmLayer.addTo(map);

        markersLayerRef.current = L.layerGroup().addTo(map);
        mapInstanceRef.current = map;

        setTimeout(() => {
          if (mapInstanceRef.current) {
            mapInstanceRef.current.invalidateSize();
          }
        }, 150);
      } catch (err) {
        console.error('Error creating Leaflet map:', err);
      }
    }

    const map = mapInstanceRef.current;
    if (!map) return;

    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();
    markerMapRef.current = {};

    // Marker dengan palet Merah Utama (#C62828), Kuning (#D97706), Oranye (#EA580C)
    const createCustomIcon = (status: string, isSelected: boolean) => {
      let bg = '#C62828'; // merah utama untuk terverifikasi resmi
      if (status === 'menunggu') bg = '#D97706'; // kuning
      if (status === 'revisi') bg = '#EA580C'; // oranye
      if (status === 'ditolak') bg = '#718096'; // abu gelap

      const size = isSelected ? 40 : 32;
      const border = isSelected ? '3px solid #DCEEFF' : '2px solid #FFFFFF';
      const shadow = isSelected 
        ? 'box-shadow: 0 0 0 5px rgba(198, 40, 40, 0.4), 0 8px 15px rgba(38, 52, 69, 0.3);' 
        : 'box-shadow: 0 4px 8px rgba(38, 52, 69, 0.25);';

      const html = `
        <div style="background-color: ${bg}; width: ${size}px; height: ${size}px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; ${border}; ${shadow} transition: all 0.25s ease;">
          <svg width="${size * 0.55}" height="${size * 0.55}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
        </div>
      `;

      return L.divIcon({
        className: 'custom-vendor-pin',
        html: html,
        iconSize: [size, size],
        iconAnchor: [size / 2, size / 2],
        popupAnchor: [0, -(size / 2 + 4)],
      });
    };

    const bounds: [number, number][] = [];

    vendors.forEach((vendor) => {
      if (!vendor.latitude || !vendor.longitude) return;

      const isSelected = selectedVendor?.id === vendor.id;
      const marker = L.marker([vendor.latitude, vendor.longitude], {
        icon: createCustomIcon(vendor.status, isSelected),
        zIndexOffset: isSelected ? 1000 : 0,
      });

      const popupHtml = `
        <div style="width: 240px; font-family: Inter, system-ui, sans-serif;">
          <div style="position: relative; width: 100%; height: 110px; border-radius: 8px; overflow: hidden; margin-bottom: 8px; background: #F2F8FF;">
            <img src="${vendor.photoUrl}" alt="${vendor.businessName}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'" />
          </div>
          <div style="font-size: 10px; font-weight: 700; color: #C62828; text-transform: uppercase; margin-bottom: 2px;">
            ${vendor.category}
          </div>
          <div style="font-size: 14px; font-weight: 700; color: #263445; margin-bottom: 4px; line-height: 1.3;">
            ${vendor.businessName}
          </div>
          <div style="font-size: 11px; color: #718096; margin-bottom: 6px;">
            📍 <b>${vendor.district}</b> &bull; ${vendor.address}
          </div>
          <div style="font-size: 11px; color: #263445; margin-bottom: 8px;">
            ⏰ ${vendor.operatingHours || '16:00 - 22:00 WIB'}
          </div>
          <button id="btn-popup-${vendor.id}" style="width: 100%; background-color: #C62828; color: white; border: none; border-radius: 6px; padding: 7px 10px; font-size: 11px; font-weight: 600; cursor: pointer; transition: background 0.2s;">
            Buka Detail Usaha
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml);

      marker.on('click', () => {
        if (onSelectVendor) onSelectVendor(vendor);
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-popup-${vendor.id}`);
        if (btn && onSelectVendor) {
          btn.onclick = () => onSelectVendor(vendor);
        }
      });

      marker.addTo(markersLayer);
      markerMapRef.current[vendor.id] = marker;
      bounds.push([vendor.latitude, vendor.longitude]);
    });

    map.invalidateSize();

    const handleResize = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isLeafletReady, vendors, interactive]);

  useEffect(() => {
    if (!mapInstanceRef.current || !selectedVendor) return;
    const map = mapInstanceRef.current;

    if (selectedVendor.latitude && selectedVendor.longitude) {
      map.flyTo([selectedVendor.latitude, selectedVendor.longitude], 16, {
        duration: 1.0,
      });

      const targetMarker = markerMapRef.current[selectedVendor.id];
      if (targetMarker) {
        setTimeout(() => {
          targetMarker.openPopup();
        }, 500);
      }
    }
  }, [selectedVendor]);

  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([-5.4297, 105.2625], 13, { duration: 0.8 });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[480px] overflow-hidden rounded-xl border border-border-subtle shadow-soft bg-surface-container-low flex flex-col">
      {!isLeafletReady && !loadError && (
        <div className="absolute inset-0 z-30 bg-surface-container-low flex flex-col items-center justify-center gap-3 text-text-muted">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <span className="text-xs font-semibold text-text-primary">Memuat Peta Spasial Kota Bandar Lampung...</span>
        </div>
      )}

      {loadError && (
        <div className="absolute inset-0 z-30 bg-white flex flex-col items-center justify-center gap-3 p-6 text-center text-text-primary">
          <MapPin className="w-10 h-10 text-primary" />
          <p className="text-sm font-bold">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-hover shadow-soft"
          >
            Muat Ulang Halaman
          </button>
        </div>
      )}

      <div
        ref={mapContainerRef}
        className="w-full h-full flex-1 min-h-[480px]"
        style={{ minHeight: height === '100%' ? '480px' : height }}
      />

      {/* Kontrol Cepat di Peta */}
      <div className="absolute top-4 left-4 z-[990]">
        <button
          onClick={handleResetView}
          className="bg-white hover:bg-surface-container-low text-text-primary text-xs font-bold px-3 py-1.5 rounded-lg border border-border-subtle shadow-soft flex items-center gap-1.5 transition-colors"
          title="Kembalikan fokus ke pusat Kota Bandar Lampung"
        >
          <Compass className="w-3.5 h-3.5 text-primary" />
          <span>Kota Bandar Lampung</span>
        </button>
      </div>

      {/* Legenda Status Pin */}
      <div className="absolute bottom-4 left-4 z-[990] bg-white/95 backdrop-blur-xs p-3 rounded-xl border border-border-subtle shadow-card text-[11px] text-text-primary space-y-1.5">
        <div className="font-bold border-b border-border-subtle pb-1 mb-1 flex items-center gap-1.5 text-text-primary">
          <MapPin className="w-3.5 h-3.5 text-primary" />
          <span>Status Lapak PKL</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
          <span>Terverifikasi (Resmi)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
          <span>Menunggu Pemeriksaan</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-slate-500 inline-block" />
          <span>Ditolak / Non-Zonasi</span>
        </div>
      </div>
    </div>
  );
};
