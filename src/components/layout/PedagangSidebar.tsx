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
    <aside className="w-64 h-full bg-slate-900 text-white flex flex-col flex-shrink-0 shadow-xl border-r border-slate-800">
      <div className="p-4 border-b border-slate-800">
        <HeaderBranding variant="dark" />
      </div>

      <div className="p-3 mx-3 my-3 bg-secondary/10 border border-secondary/20 rounded-xl">
        <div className="text-[11px] font-semibold text-sky-400 uppercase tracking-wider mb-1">
          Lapak Terdaftar
        </div>
        <div className="text-sm font-bold text-white truncate">
          Soto Betawi Bang Joko
        </div>
        <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
          <MapPin className="w-3 h-3 text-secondary" />
          Tanjung Karang Pusat
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-300">
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
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-secondary text-white shadow-md font-semibold'
                  : 'text-slate-200 hover:text-white hover:bg-slate-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500 text-white">
                  {item.badge}
                </span>
              )}
              {isActive && !item.badge && (
                <ChevronRight className="w-4 h-4 text-white/70" />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-slate-800 space-y-2">
        <Link
          href="/"
          className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            Peta Publik
          </span>
          <span className="text-[10px] text-slate-400">Lihat Web</span>
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/30 rounded-lg transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Keluar Akun
        </Link>
      </div>
    </aside>
  );
};
