import React from 'react';
import { Link, useRouter } from '@/lib/router';
import { 
  LayoutDashboard, 
  Users, 
  CheckSquare, 
  Tags, 
  Map, 
  FileText, 
  MapPin, 
  LogOut, 
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { HeaderBranding } from './HeaderBranding';

interface AdminSidebarProps {
  onClose?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({ onClose }) => {
  const { path } = useRouter();

  const menuGroups = [
    {
      title: 'COMMAND CENTER',
      items: [
        { label: 'Dashboard Utama', href: '/admin/dashboard', icon: LayoutDashboard },
        { label: 'Peta Spasial PKL', href: '/admin/peta', icon: Map },
      ],
    },
    {
      title: 'PENGELOLAAN & VERIFIKASI',
      items: [
        { label: 'Verifikasi Berkas', href: '/admin/verifikasi', icon: CheckSquare, badge: 'Antrean' },
        { label: 'Data Pedagang', href: '/admin/pedagang', icon: Users },
        { label: 'Kategori Dagangan', href: '/admin/kategori', icon: Tags },
        { label: 'Wilayah Kecamatan', href: '/admin/wilayah', icon: MapPin },
      ],
    },
    {
      title: 'LAPORAN & OUTPUT',
      items: [
        { label: 'Rekapitulasi Data', href: '/admin/laporan', icon: FileText },
      ],
    },
  ];

  return (
    <aside className="w-64 h-full bg-primary-container text-white flex flex-col flex-shrink-0 shadow-xl border-r border-slate-700/50">
      {/* Header Sidebar Brand */}
      <div className="p-4 border-b border-slate-700/60 flex items-center justify-between">
        <HeaderBranding variant="dark" />
      </div>

      {/* Navigasi Utama */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-300">
              {group.title}
            </div>
            <div className="space-y-1">
              {group.items.map((item) => {
                const Icon = item.icon;
                const isActive = path === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={onClose}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-secondary-container text-white shadow-md font-semibold'
                        : 'text-slate-200 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-400 text-slate-900">
                        {item.badge}
                      </span>
                    )}
                    {isActive && !item.badge && (
                      <ChevronRight className="w-4 h-4 text-white/70" />
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Sidebar: Tautan Cepat Publik & Logout */}
      <div className="p-3 border-t border-slate-700/60 space-y-2">
        <Link
          href="/"
          className="flex items-center justify-between w-full px-3 py-2 text-xs font-medium text-slate-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5" />
            Portal Publik
          </span>
          <span className="text-[10px] text-slate-400">Lihat Web</span>
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-medium text-rose-300 hover:text-rose-200 hover:bg-rose-950/40 rounded-lg transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Keluar Sesi
        </Link>
      </div>
    </aside>
  );
};
