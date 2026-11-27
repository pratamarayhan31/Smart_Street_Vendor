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
    { label: 'Katalog Pedagang', href: '/katalog', icon: Compass },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-border-subtle shadow-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo Brand */}
          <div className="flex-shrink-0">
            <HeaderBranding />
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = path === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm transition-all ${
                    isActive
                      ? 'bg-surface-container-low text-primary font-bold'
                      : 'text-text-primary hover:text-primary hover:bg-surface-container-low font-medium'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-text-muted'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/login"
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-sm font-semibold text-text-primary hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors border border-border-subtle"
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk</span>
            </Link>
            <Link
              href="/pedagang/dashboard"
              className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary-hover rounded-lg shadow-soft transition-all"
            >
              <Store className="w-4 h-4" />
              <span>Portal Pedagang</span>
            </Link>
            <Link
              href="/admin/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-primary bg-surface-container hover:bg-surface-container-high rounded-lg transition-colors border border-border-subtle"
              title="Akses Langsung Admin Command Center"
            >
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span>Admin</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-surface-container-low"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border-subtle bg-white px-4 pt-3 pb-4 space-y-2 shadow-card">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = path === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-surface-container-low text-primary font-bold'
                    : 'text-text-primary hover:bg-surface-container-low'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-primary' : 'text-text-muted'}`} />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-border-subtle flex flex-col gap-2">
            <Link
              href="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold border border-border-subtle rounded-lg text-text-primary hover:bg-surface-container-low"
            >
              <LogIn className="w-4 h-4" />
              Masuk Akun
            </Link>
            <Link
              href="/pedagang/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2.5 text-sm font-semibold bg-primary text-white rounded-lg shadow-soft"
            >
              <Store className="w-4 h-4" />
              Portal Pedagang
            </Link>
            <Link
              href="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-2 text-sm font-bold text-primary bg-surface-container rounded-lg border border-border-subtle"
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
