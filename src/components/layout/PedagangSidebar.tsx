import React from 'react';
import { Link, useRouter } from '@/lib/router';
import { 
  Store, 
  MapPin, 
  FileCheck, 
  User, 
  ExternalLink, 
  LogOut,
  ChevronRight
} from 'lucide-react';
import { HeaderBranding } from './HeaderBranding';

interface PedagangSidebarProps {
  onClose?: () => void;
}

export const PedagangSidebar: React.FC<PedagangSidebarProps> = ({ onClose }) => {
  const { path } = useRouter();

  const menuItems = [
    { label: 'Dashboard Usaha', href: '/pedagang/dashboard', icon: Store },
    { label: 'Profil & Data Usaha', href: '/pedagang/profil', icon: User },
    { label: 'Titik Lokasi Peta', href: '/pedagang/lokasi', icon: MapPin },
    { label: 'Status Pengajuan', href: '/pedagang/status', icon: FileCheck, badge: 'Cek' },
  ];

  return (
    <aside className="w-64 h-full bg-white text-text-primary flex flex-col flex-shrink-0 border-r border-border-subtle shadow-soft">
      <div className="p-4 border-b border-border-subtle bg-surface-container-low/50">
        <HeaderBranding />
      </div>

      {/* Info Lapak Terdaftar dengan Aksen Biru Muda */}
      <div className="p-3.5 mx-3 my-3 bg-surface-container-low border border-border-subtle rounded-xl">
        <div className="text-[10px] font-bold text-primary uppercase tracking-wider mb-1">
          Lapak Terdaftar
        </div>
        <div className="text-sm font-bold text-text-primary truncate">
          Soto Betawi Bang Joko
        </div>
        <div className="text-[11px] text-text-muted flex items-center gap-1 mt-0.5">
          <MapPin className="w-3 h-3 text-primary" />
          Tanjung Karang Pusat
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">
          MENU PEDAGANG
        </div>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = path === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm transition-all ${
                isActive
                  ? 'bg-primary text-white shadow-soft font-semibold'
                  : 'text-text-primary hover:text-primary hover:bg-surface-container-low font-medium'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-text-muted'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                  isActive ? 'bg-white text-primary' : 'bg-surface-container text-primary border border-border-subtle'
                }`}>
                  {item.badge}
                </span>
              )}
              {isActive && !item.badge && (
                <ChevronRight className="w-4 h-4 text-white/80" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border-subtle bg-surface-container-low/40 space-y-1">
        <Link
          href="/"
          className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-text-primary hover:text-primary hover:bg-white rounded-lg transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-primary" />
            Peta Publik
          </span>
          <span className="text-[10px] text-text-muted">Lihat Web</span>
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-primary hover:bg-rose-50 rounded-lg transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Keluar Akun
        </Link>
      </div>
    </aside>
  );
};
