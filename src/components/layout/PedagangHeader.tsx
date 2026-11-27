import React from 'react';
import { Menu, ShieldCheck, MapPin } from 'lucide-react';
import { Link } from '@/lib/router';

interface PedagangHeaderProps {
  onMenuToggle?: () => void;
  title?: string;
}

export const PedagangHeader: React.FC<PedagangHeaderProps> = ({
  onMenuToggle,
  title = 'Portal Mandiri Pedagang PKL',
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
          <h1 className="text-base font-bold text-text-primary">{title}</h1>
          <p className="text-xs text-text-muted flex items-center gap-1">
            <MapPin className="w-3 h-3 text-primary" />
            Kota Bandar Lampung &bull; Layanan Terintegrasi
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/admin/dashboard"
          className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-primary bg-surface-container hover:bg-surface-container-high px-3 py-1.5 rounded-lg transition-colors border border-border-subtle"
          title="Beralih ke Portal Admin"
        >
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span>Switch ke Admin</span>
        </Link>
        <div className="flex items-center gap-2.5 pl-3 border-l border-border-subtle">
          <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-soft">
            PKL
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-text-primary leading-tight">Pak Joko Santoso</span>
            <span className="text-[10px] text-text-muted">Pedagang Terdaftar</span>
          </div>
        </div>
      </div>
    </header>
  );
};
