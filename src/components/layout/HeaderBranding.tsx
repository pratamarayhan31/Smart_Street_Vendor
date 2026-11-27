import React from 'react';
import { Link } from '@/lib/router';

interface HeaderBrandingProps {
  variant?: 'light' | 'dark';
  compact?: boolean;
}

export const HeaderBranding: React.FC<HeaderBrandingProps> = ({
  variant = 'light',
  compact = false,
}) => {
  const isDark = variant === 'dark';

  return (
    <Link href="/" className="flex items-center gap-3 group">
      {/* Container Dua Logo Resmi */}
      <div className="flex items-center gap-2 bg-white p-1.5 rounded-lg border border-border-subtle shadow-soft transition-transform group-hover:scale-[1.02]">
        <img
          src="/images/logo-pemkot-bandar-lampung.jpg"
          alt="Logo Resmi Pemerintah Kota Bandar Lampung"
          className="h-9 w-auto max-w-[36px] object-contain"
          loading="eager"
        />
        <div className="h-6 w-[1px] bg-border-subtle" />
        <img
          src="/images/logo-universitas-teknokrat-indonesia.png"
          alt="Logo Resmi Universitas Teknokrat Indonesia"
          className="h-9 w-auto max-w-[36px] object-contain"
          loading="eager"
        />
      </div>

      {/* Teks Identitas Sistem */}
      {!compact && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-bold tracking-tight text-base ${
                isDark ? 'text-white' : 'text-primary'
              }`}
            >
              Smart Street Vendor
            </span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-container text-primary font-bold uppercase tracking-wider border border-border-subtle">
              Smart City
            </span>
          </div>
          <span
            className={`text-xs ${
              isDark ? 'text-slate-300' : 'text-text-muted'
            }`}
          >
            Kota Bandar Lampung
          </span>
        </div>
      )}
    </Link>
  );
};
