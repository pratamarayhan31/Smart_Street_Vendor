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
    <header className="h-16 bg-white border-b border-border-subtle px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-soft">
      <div className="flex items-center gap-3">
        {onMenuToggle && (
          <button
            onClick={onMenuToggle}
            className="md:hidden p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-container-low"
            aria-label="Buka Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-bold text-text-primary">{title}</h1>
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Sistem Aktif
            </span>
          </div>
          <p className="text-xs text-text-muted flex items-center gap-1">
            <MapPin className="w-3 h-3 text-primary" />
            Pemerintah Kota Bandar Lampung
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/pedagang/dashboard"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-text-primary bg-surface-container-low hover:bg-surface-container px-3 py-1.5 rounded-lg transition-colors border border-border-subtle"
          title="Uji Tampilan Sebagai Pedagang"
        >
          <Store className="w-3.5 h-3.5 text-primary" />
          <span>Switch ke Pedagang</span>
        </Link>

        {/* Profil Admin */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-border-subtle">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-soft">
            ADM
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-text-primary leading-tight">Petugas Admin</span>
            <span className="text-[10px] text-text-muted">Dinas Koperasi &amp; UMKM</span>
          </div>
        </div>
      </div>
    </header>
  );
};
