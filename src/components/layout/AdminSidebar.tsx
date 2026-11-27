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
    <aside className="w-64 h-full bg-white text-text-primary flex flex-col flex-shrink-0 border-r border-border-subtle shadow-soft">
      {/* Header Sidebar Brand */}
      <div className="p-4 border-b border-border-subtle flex items-center justify-between bg-surface-container-low/50">
        <HeaderBranding />
      </div>

      {/* Navigasi Utama */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {menuGroups.map((group) => (
          <div key={group.title}>
            <div className="px-3 mb-2 text-[10px] font-bold uppercase tracking-wider text-text-muted">
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
                        isActive 
                          ? 'bg-white text-primary' 
                          : 'bg-surface-container text-primary border border-border-subtle'
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
            </div>
          </div>
        ))}
      </nav>

      {/* Footer Sidebar: Tautan Cepat Publik & Logout */}
      <div className="p-3 border-t border-border-subtle bg-surface-container-low/40 space-y-1">
        <Link
          href="/"
          className="flex items-center justify-between w-full px-3 py-2 text-xs font-semibold text-text-primary hover:text-primary hover:bg-white rounded-lg transition-colors"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-primary" />
            Portal Publik
          </span>
          <span className="text-[10px] text-text-muted">Lihat Web</span>
        </Link>
        <Link
          href="/login"
          className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold text-primary hover:bg-rose-50 rounded-lg transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          Keluar Sesi
        </Link>
      </div>
    </aside>
  );
};
