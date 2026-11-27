import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';

interface LocationPickerProps {
  latitude: number;
  longitude: number;
  onChangeLocation: (lat: number, lng: number) => void;
  height?: string;
}

export const LocationPicker: React.FC<LocationPickerProps> = ({
  latitude,
  longitude,
  onChangeLocation,
  height = '380px',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  const [isLeafletReady, setIsLeafletReady] = useState<boolean>(() => {
    return typeof window !== 'undefined' && !!window.L;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.L) {
      setIsLeafletReady(true);
      return;
    }

    const interval = setInterval(() => {
      if (window.L) {
        setIsLeafletReady(true);
        clearInterval(interval);
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!isLeafletReady || !mapContainerRef.current) return;
    if (typeof window === 'undefined' || !window.L) return;

    const L = window.L;

    const currentLat = latitude || -5.4297;
    const currentLng = longitude || 105.2625;

    if (!mapInstanceRef.current) {
      try {
        const map = L.map(mapContainerRef.current, {
          center: [currentLat, currentLng],
          zoom: 14,
        });

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; OpenStreetMap kontributor | Penentuan Titik Lapak PKL',
          maxZoom: 19,
        }).addTo(map);

        // Marker kustom yang dapat digeser (draggable)
        const pinIcon = L.divIcon({
          className: 'custom-picker-pin',
          html: `
            <div style="background-color: #0058BE; width: 36px; height: 36px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; border: 3px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); cursor: grab;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
          `,
          iconSize: [36, 36],
          iconAnchor: [18, 36],
        });

        const marker = L.marker([currentLat, currentLng], {
          draggable: true,
          icon: pinIcon,
        }).addTo(map);

        marker.bindPopup('<b>Geser pin ini</b> ke lokasi tepat lapak Anda.').openPopup();

        marker.on('dragend', () => {
          const position = marker.getLatLng();
          onChangeLocation(Number(position.lat.toFixed(6)), Number(position.lng.toFixed(6)));
        });

        map.on('click', (e: any) => {
          marker.setLatLng(e.latlng);
          onChangeLocation(Number(e.latlng.lat.toFixed(6)), Number(e.latlng.lng.toFixed(6)));
        });

        mapInstanceRef.current = map;
        markerRef.current = marker;

        setTimeout(() => {
          map.invalidateSize();
        }, 150);
      } catch (err) {
        console.error('Error init picker map:', err);
      }
    } else {
      if (markerRef.current) {
        markerRef.current.setLatLng([currentLat, currentLng]);
      }
    }
  }, [isLeafletReady, latitude, longitude, onChangeLocation]);

  const handleCenterBandarLampung = () => {
    if (mapInstanceRef.current && markerRef.current) {
      const defaultLat = -5.4297;
      const defaultLng = 105.2625;
      mapInstanceRef.current.setView([defaultLat, defaultLng], 14);
      markerRef.current.setLatLng([defaultLat, defaultLng]);
      onChangeLocation(defaultLat, defaultLng);
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative rounded-xl overflow-hidden border border-border-subtle shadow-xs bg-slate-100 min-h-[380px]">
        {!isLeafletReady && (
          <div className="absolute inset-0 z-30 bg-slate-50 flex items-center justify-center gap-2 text-xs text-slate-500">
            <Loader2 className="w-5 h-5 text-secondary animate-spin" />
            <span>Memuat peta penentuan lokasi...</span>
          </div>
        )}
        <div ref={mapContainerRef} style={{ height, width: '100%' }} />
        <button
          type="button"
          onClick={handleCenterBandarLampung}
          className="absolute top-3 right-3 z-[1000] bg-white/95 hover:bg-white text-primary text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 shadow-md flex items-center gap-1.5"
        >
          <Navigation className="w-3.5 h-3.5 text-secondary" />
          Pusat Kota Bandar Lampung
        </button>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs">
        <div className="flex items-center gap-2 text-slate-700">
          <MapPin className="w-4 h-4 text-secondary flex-shrink-0" />
          <span>Klik pada peta atau geser pin biru ke lokasi lapak berjualan Anda.</span>
        </div>
        <div className="flex items-center gap-3 font-mono font-medium text-slate-800 bg-white px-2.5 py-1 rounded-md border border-slate-200">
          <span>Lat: {latitude || '-5.429700'}</span>
          <span className="text-slate-300">|</span>
          <span>Lng: {longitude || '105.262500'}</span>
        </div>
      </div>
    </div>
  );
};
