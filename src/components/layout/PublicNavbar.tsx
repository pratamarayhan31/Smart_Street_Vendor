import React, { useState } from 'react';
import { Link, useRouter } from '@/lib/router';
import { HeaderBranding } from './HeaderBranding';
import { 
  MapPin, 
  Store, 
  LogIn, 
  ShieldCheck, 
  Menu, 
  X,
  Compass
} from 'lucide-react';

export const PublicNavbar: React.FC = () => {
  const { path } = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'Beranda', href: '/', icon: Store },
    { label: 'Peta Digital PKL', href: '/peta', icon: MapPin },
    { label: 'Katalog Pedagang', href: '/#katalog', icon: Compass },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border-subtle shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div className="flex-shrink-0">
            <HeaderBranding />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = path === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-surface-container-low text-secondary font-semibold'
                      : 'text-text-primary hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4 text-secondary" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons & Simulation Indicator */}
          <div className="hidden md:flex items-center gap-3">
            <span className="text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full">
              Prototipe / Data Simulasi
            </span>
            <div className="h-4 w-[1px] bg-slate-200" />
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-primary hover:text-secondary hover:bg-slate-50 rounded-lg transition-colors border border-border-subtle"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk</span>
            </Link>
            <Link
              href="/pedagang/dashboard"
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-medium text-white bg-primary hover:bg-primary-container rounded-lg shadow-xs transition-all hover:shadow-sm"
            >
              <Store className="w-4 h-4" />
              <span>Portal Pedagang</span>
            </Link>
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-secondary bg-secondary/10 hover:bg-secondary/20 rounded-lg transition-colors"
              title="Akses Langsung Admin Command Center"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border-subtle bg-white px-4 pt-2 pb-4 space-y-2 shadow-lg">
          <div className="py-1">
            <span className="text-[11px] font-medium bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full inline-block mb-2">
              Prototipe / Data Simulasi
            </span>
          </div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium text-slate-800 hover:bg-slate-100"
              >
                <Icon className="w-5 h-5 text-secondary" />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium border border-border-subtle rounded-lg text-slate-800 hover:bg-slate-50"
            >
              <LogIn className="w-4 h-4" />
              Masuk Akun
            </Link>
            <Link
              href="/pedagang/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2 text-sm font-medium bg-primary text-white rounded-lg"
            >
              <Store className="w-4 h-4" />
              Portal Pedagang
            </Link>
            <Link
              href="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2 text-sm font-semibold text-secondary bg-secondary/10 rounded-lg"
            >
              <ShieldCheck className="w-4 h-4" />
              Admin Command Center
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
