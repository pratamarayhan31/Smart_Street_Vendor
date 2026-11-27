import React, { useState } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { getStoredVendors } from '@/lib/store';
import { DISTRICTS, CATEGORIES } from '@/lib/data';
import { FileText, Printer, Download, Filter, CheckCircle2 } from 'lucide-react';

export const AdminReportPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vendors] = useState(() => getStoredVendors());
  const [selectedDistrict, setSelectedDistrict] = useState('Semua');

  const filteredVendors = vendors.filter((v) => {
    return selectedDistrict === 'Semua' || v.district === selectedDistrict;
  });

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'Nama Usaha', 'Pemilik', 'Kategori', 'Kecamatan', 'Alamat', 'Status', 'Publik'];
    const rows = filteredVendors.map((v) => [
      v.id,
      `"${v.businessName}"`,
      `"${v.ownerName}"`,
      `"${v.category}"`,
      `"${v.district}"`,
      `"${v.address}"`,
      v.status,
      v.isPublic ? 'Ya' : 'Tidak',
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekapitulasi_PKL_Bandar_Lampung_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <div className="hidden md:flex flex-shrink-0">
        <AdminSidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-900/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 w-64 h-full">
            <AdminSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader 
          title="Rekapitulasi Data & Laporan PKL" 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
          {/* Header Aksi & Export */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Laporan Pendataan &amp; Verifikasi PKL
              </h2>
              <p className="text-xs text-text-muted">
                Rekapitulasi resmi data pedagang kaki lima Kota Bandar Lampung
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3.5 py-2 bg-white hover:bg-surface-container-low text-text-primary text-xs font-semibold rounded-xl border border-border-subtle flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-text-muted" />
                <span>Cetak Laporan</span>
              </button>
              <button
                onClick={handleExportCSV}
                className="px-3.5 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Ekspor CSV</span>
              </button>
            </div>
          </div>

          {/* Filter Wilayah */}
          <div className="bg-white p-4 rounded-2xl border border-border-subtle shadow-card flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs">
              <Filter className="w-4 h-4 text-primary" />
              <span className="font-semibold text-text-primary">Filter Kecamatan:</span>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="bg-surface-container-low border border-border-subtle rounded-xl px-3 py-1.5 text-text-primary outline-none focus:bg-white focus:border-primary transition-all"
              >
                <option value="Semua">Semua Wilayah Bandar Lampung</option>
                {DISTRICTS.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>
            <div className="text-xs text-text-muted font-semibold">
              Total <span className="text-primary font-bold">{filteredVendors.length}</span> pedagang terdata
            </div>
          </div>

          {/* Rangkuman Matriks Kategori */}
          <div className="bg-white rounded-2xl border border-border-subtle p-5 shadow-card space-y-4">
            <h3 className="text-sm font-bold text-text-primary">
              Distribusi per Kategori Dagangan
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {CATEGORIES.map((cat) => {
                const count = filteredVendors.filter((v) => v.category === cat.name).length;
                return (
                  <div key={cat.id} className="p-3 bg-surface-container-low rounded-xl border border-border-subtle text-center">
                    <div className="text-lg font-bold text-primary">{count}</div>
                    <div className="text-[11px] text-text-muted line-clamp-1 mt-0.5">{cat.name}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Tabel Rekapitulasi Lengkap */}
          <div className="bg-white rounded-2xl border border-border-subtle shadow-card overflow-hidden">
            <div className="p-4 border-b border-border-subtle bg-surface-container-low/50 flex justify-between items-center">
              <span className="text-xs font-bold text-text-primary uppercase tracking-wider">
                Daftar Detil Rekapitulasi Data Pedagang
              </span>
              <span className="text-[11px] text-text-muted">
                Diperbarui per {new Date().toLocaleDateString('id-ID')}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-surface-container-low text-text-muted border-b border-border-subtle">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">No</th>
                    <th className="py-2.5 px-3 font-semibold">Nama Usaha</th>
                    <th className="py-2.5 px-3 font-semibold">Pemilik</th>
                    <th className="py-2.5 px-3 font-semibold">Kategori</th>
                    <th className="py-2.5 px-3 font-semibold">Kecamatan</th>
                    <th className="py-2.5 px-3 font-semibold">Status Data</th>
                    <th className="py-2.5 px-3 font-semibold">Izin Publik</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle/50">
                  {filteredVendors.map((vendor, idx) => (
                    <tr key={vendor.id} className="hover:bg-surface-container-low/60 transition-colors">
                      <td className="py-2.5 px-3 font-mono text-text-muted">{idx + 1}</td>
                      <td className="py-2.5 px-3 font-bold text-text-primary">{vendor.businessName}</td>
                      <td className="py-2.5 px-3 text-text-primary">{vendor.ownerName}</td>
                      <td className="py-2.5 px-3 text-text-muted">{vendor.category}</td>
                      <td className="py-2.5 px-3 text-text-muted">{vendor.district}</td>
                      <td className="py-2.5 px-3 capitalize font-semibold">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${
                          vendor.status === 'terverifikasi'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : vendor.status === 'revisi'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-surface-container-low text-text-muted border border-border-subtle'
                        }`}>
                          {vendor.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-text-muted">
                        {vendor.isPublic ? 'Dipublikasikan' : 'Privat'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

