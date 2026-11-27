import React, { useState } from 'react';
import { Menu, MapPin, KeyRound } from 'lucide-react';
import { getCurrentUser } from '@/lib/store';
import { ChangePasswordModal } from '@/components/ui/ChangePasswordModal';

interface PedagangHeaderProps {
  onMenuToggle?: () => void;
  title?: string;
}

export const PedagangHeader: React.FC<PedagangHeaderProps> = ({
  onMenuToggle,
  title = 'Portal Mandiri Pedagang PKL',
}) => {
  const user = getCurrentUser();
  const [pwdModalOpen, setPwdModalOpen] = useState(false);

  return (
    <>
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
          <button
            type="button"
            onClick={() => setPwdModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-semibold text-text-primary bg-surface-container-low hover:bg-surface-container px-3 py-1.5 rounded-lg transition-colors border border-border-subtle cursor-pointer"
            title="Ubah Kata Sandi Akun"
          >
            <KeyRound className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">Ganti Password</span>
          </button>

          <div className="flex items-center gap-2.5 pl-3 border-l border-border-subtle">
            <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow-soft">
              PKL
            </div>
            <div className="hidden lg:flex flex-col text-left">
              <span className="text-xs font-bold text-text-primary leading-tight">
                {user?.name || 'Pedagang PKL'}
              </span>
              <span className="text-[10px] text-text-muted">
                {user?.phone || user?.email || 'Pedagang Terdaftar'}
              </span>
            </div>
          </div>
        </div>
      </header>

      <ChangePasswordModal isOpen={pwdModalOpen} onClose={() => setPwdModalOpen(false)} />
    </>
  );
};
