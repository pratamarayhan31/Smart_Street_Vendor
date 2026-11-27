import React from 'react';
import { Vendor } from '@/types';
import { StatusBadge } from './StatusBadge';
import { useRouter } from '@/lib/router';
import { 
  X, 
  MapPin, 
  Clock, 
  Tag, 
  User, 
  UserCheck, 
  ShieldAlert, 
  AlertTriangle,
  ExternalLink,
  Navigation
} from 'lucide-react';

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
  const { navigate } = useRouter();

  if (!vendor) return null;

  const handleOpenMap = () => {
    onClose();
    navigate('/peta');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Gambar & Status */}
        <div className="relative h-64 w-full bg-slate-100">
          <img
            src={vendor.photoUrl}
            alt={vendor.businessName}
            className="w-full h-full object-cover"
            onError={(e: any) => {
              e.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-xs transition-colors"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs font-bold text-sky-300 uppercase tracking-wider bg-sky-950/80 px-2.5 py-0.5 rounded-md backdrop-blur-xs">
                {vendor.category}
              </span>
              <StatusBadge status={vendor.status} />
            </div>
            <h2 className="text-2xl font-bold text-white drop-shadow-sm leading-tight">
              {vendor.businessName}
            </h2>
            {vendor.ownerName && (
              <p className="text-xs text-slate-200 mt-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-sky-400" />
                <span>Pemilik Usaha: <strong>{vendor.ownerName}</strong></span>
              </p>
            )}
          </div>
        </div>

        {/* Isi Informasi Detail */}
        <div className="p-6 space-y-6">
          {/* Catatan Admin Jika Ada */}
          {vendor.notes && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <strong className="font-semibold block mb-0.5">Catatan Pemeriksaan Admin:</strong>
                <p className="text-amber-800 leading-relaxed">{vendor.notes}</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3.5 rounded-xl border border-border-subtle bg-white space-y-1">
              <div className="flex items-center gap-2 text-text-muted text-xs font-medium mb-1">
                <MapPin className="w-4 h-4 text-secondary" />
                <span>Lokasi &amp; Wilayah</span>
              </div>
              <p className="font-bold text-slate-800 text-sm">
                Kecamatan {vendor.district}
              </p>
              <p className="text-slate-600">{vendor.address}</p>
              {vendor.subDistrict && (
                <p className="text-slate-500 text-[11px]">Kelurahan: {vendor.subDistrict}</p>
              )}
              <div className="mt-2 text-[10px] font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded-md inline-block border border-slate-100">
                Koordinat: {vendor.latitude}, {vendor.longitude}
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-border-subtle bg-white space-y-1">
              <div className="flex items-center gap-2 text-text-muted text-xs font-medium mb-1">
                <Clock className="w-4 h-4 text-secondary" />
                <span>Jam Operasional</span>
              </div>
              <p className="font-bold text-slate-800 text-sm">
                {vendor.operatingHours || '16:00 - 22:00 WIB'}
              </p>
              <p className="text-xs text-text-muted mt-0.5">
                Jam buka dan tutup lapak setiap hari
              </p>
              <div className="pt-2">
                <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Lapak Terdaftar Resmi
                </span>
              </div>
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

          {/* Kebijakan Privasi Publik */}
          {!isAdminView && (
            <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-xs text-slate-600 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-secondary flex-shrink-0" />
              <span>
                Sesuai kebijakan privasi Smart Street Vendor, informasi kontak pribadi pedagang dijaga kerahasiaannya dan tidak dipublikasikan ke publik tanpa persetujuan resmi.
              </span>
            </div>
          )}
        </div>

        {/* Footer Modal dengan Tombol Akses Peta Digital */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleOpenMap}
            className="px-4 py-2 text-xs font-semibold text-secondary hover:text-white bg-white hover:bg-secondary border border-secondary/30 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
          >
            <Navigation className="w-3.5 h-3.5" />
            <span>Lihat di Peta Digital PKL</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
