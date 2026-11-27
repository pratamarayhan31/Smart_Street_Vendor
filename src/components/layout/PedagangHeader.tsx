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
          <h1 className="text-base font-semibold text-primary">{title}</h1>
          <p className="text-xs text-text-muted flex items-center gap-1">
            <MapPin className="w-3 h-3 text-secondary" />
            Kota Bandar Lampung &bull; Layanan Terintegrasi
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/admin/dashboard"
          className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-secondary bg-secondary/10 hover:bg-secondary/20 px-3 py-1.5 rounded-lg transition-colors"
          title="Beralih ke Portal Admin"
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Switch ke Admin</span>
        </Link>
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200">
          <div className="w-8 h-8 rounded-full bg-secondary text-white flex items-center justify-center font-bold text-xs shadow-sm">
            PKL
          </div>
          <div className="hidden lg:flex flex-col text-left">
            <span className="text-xs font-bold text-slate-900 leading-tight">Pak Joko Santoso</span>
            <span className="text-[10px] text-text-muted">Pedagang Terdaftar</span>
          </div>
        </div>
      </div>
    </header>
  );
};
