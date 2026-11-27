import React from 'react';
import { Vendor } from '@/types';
import { StatusBadge } from './StatusBadge';
import { X, MapPin, Clock, Tag, UserCheck, ShieldAlert, AlertTriangle } from 'lucide-react';

interface VendorDetailModalProps {
  vendor: Vendor | null;
  onClose: () => void;
  isAdminView?: boolean;
}

export const VendorDetailModal: React.FC<VendorDetailModalProps> = ({
  vendor,
  onClose,
  isAdminView = false,
}) => {
  if (!vendor) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Gambar & Status */}
        <div className="relative h-60 w-full bg-slate-100">
          <img
            src={vendor.photoUrl}
            alt={vendor.businessName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-xs transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold text-sky-300 uppercase tracking-wider bg-sky-950/70 px-2 py-0.5 rounded backdrop-blur-xs">
                {vendor.category}
              </span>
              <StatusBadge status={vendor.status} />
            </div>
            <h2 className="text-2xl font-bold text-white drop-shadow-sm leading-tight">
              {vendor.businessName}
            </h2>
          </div>
        </div>

        {/* Isi Informasi Detail */}
        <div className="p-6 space-y-6">
          {/* Catatan Admin Jika Ada */}
          {vendor.notes && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">Catatan Pemeriksaan Admin:</strong>
                <p className="text-amber-800">{vendor.notes}</p>
              </div>
            </div>
          )}

          {/* Deskripsi Usaha */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-text-muted mb-2">
              Deskripsi Lapak Dagangan
            </h3>
            <p className="text-sm text-text-primary leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
              {vendor.description || 'Tidak ada deskripsi rinci yang dicantumkan.'}
            </p>
          </div>

          {/* Grid Informasi Spasial & Operasional */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="p-3.5 rounded-xl border border-border-subtle bg-white">
              <div className="flex items-center gap-2 text-text-muted text-xs font-medium mb-1">
                <MapPin className="w-4 h-4 text-secondary" />
                <span>Lokasi &amp; Wilayah</span>
              </div>
              <p className="font-semibold text-slate-800">{vendor.district}, {vendor.subDistrict}</p>
              <p className="text-xs text-text-muted mt-0.5">{vendor.address}</p>
              <div className="mt-2 text-[11px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded inline-block">
                Koordinat: {vendor.latitude}, {vendor.longitude}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-border-subtle bg-white">
              <div className="flex items-center gap-2 text-text-muted text-xs font-medium mb-1">
                <Clock className="w-4 h-4 text-secondary" />
                <span>Jam Operasional</span>
              </div>
              <p className="font-semibold text-slate-800">{vendor.operatingHours || '16:00 - 22:00 WIB'}</p>
              <p className="text-xs text-text-muted mt-0.5">Waktu buka dan tutup lapak setiap hari</p>
            </div>
          </div>

          {/* Informasi Khusus Pengelola / Internal Admin */}
          {isAdminView && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-700">
                <UserCheck className="w-4 h-4 text-primary" />
                <span>Data Verifikasi Internal Petugas</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-500">Pemilik Usaha:</span>{' '}
                  <strong className="text-slate-800">{vendor.ownerName}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Nomor Kontak:</span>{' '}
                  <strong className="text-slate-800">{vendor.phone}</strong>
                </div>
                <div>
                  <span className="text-slate-500">Tanggal Pengajuan:</span>{' '}
                  <span className="text-slate-800">{new Date(vendor.submittedAt).toLocaleDateString('id-ID')}</span>
                </div>
                <div>
                  <span className="text-slate-500">Status Publikasi:</span>{' '}
                  <span className={`font-semibold ${vendor.isPublic ? 'text-emerald-700' : 'text-slate-500'}`}>
                    {vendor.isPublic ? 'Tampil di Peta Publik' : 'Tersembunyi'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Penafian Privasi Publik */}
          {!isAdminView && (
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-slate-600 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-secondary flex-shrink-0" />
              <span>
                Sesuai kebijakan privasi Smart Street Vendor, informasi kontak pribadi pedagang dijaga kerahasiaannya dan tidak dipublikasikan ke publik tanpa persetujuan resmi.
              </span>
            </div>
          )}
        </div>

        {/* Footer Modal */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-sm font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

