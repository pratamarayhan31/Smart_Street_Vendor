import React, { useState } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getStoredVendors, getStoredCategories } from '@/lib/store';
import { DISTRICTS } from '@/lib/data';
import { Vendor } from '@/types';
import { Link } from '@/lib/router';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  Tag, 
  Map, 
  FileText, 
  ArrowRight, 
  TrendingUp, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vendors] = useState<Vendor[]>(() => getStoredVendors());
  const [categories] = useState(() => getStoredCategories());

  // Perhitungan Metrik KPI
  const totalVendors = vendors.length;
  const verifiedCount = vendors.filter((v) => v.status === 'terverifikasi').length;
  const pendingCount = vendors.filter((v) => v.status === 'menunggu').length;
  const revisionCount = vendors.filter((v) => v.status === 'revisi').length;

  // Daftar antrean pengajuan terbaru (menunggu / revisi)
  const recentSubmissions = vendors
    .filter((v) => v.status === 'menunggu' || v.status === 'revisi')
    .slice(0, 5);

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      {/* Sidebar Desktop */}
      <div className="hidden md:flex flex-shrink-0">
        <AdminSidebar />
      </div>

      {/* Sidebar Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-900/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 w-64 h-full">
            <AdminSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Konten Utama */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
          {/* Banner Sambutan Command Center */}
          <div className="bg-primary text-white rounded-2xl p-6 sm:p-8 shadow-card relative overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-xs text-white border border-white/25">
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span>Pusat Kendali Pengelolaan PKL</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">
                Admin Command Center PKL Kota Bandar Lampung
              </h2>
              <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                Pantau antrean verifikasi data pedagang, distribusi titik lokasi lapak per kecamatan, serta kelola status publikasi informasi secara terintegrasi.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/admin/verifikasi"
                  className="px-4 py-2 bg-white text-primary font-semibold text-xs rounded-xl hover:bg-surface-container-low transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Periksa Antrean ({pendingCount})</span>
                </Link>
                <Link
                  href="/admin/peta"
                  className="px-4 py-2 bg-white/15 hover:bg-white/25 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 border border-white/25"
                >
                  <Map className="w-4 h-4" />
                  <span>Peta Spasial</span>
                </Link>
              </div>
            </div>
            <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none transform translate-x-8 translate-y-8">
              <Users className="w-64 h-64 text-white" />
            </div>
          </div>

          {/* KARTU KPI METRIK */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Total Pedagang */}
            <div className="bg-white p-5 rounded-2xl border border-border-subtle shadow-card space-y-2">
              <div className="flex items-center justify-between text-text-muted text-xs">
                <span>Total Pedagang</span>
                <div className="w-8 h-8 rounded-lg bg-surface-container text-primary flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                {totalVendors}
              </div>
              <div className="text-[11px] text-text-muted flex items-center gap-1">
                <span>Terdata dalam sistem</span>
              </div>
            </div>

            {/* Terverifikasi */}
            <div className="bg-white p-5 rounded-2xl border border-border-subtle shadow-card space-y-2">
              <div className="flex items-center justify-between text-text-muted text-xs">
                <span>Terverifikasi</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center border border-emerald-100">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
                {verifiedCount}
              </div>
              <div className="text-[11px] text-emerald-700 flex items-center gap-1">
                <span>Tampil di portal publik</span>
              </div>
            </div>

            {/* Menunggu Verifikasi */}
            <div className="bg-white p-5 rounded-2xl border border-border-subtle shadow-card space-y-2">
              <div className="flex items-center justify-between text-text-muted text-xs">
                <span>Menunggu Verifikasi</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center border border-amber-100">
                  <Clock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-amber-600">
                {pendingCount}
              </div>
              <div className="text-[11px] text-amber-700 flex items-center gap-1">
                <span>Butuh peninjauan admin</span>
              </div>
            </div>

            {/* Kategori Dagangan */}
            <div className="bg-white p-5 rounded-2xl border border-border-subtle shadow-card space-y-2">
              <div className="flex items-center justify-between text-text-muted text-xs">
                <span>Ragam Kategori</span>
                <div className="w-8 h-8 rounded-lg bg-surface-container text-primary flex items-center justify-center">
                  <Tag className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                {categories.length}
              </div>
              <div className="text-[11px] text-text-muted">
                <span>Klasifikasi usaha PKL</span>
              </div>
            </div>
          </div>

          {/* GRID DUA KOLOM: ANTREAN VERIFIKASI & DISTRIBUSI WILAYAH */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Kolom Kiri: Tabel Antrean Verifikasi (2 Kolom di Desktop) */}
            <div className="lg:col-span-2 bg-white rounded-2xl border border-border-subtle p-5 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-text-primary">
                    Antrean Pengajuan Menunggu Peninjauan
                  </h3>
                  <p className="text-xs text-text-muted">
                    Daftar pedagang yang baru mendaftar atau memperbaiki data
                  </p>
                </div>
                <Link
                  href="/admin/verifikasi"
                  className="text-xs font-semibold text-primary hover:underline flex items-center gap-1"
                >
                  <span>Buka Semua</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recentSubmissions.length === 0 ? (
                <div className="text-center py-8 text-text-muted text-xs">
                  Tidak ada antrean tertunda saat ini. Semua data telah diverifikasi.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-surface-container-low text-text-muted border-b border-border-subtle">
                      <tr>
                        <th className="py-2.5 px-3 font-semibold">ID / Nama Usaha</th>
                        <th className="py-2.5 px-3 font-semibold">Pemilik</th>
                        <th className="py-2.5 px-3 font-semibold">Wilayah</th>
                        <th className="py-2.5 px-3 font-semibold">Status</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle/50">
                      {recentSubmissions.map((vendor) => (
                        <tr key={vendor.id} className="hover:bg-surface-container-low/60 transition-colors">
                          <td className="py-3 px-3">
                            <div className="font-bold text-text-primary">{vendor.businessName}</div>
                            <div className="text-[11px] text-text-muted">{vendor.id} &bull; {vendor.category}</div>
                          </td>
                          <td className="py-3 px-3 text-text-primary">{vendor.ownerName}</td>
                          <td className="py-3 px-3 text-text-muted">{vendor.district}</td>
                          <td className="py-3 px-3">
                            <StatusBadge status={vendor.status} size="sm" />
                          </td>
                          <td className="py-3 px-3 text-right">
                            <Link
                              href="/admin/verifikasi"
                              className="px-2.5 py-1 bg-primary text-white text-[11px] font-semibold rounded-lg hover:bg-primary-hover transition-colors inline-block"
                            >
                              Periksa
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Kolom Kanan: Ringkasan Wilayah Kecamatan */}
            <div className="bg-white rounded-2xl border border-border-subtle p-5 shadow-card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-text-primary">
                    Sebaran Wilayah PKL
                  </h3>
                  <p className="text-xs text-text-muted">Kecamatan Kota Bandar Lampung</p>
                </div>
                <Link
                  href="/admin/wilayah"
                  className="text-xs font-semibold text-primary hover:underline"
                >
                  Detail
                </Link>
              </div>

              <div className="space-y-3">
                {DISTRICTS.slice(0, 6).map((district) => {
                  const countInDistrict = vendors.filter(
                    (v) => v.district.toLowerCase() === district.name.toLowerCase()
                  ).length;
                  const percent = totalVendors > 0 ? (countInDistrict / totalVendors) * 100 : 0;

                  return (
                    <div key={district.id} className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-medium text-text-primary">{district.name}</span>
                        <span className="font-bold text-primary">{countInDistrict} lapak</span>
                      </div>
                      <div className="w-full bg-surface-container-low rounded-full h-1.5 overflow-hidden border border-border-subtle">
                        <div
                          className="bg-primary h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(percent, 8)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-border-subtle">
                <Link
                  href="/admin/peta"
                  className="w-full py-2 bg-surface-container-low hover:bg-surface-container text-text-primary text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-border-subtle"
                >
                  <Map className="w-3.5 h-3.5 text-primary" />
                  <span>Lihat Peta Pemantauan</span>
                </Link>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

