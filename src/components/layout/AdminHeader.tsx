import React from 'react';
import { Menu, MapPin, Store } from 'lucide-react';
import { Link } from '@/lib/router';

interface AdminHeaderProps {
  onMenuToggle?: () => void;
  title?: string;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  onMenuToggle,
  title = 'Command Center Pendataan PKL',
}) => {
  return (
    <header className="h-16 bg-white border-b border-border-subtle px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            aria-label="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-semibold text-primary">{title}</h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Sistem Aktif
            </span>
          </div>
          <p className="text-xs text-text-muted flex items-center gap-1">
            <MapPin className="w-3 h-3 text-secondary" />
            Pemerintah Kota Bandar Lampung
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/pedagang/dashboard"
          className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition-colors border border-slate-200"
          title="Uji Tampilan Sebagai Pedagang"
        >
          <Store className="w-3.5 h-3.5 text-secondary" />
          <span>Switch ke Pedagang</span>
        </Link>

        {/* Profil Admin */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-sm">
            ADM
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 leading-tight">Petugas Admin</span>
            <span className="text-[10px] text-text-muted">Dinas Koperasi &amp; UMKM</span>
          </div>
        </div>
      </div>
    </header>
  );
};
