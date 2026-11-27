import React, { useState, useEffect } from 'react';
import { PedagangSidebar } from '@/components/layout/PedagangSidebar';
import { PedagangHeader } from '@/components/layout/PedagangHeader';
import { LocationPicker } from '@/components/map/LocationPicker';
import { fetchMyVendorApi, updateMyVendorApi } from '@/lib/api';
import { addOrUpdateVendor } from '@/lib/store';
import { DISTRICTS } from '@/lib/data';
import { MapPin, CheckCircle2, ShieldAlert, Loader2 } from 'lucide-react';

export const PedagangLocationPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [vendorId, setVendorId] = useState('PKL-001');
  const [district, setDistrict] = useState(DISTRICTS[0]?.name || 'Tanjung Karang Pusat');
  const [subDistrict, setSubDistrict] = useState(DISTRICTS[0]?.subDistricts[0] || 'Palapa');
  const [address, setAddress] = useState('Jl. R.A. Kartini No. 45');
  const [latitude, setLatitude] = useState(-5.4215);
  const [longitude, setLongitude] = useState(105.2582);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function loadData() {
      try {
        const v = await fetchMyVendorApi();
        if (mounted && v) {
          setVendorId(v.id);
          if (v.district) setDistrict(v.district);
          if (v.subDistrict) setSubDistrict(v.subDistrict);
          if (v.address) setAddress(v.address);
          if (typeof v.latitude === 'number') setLatitude(v.latitude);
          if (typeof v.longitude === 'number') setLongitude(v.longitude);
        }
      } catch (err) {
        // Fallback silently
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const currentDistrictObj = DISTRICTS.find((d) => d.name === district) || DISTRICTS[0];

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const payload = {
      district,
      subDistrict,
      address,
      latitude,
      longitude,
    };

    try {
      await updateMyVendorApi(payload);
      addOrUpdateVendor({
        id: vendorId,
        ...payload,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } catch (err) {
      addOrUpdateVendor({
        id: vendorId,
        ...payload,
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3500);
    } finally {
      setSaving(false);
    }
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
              <span>Titik koordinat dan alamat berjualan Anda berhasil diperbarui ke sistem!</span>
            </div>
          )}

          <div className="p-3.5 bg-surface-container-low border border-border-subtle rounded-xl text-xs text-text-primary flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <strong>Informasi Ketentuan Lokasi:</strong> Penentuan titik lapak pada peta digunakan untuk memudahkan pembeli menemukan usaha Anda dan membantu verifikasi dinas. Penandaan ini tidak otomatis memberikan izin penggunaan fasilitas umum atau jalan.
            </div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-text-muted flex flex-col items-center justify-center gap-2">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm">Memuat lokasi lapak...</p>
            </div>
          ) : (
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
                        const newDist = e.target.value;
                        setDistrict(newDist);
                        const dObj = DISTRICTS.find((d) => d.name === newDist);
                        if (dObj && dObj.subDistricts.length > 0) {
                          setSubDistrict(dObj.subDistricts[0]);
                        }
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
                  disabled={saving}
                  className="px-6 py-2.5 bg-primary hover:bg-primary-hover text-white font-semibold text-sm rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-2"
                >
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>{saving ? 'Menyimpan...' : 'Simpan Titik Lokasi'}</span>
                </button>
              </div>
            </form>
          )}
        </main>
      </div>
    </div>
  );
};
