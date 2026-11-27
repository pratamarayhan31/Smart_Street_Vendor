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
          <div className="bg-primary text-white rounded-2xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
            <div className="relative z-10 max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-xs text-sky-200 border border-white/15">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Pusat Kendali Pengelolaan PKL</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold">
                Admin Command Center PKL Kota Bandar Lampung
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Pantau antrean verifikasi data pedagang, distribusi titik lokasi lapak per kecamatan, serta kelola status publikasi informasi secara terintegrasi.
              </p>
              <div className="pt-2 flex flex-wrap gap-3">
                <Link
                  href="/admin/verifikasi"
                  className="px-4 py-2 bg-secondary text-white font-semibold text-xs rounded-xl hover:bg-secondary-container transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Periksa Antrean ({pendingCount})</span>
                </Link>
                <Link
                  href="/admin/peta"
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs rounded-xl transition-colors flex items-center gap-1.5 border border-white/20"
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
            <div className="bg-white p-5 rounded-2xl border border-border-subtle shadow-xs space-y-2">
              <div className="flex items-center justify-between text-text-muted text-xs">
                <span>Total Pedagang</span>
                <div className="w-8 h-8 rounded-lg bg-surface-container-low text-secondary flex items-center justify-center">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-primary">
                {totalVendors}
              </div>
              <div className="text-[11px] text-text-muted flex items-center gap-1">
                <span>Terdata dalam sistem</span>
              </div>
            </div>

            {/* Terverifikasi */}
            <div className="bg-white p-5 rounded-2xl border border-border-subtle shadow-xs space-y-2">
              <div className="flex items-center justify-between text-text-muted text-xs">
                <span>Terverifikasi</span>
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
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
            <div className="bg-white p-5 rounded-2xl border border-border-subtle shadow-xs space-y-2">
              <div className="flex items-center justify-between text-text-muted text-xs">
                <span>Menunggu Verifikasi</span>
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
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
            <div className="bg-white p-5 rounded-2xl border border-border-subtle shadow-xs space-y-2">
              <div className="flex items-center justify-between text-text-muted text-xs">
                <span>Ragam Kategori</span>
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-secondary flex items-center justify-center">
                  <Tag className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-primary">
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
            <div className="lg:col-span-2 bg-white rounded-2xl border border-border-subtle p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-primary">
                    Antrean Pengajuan Menunggu Peninjauan
                  </h3>
                  <p className="text-xs text-text-muted">
                    Daftar pedagang yang baru mendaftar atau memperbaiki data
                  </p>
                </div>
                <Link
                  href="/admin/verifikasi"
                  className="text-xs font-semibold text-secondary hover:underline flex items-center gap-1"
                >
                  <span>Buka Semua</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {recentSubmissions.length === 0 ? (
                <div className="text-center py-8 text-slate-400 text-xs">
                  Tidak ada antrean tertunda saat ini. Semua data telah diverifikasi.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-text-muted border-b border-border-subtle">
                      <tr>
                        <th className="py-2.5 px-3 font-semibold">ID / Nama Usaha</th>
                        <th className="py-2.5 px-3 font-semibold">Pemilik</th>
                        <th className="py-2.5 px-3 font-semibold">Wilayah</th>
                        <th className="py-2.5 px-3 font-semibold">Status</th>
                        <th className="py-2.5 px-3 font-semibold text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {recentSubmissions.map((vendor) => (
                        <tr key={vendor.id} className="hover:bg-slate-50/70 transition-colors">
                          <td className="py-3 px-3">
                            <div className="font-bold text-slate-900">{vendor.businessName}</div>
                            <div className="text-[11px] text-text-muted">{vendor.id} &bull; {vendor.category}</div>
                          </td>
                          <td className="py-3 px-3 text-slate-700">{vendor.ownerName}</td>
                          <td className="py-3 px-3 text-slate-600">{vendor.district}</td>
                          <td className="py-3 px-3">
                            <StatusBadge status={vendor.status} size="sm" />
                          </td>
                          <td className="py-3 px-3 text-right">
                            <Link
                              href="/admin/verifikasi"
                              className="px-2.5 py-1 bg-primary text-white text-[11px] font-semibold rounded-lg hover:bg-primary-container transition-colors inline-block"
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
            <div className="bg-white rounded-2xl border border-border-subtle p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-primary">
                    Sebaran Wilayah PKL
                  </h3>
                  <p className="text-xs text-text-muted">Kecamatan Kota Bandar Lampung</p>
                </div>
                <Link
                  href="/admin/wilayah"
                  className="text-xs font-semibold text-secondary hover:underline"
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
                        <span className="font-medium text-slate-700">{district.name}</span>
                        <span className="font-bold text-slate-900">{countInDistrict} lapak</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                        <div
                          className="bg-secondary h-1.5 rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(percent, 8)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-slate-100">
                <Link
                  href="/admin/peta"
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-slate-200"
                >
                  <Map className="w-3.5 h-3.5 text-secondary" />
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

