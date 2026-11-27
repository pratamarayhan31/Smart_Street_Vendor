import React, { useState } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getStoredVendors, updateVendorStatus } from '@/lib/store';
import { Vendor, VerificationStatus } from '@/types';
import { 
  CheckSquare, 
  Search, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  MapPin, 
  Clock, 
  User, 
  Phone, 
  FileText,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export const AdminVerificationPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>(() => getStoredVendors());
  const [selectedVendorId, setSelectedVendorId] = useState<string>(() => {
    const list = getStoredVendors();
    const pending = list.find((v) => v.status === 'menunggu' || v.status === 'revisi');
    return pending ? pending.id : list[0]?.id || '';
  });

  const [filterStatus, setFilterStatus] = useState<string>('semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [notes, setNotes] = useState('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const selectedVendor = vendors.find((v) => v.id === selectedVendorId) || vendors[0];

  const filteredQueue = vendors.filter((v) => {
    const matchStatus =
      filterStatus === 'semua' || v.status === filterStatus;
    const matchSearch =
      searchQuery === '' ||
      v.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleDecision = (decision: VerificationStatus) => {
    if (!selectedVendor) return;

    if ((decision === 'revisi' || decision === 'ditolak') && !notes.trim()) {
      alert('Mohon cantumkan catatan/alasan pemeriksaan untuk keputusan ini.');
      return;
    }

    const updated = updateVendorStatus(
      selectedVendor.id,
      decision,
      notes || undefined,
      'Admin Dinas Koperasi & UMKM'
    );
    setVendors(updated);
    setNotes('');

    const labelMap: Record<VerificationStatus, string> = {
      terverifikasi: 'disetujui dan siap tampil di peta publik',
      revisi: 'dikembalikan ke pedagang untuk perbaikan data',
      ditolak: 'ditolak dengan catatan alasan',
      ditinjau: 'ditandai sedang ditinjau',
      menunggu: 'diubah ke status menunggu',
    };

    setActionSuccessMessage(`Pengajuan ${selectedVendor.businessName} berhasil ${labelMap[decision]}.`);
    setTimeout(() => setActionSuccessMessage(null), 4000);
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
          title="Verifikasi & Pemeriksaan Pengajuan PKL" 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
          {/* Banner Notifikasi Sukses */}
          {actionSuccessMessage && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>{actionSuccessMessage}</span>
            </div>
          )}

          {/* Ketentuan Pemeriksaan Sistem */}
          <div className="p-3.5 bg-blue-50/70 border border-blue-200/80 rounded-xl text-xs text-slate-700 flex items-start gap-2.5">
            <ShieldCheck className="w-4 h-4 text-secondary flex-shrink-0 mt-0.5" />
            <div>
              <strong>Ketentuan Pemeriksaan Sistem:</strong> Verifikasi aplikasi hanya memvalidasi kelengkapan data usaha, kategori, dan titik koordinat untuk kebutuhan pendataan dan pemetaan. Verifikasi ini <em>bukan</em> merupakan izin usaha resmi dan tidak menggantikan perizinan legal dari instansi berwenang.
            </div>
          </div>

          {/* SPLIT LAYOUT VERIFIKASI */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* AREA KIRI: ANTREAN PENGAJUAN (5 KOLOM) */}
            <div className="lg:col-span-5 bg-white rounded-2xl border border-border-subtle p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-primary flex items-center gap-2">
                  <CheckSquare className="w-4 h-4 text-secondary" />
                  Antrean Pengajuan ({filteredQueue.length})
                </h3>
                <span className="text-[10px] text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200 font-semibold">
                  {vendors.filter((v) => v.status === 'menunggu').length} Baru
                </span>
              </div>

              {/* Filter Cepat */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
                {['semua', 'menunggu', 'revisi', 'terverifikasi', 'ditolak'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setFilterStatus(st)}
                    className={`px-2.5 py-1 rounded-lg font-medium capitalize text-[11px] whitespace-nowrap transition-colors ${
                      filterStatus === st
                        ? 'bg-primary text-white font-semibold'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              {/* Pencarian Antrean */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari pedagang / ID pengajuan..."
                  className="w-full text-xs bg-slate-50 border border-border-subtle rounded-xl pl-8 pr-3 py-2 outline-none focus:bg-white"
                />
              </div>

              {/* List Antrean */}
              <div className="space-y-2 max-h-[580px] overflow-y-auto pr-1">
                {filteredQueue.length === 0 ? (
                  <div className="text-center py-10 text-slate-400 text-xs">
                    Tidak ada pengajuan pada filter ini.
                  </div>
                ) : (
                  filteredQueue.map((vendor) => {
                    const isSelected = selectedVendor?.id === vendor.id;
                    return (
                      <div
                        key={vendor.id}
                        onClick={() => {
                          setSelectedVendorId(vendor.id);
                          setNotes(vendor.notes || '');
                        }}
                        className={`p-3 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? 'border-secondary bg-surface-container-low shadow-xs'
                            : 'border-border-subtle hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <span className="text-[10px] font-bold text-secondary uppercase block">
                              {vendor.category}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 truncate">
                              {vendor.businessName}
                            </h4>
                            <p className="text-[11px] text-slate-500 mt-0.5">
                              {vendor.ownerName} &bull; {vendor.district}
                            </p>
                          </div>
                          <StatusBadge status={vendor.status} size="sm" />
                        </div>
                        <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between border-t border-slate-100 pt-1.5">
                          <span>{vendor.id}</span>
                          <span>{new Date(vendor.submittedAt).toLocaleDateString('id-ID')}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

            {/* AREA KANAN: PANEL DETAIL & KEPUTUSAN VERIFIKASI (7 KOLOM) */}
            <div className="lg:col-span-7 bg-white rounded-2xl border border-border-subtle p-5 shadow-xs space-y-6">
              {selectedVendor ? (
                <>
                  <div className="flex items-start justify-between border-b border-border-subtle pb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-bold text-secondary uppercase bg-sky-50 px-2 py-0.5 rounded">
                          {selectedVendor.id}
                        </span>
                        <StatusBadge status={selectedVendor.status} />
                      </div>
                      <h3 className="text-lg font-bold text-primary">
                        {selectedVendor.businessName}
                      </h3>
                      <p className="text-xs text-text-muted">
                        Kategori: {selectedVendor.category}
                      </p>
                    </div>
                  </div>

                  {/* Foto Usaha */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                      Foto Tampak Depan Lapak
                    </label>
                    <div className="h-52 w-full rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                      <img
                        src={selectedVendor.photoUrl}
                        alt={selectedVendor.businessName}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Data Identitas & Usaha */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <div className="text-slate-400 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-secondary" />
                        <span>Nama Pemilik</span>
                      </div>
                      <div className="font-semibold text-slate-900">{selectedVendor.ownerName}</div>
                      <div className="text-slate-500 text-[11px]">NIK: {selectedVendor.nik || 'Tidak dicantumkan'}</div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-1">
                      <div className="text-slate-400 flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-secondary" />
                        <span>Nomor WhatsApp / HP</span>
                      </div>
                      <div className="font-semibold text-slate-900">{selectedVendor.phone}</div>
                      <div className="text-slate-500 text-[11px]">Jam: {selectedVendor.operatingHours || '16:00 - 22:00 WIB'}</div>
                    </div>
                  </div>

                  {/* Lokasi & Titik Koordinat */}
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-1 text-xs">
                    <div className="text-slate-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-secondary" />
                      <span>Lokasi Berjualan</span>
                    </div>
                    <div className="font-semibold text-slate-900">
                      {selectedVendor.district}, Kelurahan {selectedVendor.subDistrict}
                    </div>
                    <div className="text-slate-600">{selectedVendor.address}</div>
                    <div className="text-[11px] font-mono text-slate-500 pt-1">
                      Koordinat Spasial: Lat {selectedVendor.latitude}, Lng {selectedVendor.longitude}
                    </div>
                  </div>

                  {/* Form Catatan / Alasan Pemeriksaan */}
                  <div className="space-y-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      Catatan / Alasan Verifikasi Petugas
                    </label>
                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Tuliskan catatan perbaikan data atau alasan keputusan verifikasi..."
                      className="w-full text-xs bg-slate-50 border border-border-subtle rounded-xl p-3 outline-none focus:bg-white focus:border-secondary"
                    />
                    <p className="text-[11px] text-text-muted">
                      Catatan ini akan langsung terlihat oleh pedagang di portal usahanya jika status meminta perbaikan.
                    </p>
                  </div>

                  {/* Tombol Aksi Verifikasi */}
                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => handleDecision('ditolak')}
                      className="px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors flex items-center gap-1.5"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Tolak Pengajuan</span>
                    </button>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleDecision('revisi')}
                        className="px-3.5 py-2 text-xs font-semibold text-amber-800 bg-amber-50 hover:bg-amber-100 border border-amber-300 rounded-xl transition-colors flex items-center gap-1.5"
                      >
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Minta Perbaikan Data</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDecision('terverifikasi')}
                        className="px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors shadow-xs flex items-center gap-1.5"
                      >
                        <CheckCircle className="w-4 h-4" />
                        <span>Setujui &amp; Verifikasi</span>
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-16 text-slate-400 text-xs">
                  Pilih salah satu pengajuan dari antrean di sebelah kiri.
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

