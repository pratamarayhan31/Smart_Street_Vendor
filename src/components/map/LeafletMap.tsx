import React, { useEffect, useRef, useState } from 'react';
import { Vendor } from '@/types';
import { Loader2, MapPin, RefreshCw, ZoomIn, ZoomOut, Compass } from 'lucide-react';

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

    // Jika belum ada di window, load CSS & JS secara dinamis
    let isMounted = true;

    const loadLeafletAssets = async () => {
      // Pastikan CSS ada
      if (!document.getElementById('leaflet-css-fallback')) {
        const link = document.createElement('link');
        link.id = 'leaflet-css-fallback';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      // Pastikan JS dimuat
      if (!window.L) {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.async = true;
        script.onload = () => {
          if (isMounted) setIsLeafletReady(true);
        };
        script.onerror = () => {
          // Fallback ke CDN Cloudflare jika unpkg gagal
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

    // Fallback polling singkat jika script sudah ada di index.html tapi lambat diinisialisasi
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

    // Inisialisasi map instance jika belum dibuat
    if (!mapInstanceRef.current) {
      try {
        const map = L.map(mapContainerRef.current, {
          center: [-5.4297, 105.2625], // Pusat Kota Bandar Lampung
          zoom: 13,
          zoomControl: false, // Kita pasang kontrol zoom custom atau standar
          scrollWheelZoom: interactive,
          attributionControl: true,
        });

        // Kontrol zoom di kanan atas agar rapi
        L.control.zoom({ position: 'topright' }).addTo(map);

        // Tile Layer OpenStreetMap Resmi dengan fallback CartoDB
        const osmLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 19,
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &bull; Smart Street Vendor Bandar Lampung',
        });

        osmLayer.addTo(map);

        markersLayerRef.current = L.layerGroup().addTo(map);
        mapInstanceRef.current = map;

        // Invalidate size agar ukuran peta langsung proporsional
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

    // Helper Pembuat Ikon Marker Sesuai Status & Kategori
    const createCustomIcon = (status: string, isSelected: boolean) => {
      let bg = '#16A34A'; // hijau terverifikasi
      if (status === 'menunggu') bg = '#F59E0B'; // kuning
      if (status === 'revisi') bg = '#D97706'; // oranye
      if (status === 'ditolak') bg = '#DC2626'; // merah

      const size = isSelected ? 40 : 32;
      const border = isSelected ? '3px solid #2170E4' : '2px solid #FFFFFF';
      const shadow = isSelected 
        ? 'box-shadow: 0 0 0 5px rgba(33, 112, 228, 0.4), 0 8px 15px rgba(0,0,0,0.3);' 
        : 'box-shadow: 0 4px 8px rgba(0,0,0,0.25);';

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

    // Tambahkan setiap marker pedagang
    vendors.forEach((vendor) => {
      if (!vendor.latitude || !vendor.longitude) return;

      const isSelected = selectedVendor?.id === vendor.id;
      const marker = L.marker([vendor.latitude, vendor.longitude], {
        icon: createCustomIcon(vendor.status, isSelected),
        zIndexOffset: isSelected ? 1000 : 0,
      });

      const popupHtml = `
        <div style="width: 240px; font-family: Inter, system-ui, sans-serif;">
          <div style="position: relative; width: 100%; height: 110px; border-radius: 8px; overflow: hidden; margin-bottom: 8px; background: #e2e8f0;">
            <img src="${vendor.photoUrl}" alt="${vendor.businessName}" style="width: 100%; height: 100%; object-fit: cover;" onerror="this.src='https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80'" />
          </div>
          <div style="font-size: 10px; font-weight: 700; color: #0058BE; text-transform: uppercase; margin-bottom: 2px;">
            ${vendor.category}
          </div>
          <div style="font-size: 14px; font-weight: 700; color: #0F172A; margin-bottom: 4px; line-height: 1.3;">
            ${vendor.businessName}
          </div>
          <div style="font-size: 11px; color: #64748B; margin-bottom: 6px;">
            📍 <b>${vendor.district}</b> &bull; ${vendor.address}
          </div>
          <div style="font-size: 11px; color: #334155; margin-bottom: 8px;">
            ⏰ ${vendor.operatingHours || '16:00 - 22:00 WIB'}
          </div>
          <button id="btn-popup-${vendor.id}" style="width: 100%; background-color: #002548; color: white; border: none; border-radius: 6px; padding: 7px 10px; font-size: 11px; font-weight: 600; cursor: pointer; transition: background 0.2s;">
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

    // Invalidate size sekali lagi
    map.invalidateSize();

    // Event listener resize window agar peta selalu pas
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

  // 3. Efek Khusus Ketika Pedagang Dipilih di Panel Kiri (Poin 8)
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedVendor) return;
    const map = mapInstanceRef.current;

    if (selectedVendor.latitude && selectedVendor.longitude) {
      map.flyTo([selectedVendor.latitude, selectedVendor.longitude], 16, {
        duration: 1.0,
      });

      // Buka popup marker jika ada
      const targetMarker = markerMapRef.current[selectedVendor.id];
      if (targetMarker) {
        setTimeout(() => {
          targetMarker.openPopup();
        }, 500);
      }
    }
  }, [selectedVendor]);

  // Tombol Reset View ke Pusat Kota Bandar Lampung
  const handleResetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([-5.4297, 105.2625], 13, { duration: 0.8 });
    }
  };

  return (
    <div className="relative w-full h-full min-h-[480px] overflow-hidden rounded-xl border border-border-subtle shadow-xs bg-slate-100 flex flex-col">
      {/* Loading State saat Leaflet di-load */}
      {!isLeafletReady && !loadError && (
        <div className="absolute inset-0 z-30 bg-slate-50 flex flex-col items-center justify-center gap-3 text-slate-500">
          <Loader2 className="w-8 h-8 text-secondary animate-spin" />
          <span className="text-xs font-semibold">Memuat Peta Spasial Kota Bandar Lampung...</span>
        </div>
      )}

      {/* Error State */}
      {loadError && (
        <div className="absolute inset-0 z-30 bg-slate-50 flex flex-col items-center justify-center gap-3 p-6 text-center text-slate-600">
          <MapPin className="w-10 h-10 text-rose-500" />
          <p className="text-sm font-bold text-slate-800">{loadError}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-container"
          >
            Muat Ulang Halaman
          </button>
        </div>
      )}

      {/* Kontainer DOM Leaflet yang Sebenarnya */}
      <div
        ref={mapContainerRef}
        className="w-full h-full flex-1 min-h-[480px]"
        style={{ minHeight: height === '100%' ? '480px' : height }}
      />

      {/* Kontrol Cepat di Peta: Tombol Pusatkan Bandar Lampung */}
      <div className="absolute top-4 left-4 z-[990]">
        <button
          onClick={handleResetView}
          className="bg-white/95 hover:bg-white text-slate-800 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 shadow-md flex items-center gap-1.5 backdrop-blur-xs transition-colors"
          title="Kembalikan fokus ke pusat Kota Bandar Lampung"
        >
          <Compass className="w-3.5 h-3.5 text-secondary" />
          <span>Kota Bandar Lampung</span>
        </button>
      </div>

      {/* Legenda Status Pin di Kiri Bawah */}
      <div className="absolute bottom-4 left-4 z-[990] bg-white/95 backdrop-blur-xs p-2.5 rounded-xl border border-slate-200 shadow-md text-[11px] text-slate-700 space-y-1">
        <div className="font-bold text-slate-900 border-b border-slate-100 pb-1 mb-1 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-secondary" />
          <span>Status Lapak PKL</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 inline-block" />
          <span>Terverifikasi (Resmi)</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
          <span>Menunggu Pemeriksaan</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-600 inline-block" />
          <span>Ditolak / Non-Zonasi</span>
        </div>
      </div>
    </div>
  );
};
