import React, { useState } from 'react';
import { PedagangSidebar } from '@/components/layout/PedagangSidebar';
import { PedagangHeader } from '@/components/layout/PedagangHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getStoredVendors, addOrUpdateVendor } from '@/lib/store';
import { Vendor } from '@/types';
import { 
  FileCheck, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  XCircle, 
  Send, 
  HelpCircle,
  FileEdit
} from 'lucide-react';

export const PedagangStatusPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>(() => getStoredVendors());

  const currentVendor = vendors[0] || {
    id: 'PKL-001',
    businessName: 'Soto Betawi Bang Joko',
    status: 'terverifikasi',
    submittedAt: '2026-11-10T14:20:00Z',
    verifiedAt: '2026-11-12T09:15:00Z',
    verifiedBy: 'Admin Dinas Koperasi & UMKM',
    notes: '',
  };

  const [revisionNotes, setRevisionNotes] = useState('');
  const [submittedRevision, setSubmittedRevision] = useState(false);

  const handleSendRevision = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = addOrUpdateVendor({
      id: currentVendor.id,
      notes: undefined, // Bersihkan catatan perbaikan setelah dikirim ulang
      status: 'menunggu', // Kembalikan ke antrean peninjauan
    });
    setVendors(getStoredVendors());
    setSubmittedRevision(true);
    setTimeout(() => setSubmittedRevision(false), 4000);
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
          title="Status & Perkembangan Pengajuan Usaha" 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl">
          {submittedRevision && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Data perbaikan berhasil dikirim ulang ke petugas admin untuk ditinjau kembali!</span>
            </div>
          )}

          {/* Kartu Status Utama */}
          <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">
                  No. Registrasi: {currentVendor.id}
                </span>
                <h2 className="text-xl font-bold text-primary">
                  {currentVendor.businessName}
                </h2>
                <p className="text-xs text-text-muted mt-0.5">
                  Diajukan pada {new Date(currentVendor.submittedAt).toLocaleDateString('id-ID', { dateStyle: 'full' })}
                </p>
              </div>
              <div>
                <StatusBadge status={currentVendor.status} size="lg" />
              </div>
            </div>

            {/* Catatan Perbaikan Admin Jika Ada */}
            {currentVendor.notes && (
              <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-sm text-amber-950">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>Instruksi Catatan Pemeriksaan Petugas:</span>
                </div>
                <p className="leading-relaxed bg-white/80 p-3 rounded-lg border border-amber-100 font-medium">
                  {currentVendor.notes}
                </p>
              </div>
            )}

            {/* Timeline Alur Verifikasi */}
            <div className="pt-2 space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Tahapan Pemeriksaan Berkas
              </h3>

              <div className="space-y-4 text-xs">
                {/* Step 1 */}
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold flex-shrink-0">
                    ✓
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800">1. Pendaftaran Berkas Terkirim</span>
                    <p className="text-slate-500 text-[11px]">
                      Identitas pemilik, informasi usaha, dan foto lapak berhasil disimpan ke sistem.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                    currentVendor.status === 'menunggu'
                      ? 'bg-amber-100 text-amber-700 animate-pulse'
                      : 'bg-emerald-100 text-emerald-700'
                  }`}>
                    {currentVendor.status === 'menunggu' ? '•' : '✓'}
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800">2. Peninjauan oleh Petugas Dinas Terkait</span>
                    <p className="text-slate-500 text-[11px]">
                      Pemeriksaan kelengkapan administrasi dan kejelasan dokumen usaha PKL.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex items-start gap-3">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                    currentVendor.status === 'terverifikasi'
                      ? 'bg-emerald-100 text-emerald-700'
                      : currentVendor.status === 'ditolak'
                      ? 'bg-rose-100 text-rose-700'
                      : 'bg-slate-100 text-slate-400'
                  }`}>
                    {currentVendor.status === 'terverifikasi' ? '✓' : currentVendor.status === 'ditolak' ? '✕' : '3'}
                  </div>
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-800">3. Validasi Titik Koordinat Lapak &amp; Publikasi</span>
                    <p className="text-slate-500 text-[11px]">
                      Titik lapak diaktifkan pada Peta Digital Smart Street Vendor untuk diakses masyarakat.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Tindak Lanjut Revisi Jika Status "Perlu Perbaikan" */}
          {currentVendor.status === 'revisi' && (
            <div className="bg-white rounded-2xl border border-amber-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2 text-primary border-b border-slate-100 pb-3">
                <FileEdit className="w-5 h-5 text-amber-600" />
                <h3 className="text-sm font-bold">Kirim Konfirmasi Perbaikan Data</h3>
              </div>

              <form onSubmit={handleSendRevision} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Keterangan Perbaikan yang Telah Dilakukan *
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={revisionNotes}
                    onChange={(e) => setRevisionNotes(e.target.value)}
                    placeholder="Contoh: Sudah memperbarui foto lapak dan menyesuaikan koordinat titik berjualan..."
                    className="w-full bg-slate-50 border border-border-subtle rounded-xl p-3 outline-none focus:bg-white focus:border-secondary"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-primary hover:bg-primary-container text-white font-semibold rounded-xl flex items-center gap-2 shadow-xs transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Kirim Ulang untuk Ditinjau Petugas</span>
                </button>
              </form>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

