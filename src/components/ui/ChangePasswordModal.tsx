import React, { useState } from 'react';
import { changePasswordApi } from '@/lib/api';
import { KeyRound, X, CheckCircle2, AlertCircle, Eye, EyeOff } from 'lucide-react';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword.length < 6) {
      setError('Kata sandi baru minimal 6 karakter.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    setLoading(true);
    try {
      const res = await changePasswordApi(oldPassword, newPassword, confirmPassword);
      setSuccess(res.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setSuccess(null);
        onClose();
      }, 1800);
    } catch (err: any) {
      setError(err.message || 'Gagal mengganti kata sandi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-card max-w-md w-full p-6 border border-border-subtle space-y-4">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
            <KeyRound className="w-4 h-4 text-primary" />
            Ganti Kata Sandi Akun
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="text-text-muted hover:text-text-primary cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3 text-xs">
          <div>
            <label className="block font-semibold text-text-primary mb-1">Kata Sandi Lama *</label>
            <div className="relative">
              <input
                type={showOld ? 'text' : 'password'}
                required
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Masukkan kata sandi saat ini"
                className="w-full bg-surface-container-low border border-border-subtle rounded-xl px-3 py-2.5 pr-9 text-text-primary outline-none focus:bg-white focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowOld(!showOld)}
                className="absolute right-2.5 top-2.5 text-text-muted hover:text-text-primary"
              >
                {showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-text-primary mb-1">Kata Sandi Baru *</label>
            <div className="relative">
              <input
                type={showNew ? 'text' : 'password'}
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Minimal 6 karakter"
                className="w-full bg-surface-container-low border border-border-subtle rounded-xl px-3 py-2.5 pr-9 text-text-primary outline-none focus:bg-white focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-2.5 top-2.5 text-text-muted hover:text-text-primary"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block font-semibold text-text-primary mb-1">Konfirmasi Kata Sandi Baru *</label>
            <input
              type={showNew ? 'text' : 'password'}
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Ulangi kata sandi baru"
              className="w-full bg-surface-container-low border border-border-subtle rounded-xl px-3 py-2.5 text-text-primary outline-none focus:bg-white focus:border-primary"
            />
          </div>

          <div className="pt-3 border-t border-border-subtle flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border-subtle text-text-muted font-semibold rounded-xl hover:bg-surface-container-low cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover shadow-xs cursor-pointer disabled:opacity-60"
            >
              {loading ? 'Menyimpan...' : 'Simpan Kata Sandi'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

