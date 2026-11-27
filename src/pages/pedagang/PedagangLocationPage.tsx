import React, { useState } from 'react';
import { PedagangSidebar } from '@/components/layout/PedagangSidebar';
import { PedagangHeader } from '@/components/layout/PedagangHeader';
import { LocationPicker } from '@/components/map/LocationPicker';
import { getStoredVendors, addOrUpdateVendor } from '@/lib/store';
import { DISTRICTS } from '@/lib/data';
import { Vendor } from '@/types';
import { MapPin, CheckCircle2, ShieldAlert } from 'lucide-react';

export const PedagangLocationPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vendors] = useState<Vendor[]>(() => getStoredVendors());

  const currentVendor = vendors[0] || {
    id: 'PKL-001',
    district: 'Tanjung Karang Pusat',
    subDistrict: 'Palapa',
    address: 'Jl. R.A. Kartini No. 45',
    latitude: -5.4215,
    longitude: 105.2582,
  };

  const [district, setDistrict] = useState(currentVendor.district);
  const [subDistrict, setSubDistrict] = useState(currentVendor.subDistrict || '');
  const [address, setAddress] = useState(currentVendor.address);
  const [latitude, setLatitude] = useState(currentVendor.latitude);
  const [longitude, setLongitude] = useState(currentVendor.longitude);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const currentDistrictObj = DISTRICTS.find((d) => d.name === district) || DISTRICTS[0];

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addOrUpdateVendor({
      id: currentVendor.id,
      district,
      subDistrict,
      address,
      latitude,
      longitude,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <div className="hidden md:flex flex-shrink-0">
        <PedagangSidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-900/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 w-64 h-full">
            <PedagangSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <PedagangHeader 
          title="Titik Lokasi Peta Berjualan" 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl">
          {savedSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Titik koordinat dan alamat berjualan Anda berhasil diperbarui!</span>
            </div>
          )}

          <div className="p-3.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-text-primary flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <strong>Informasi Ketentuan Lokasi:</strong> Penentuan titik lapak pada peta digunakan untuk memudahkan pembeli menemukan usaha Anda dan membantu verifikasi dinas. Penandaan ini tidak otomatis memberikan izin penggunaan fasilitas umum atau jalan.
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-card space-y-4">
              <div className="border-b border-border-subtle pb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-bold text-text-primary">Wilayah Administratif &amp; Alamat</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-text-primary mb-1">Kecamatan *</label>
                  <select
                    value={district}
                    onChange={(e) => {
                      setDistrict(e.target.value);
                      const dObj = DISTRICTS.find((d) => d.name === e.target.value);
                      if (dObj) setSubDistrict(dObj.subDistricts[0]);
                    }}
                    className="w-full bg-surface-container-low border border-border-subtle rounded-xl p-2.5 text-text-primary outline-none focus:bg-white focus:border-primary transition-all"
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-text-primary mb-1">Kelurahan *</label>
                  <select
                    value={subDistrict}
                    onChange={(e) => setSubDistrict(e.target.value)}
                    className="w-full bg-surface-container-low border border-border-subtle rounded-xl p-2.5 text-text-primary outline-none focus:bg-white focus:border-primary transition-all"
                  >
                    {currentDistrictObj.subDistricts.map((sub) => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-text-primary mb-1">Keterangan Alamat / Patokan Lengkap *</label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Contoh: Jl. R.A. Kartini No. 45 (Depan Apotek Enggal)"
                    className="w-full bg-surface-container-low border border-border-subtle rounded-xl p-2.5 text-text-primary outline-none focus:bg-white focus:border-primary transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Peta Interaktif Penentuan Pin */}
            <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-card space-y-4">
              <div className="border-b border-border-subtle pb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <h3 className="text-sm font-bold text-text-primary">Titik Koordinat Peta Spasial</h3>
                </div>
                <span className="text-[11px] text-text-muted">
                  Geser pin merah untuk menyesuaikan lokasi lapak
                </span>
              </div>

              <LocationPicker
                latitude={latitude}
                longitude={longitude}
                onChangeLocation={(lat, lng) => {
                  setLatitude(lat);
                  setLongitude(lng);
                }}
                height="420px"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                Simpan Titik Lokasi
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

