import React, { useState, useEffect } from 'react';
import { PedagangSidebar } from '@/components/layout/PedagangSidebar';
import { PedagangHeader } from '@/components/layout/PedagangHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { fetchMyVendorApi } from '@/lib/api';
import { Vendor } from '@/types';
import { Link } from '@/lib/router';
import { 
  Store, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  FileText,
  Loader2
} from 'lucide-react';

export const PedagangDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [myVendor, setMyVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchMyVendorApi()
      .then((vendor) => {
        setMyVendor(vendor);
      })
      .catch((err) => {
        setError(err.message || 'Gagal memuat data lapak Anda.');
      })
      .finally(() => setLoading(false));
  }, []);

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
        <PedagangHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-5xl">
          {loading ? (
            <div className="bg-white rounded-2xl border border-border-subtle p-12 flex flex-col items-center justify-center gap-3 text-text-muted">
              <Loader2 className="w-7 h-7 text-primary animate-spin" />
              <span className="text-xs font-semibold">Memuat data usaha Anda...</span>
            </div>
          ) : error || !myVendor ? (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold">
              {error || 'Data lapak tidak ditemukan.'}
            </div>
          ) : (
          <>
          {/* Banner Selamat Datang */}
          <div className="bg-primary text-white rounded-2xl p-6 sm:p-8 shadow-card flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden">
            <div className="space-y-2 text-center sm:text-left relative z-10">
              <span className="text-xs font-bold text-white uppercase tracking-wider bg-white/15 px-2.5 py-1 rounded-full border border-white/25 inline-block">
                Layanan Mandiri PKL Kota Bandar Lampung
              </span>
              <h2 className="text-2xl font-bold">
                Selamat Datang, {myVendor.ownerName}
              </h2>
              <p className="text-xs sm:text-sm text-white/90 max-w-xl">
                Pantau perkembangan status verifikasi berkas dan perbarui informasi lokasi lapak Anda agar mudah ditemukan pelanggan.
              </p>
            </div>
            <div className="flex-shrink-0 relative z-10">
              <StatusBadge status={myVendor.status} size="lg" />
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-8 translate-y-8">
              <Store className="w-56 h-56 text-white" />
            </div>
          </div>

          {/* Kotak Peringatan Jika Ada Catatan Perbaikan */}
          {myVendor.notes && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-start gap-3 text-amber-900 shadow-xs">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-1 text-xs">
                <strong className="text-sm font-bold block">Perhatian: Catatan Perbaikan dari Petugas Admin</strong>
                <p>{myVendor.notes}</p>
                <Link
                  href="/pedagang/status"
                  className="font-semibold text-primary underline inline-block pt-1 hover:text-primary-hover"
                >
                  Perbaiki Data Sekarang &rarr;
                </Link>
              </div>
            </div>
          )}

          {/* Ringkasan Profil Lapak */}
          <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-card space-y-6">
            <div className="flex flex-col sm:flex-row gap-6">
              <img
                src={myVendor.photoUrl}
                alt={myVendor.businessName}
                className="w-full sm:w-44 h-40 rounded-xl object-cover border border-border-subtle shadow-xs"
              />
              <div className="flex-1 space-y-3">
                <div>
                  <span className="text-xs font-bold text-primary uppercase">
                    {myVendor.category}
                  </span>
                  <h3 className="text-xl font-bold text-text-primary">
                    {myVendor.businessName}
                  </h3>
                  <p className="text-xs text-text-muted mt-0.5">
                    ID Lapak: {myVendor.id}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-2 text-text-primary">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <span>{myVendor.district}, {myVendor.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text-primary">
                    <Clock className="w-4 h-4 text-text-muted flex-shrink-0" />
                    <span>{myVendor.operatingHours || '16:00 - 22:00 WIB'}</span>
                  </div>
                </div>

                <div className="pt-2 flex flex-wrap gap-2">
                  <Link
                    href="/pedagang/profil"
                    className="px-3.5 py-1.5 bg-surface-container-low hover:bg-surface-container text-text-primary text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 border border-border-subtle"
                  >
                    <span>Ubah Profil Usaha</span>
                  </Link>
                  <Link
                    href="/pedagang/lokasi"
                    className="px-3.5 py-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Atur Titik Peta</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Pintasan Aksi Mandiri */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Link
              href="/pedagang/profil"
              className="bg-white p-5 rounded-2xl border border-border-subtle hover:border-primary shadow-card transition-all space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-surface-container-low text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors border border-border-subtle">
                <Store className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                Data &amp; Foto Usaha
              </h4>
              <p className="text-xs text-text-muted">
                Perbarui nama usaha, deskripsi, foto lapak, dan nomor kontak.
              </p>
            </Link>

            <Link
              href="/pedagang/lokasi"
              className="bg-white p-5 rounded-2xl border border-border-subtle hover:border-primary shadow-card transition-all space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-surface-container-low text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors border border-border-subtle">
                <MapPin className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                Titik Lokasi Peta
              </h4>
              <p className="text-xs text-text-muted">
                Tentukan koordinat posisi lapak Anda pada peta digital Bandar Lampung.
              </p>
            </Link>

            <Link
              href="/pedagang/status"
              className="bg-white p-5 rounded-2xl border border-border-subtle hover:border-primary shadow-card transition-all space-y-2 group"
            >
              <div className="w-10 h-10 rounded-xl bg-surface-container-low text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors border border-border-subtle">
                <FileText className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-text-primary group-hover:text-primary transition-colors">
                Status Verifikasi
              </h4>
              <p className="text-xs text-text-muted">
                Pantau proses peninjauan petugas dan riwayat perbaikan data.
              </p>
            </Link>
          </div>
          </>
          )}
        </main>
      </div>
    </div>
  );
};

