import React, { useState } from 'react';
import { HeaderBranding } from '@/components/layout/HeaderBranding';
import { useRouter, Link } from '@/lib/router';
import { loginApi, verifyForgotPasswordApi, resetPasswordApi } from '@/lib/api';
import {
  LogIn,
  ShieldCheck,
  Store,
  AlertCircle,
  KeyRound,
  X,
  CheckCircle2,
  Eye,
  EyeOff,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { navigate } = useRouter();
  const [role, setRole] = useState<'pedagang' | 'admin'>('pedagang');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // State Modal Lupa Kata Sandi
  const [forgotOpen, setForgotOpen] = useState(false);
  const [forgotStep, setForgotStep] = useState<1 | 2>(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotPhone, setForgotPhone] = useState('');
  const [forgotHint, setForgotHint] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [verifiedName, setVerifiedName] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [forgotSuccess, setForgotSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await loginApi(identifier, password, role);
      if (res.user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/pedagang/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login gagal. Periksa kembali kredensial Anda.');
    } finally {
      setLoading(false);
    }
  };

  const openForgotModal = () => {
    setForgotOpen(true);
    setForgotStep(1);
    setForgotEmail('');
    setForgotPhone('');
    setForgotHint('');
    setResetToken('');
    setNewPassword('');
    setConfirmNewPassword('');
    setForgotError(null);
    setForgotSuccess(null);
  };

  const handleVerifyIdentity = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    setForgotLoading(true);
    try {
      const res = await verifyForgotPasswordApi(forgotEmail, forgotPhone, forgotHint);
      setResetToken(res.resetToken);
      setVerifiedName(res.userName);
      setForgotStep(2);
    } catch (err: any) {
      setForgotError(err.message || 'Verifikasi identitas gagal.');
    } finally {
      setForgotLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError(null);
    if (newPassword.length < 6) {
      setForgotError('Kata sandi baru minimal 6 karakter.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setForgotError('Konfirmasi kata sandi baru tidak cocok.');
      return;
    }

    setForgotLoading(true);
    try {
      const res = await resetPasswordApi(resetToken, newPassword, confirmNewPassword);
      setForgotSuccess(res.message);
      setTimeout(() => {
        setForgotOpen(false);
      }, 1800);
    } catch (err: any) {
      setForgotError(err.message || 'Gagal mereset kata sandi.');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-block mb-4">
          <HeaderBranding />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-text-primary">
          Masuk ke Smart Street Vendor
        </h2>
        <p className="mt-1 text-xs text-text-muted">
          Pusat integrasi pendataan dan pemetaan PKL Kota Bandar Lampung
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 shadow-card rounded-2xl border border-border-subtle sm:px-10 space-y-6">
          {/* Tab Pemilihan Peran */}
          <div className="flex rounded-xl bg-surface-container-low border border-border-subtle p-1">
            <button
              type="button"
              onClick={() => {
                setRole('pedagang');
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                role === 'pedagang'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <Store className="w-4 h-4" />
              <span>Pedagang PKL</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setRole('admin');
                setError(null);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                role === 'admin'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Pemkot</span>
            </button>
          </div>

          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">
                Alamat Email / Nomor Telepon
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder={role === 'admin' ? 'admin@bandarlampungkota.go.id' : '0812xxxx atau email terdaftar'}
                className="w-full text-sm bg-surface-container-low border border-border-subtle rounded-xl px-3.5 py-2.5 text-text-primary placeholder:text-text-muted/60 outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-text-primary">
                  Kata Sandi
                </label>
                <button
                  type="button"
                  onClick={openForgotModal}
                  className="text-[11px] font-semibold text-primary hover:underline cursor-pointer"
                >
                  Lupa Kata Sandi?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-sm bg-surface-container-low border border-border-subtle rounded-xl px-3.5 py-2.5 pr-10 text-text-primary placeholder:text-text-muted/60 outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-text-muted hover:text-text-primary cursor-pointer"
                  aria-label="Tampilkan atau sembunyikan kata sandi"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-primary hover:bg-primary-hover text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Memverifikasi Akun...' : `Masuk sebagai ${role === 'admin' ? 'Admin' : 'Pedagang'}`}</span>
            </button>
          </form>

          <div className="pt-4 border-t border-border-subtle text-center text-xs text-text-muted">
            Belum memiliki akun pedagang?{' '}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Daftar Usaha Baru
            </Link>
          </div>
        </div>
      </div>

      {/* Modal Lupa Kata Sandi */}
      {forgotOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-card max-w-md w-full p-6 border border-border-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-base font-bold text-text-primary flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-primary" />
                Reset Kata Sandi Akun
              </h3>
              <button
                type="button"
                onClick={() => setForgotOpen(false)}
                className="text-text-muted hover:text-text-primary cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {forgotError && (
              <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                <span>{forgotError}</span>
              </div>
            )}

            {forgotSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{forgotSuccess}</span>
              </div>
            )}

            {forgotStep === 1 ? (
              <form onSubmit={handleVerifyIdentity} className="space-y-3 text-xs">
                <p className="text-text-muted leading-relaxed">
                  Masukkan Email dan Nomor HP yang terdaftar beserta Nama Usaha / NIK Anda untuk verifikasi kepemilikan akun.
                </p>

                <div>
                  <label className="block font-semibold text-text-primary mb-1">Email Terdaftar *</label>
                  <input
                    type="email"
                    required
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="contoh@gmail.com"
                    className="w-full bg-surface-container-low border border-border-subtle rounded-xl px-3 py-2.5 text-text-primary outline-none focus:bg-white focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-text-primary mb-1">Nomor HP / WhatsApp Terdaftar *</label>
                  <input
                    type="tel"
                    required
                    value={forgotPhone}
                    onChange={(e) => setForgotPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full bg-surface-container-low border border-border-subtle rounded-xl px-3 py-2.5 text-text-primary outline-none focus:bg-white focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-text-primary mb-1">
                    Nama Usaha atau NIK (khusus akun Pedagang)
                  </label>
                  <input
                    type="text"
                    value={forgotHint}
                    onChange={(e) => setForgotHint(e.target.value)}
                    placeholder="Contoh: Soto Betawi Bang Joko atau 1871..."
                    className="w-full bg-surface-container-low border border-border-subtle rounded-xl px-3 py-2.5 text-text-primary outline-none focus:bg-white focus:border-primary"
                  />
                </div>

                <div className="pt-3 border-t border-border-subtle flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotOpen(false)}
                    className="px-4 py-2 border border-border-subtle text-text-muted font-semibold rounded-xl hover:bg-surface-container-low cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-4 py-2 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover shadow-xs cursor-pointer disabled:opacity-60"
                  >
                    {forgotLoading ? 'Memeriksa...' : 'Verifikasi Identitas'}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-3 text-xs">
                <div className="p-2.5 bg-surface-container-low border border-border-subtle rounded-xl text-text-primary">
                  Akun terverifikasi: <strong>{verifiedName}</strong>
                </div>

                <div>
                  <label className="block font-semibold text-text-primary mb-1">Kata Sandi Baru *</label>
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full bg-surface-container-low border border-border-subtle rounded-xl px-3 py-2.5 text-text-primary outline-none focus:bg-white focus:border-primary"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-text-primary mb-1">Konfirmasi Kata Sandi Baru *</label>
                  <input
                    type="password"
                    required
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Ulangi kata sandi baru"
                    className="w-full bg-surface-container-low border border-border-subtle rounded-xl px-3 py-2.5 text-text-primary outline-none focus:bg-white focus:border-primary"
                  />
                </div>

                <div className="pt-3 border-t border-border-subtle flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setForgotStep(1)}
                    className="px-4 py-2 border border-border-subtle text-text-muted font-semibold rounded-xl hover:bg-surface-container-low cursor-pointer"
                  >
                    Kembali
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading}
                    className="px-4 py-2 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover shadow-xs cursor-pointer disabled:opacity-60"
                  >
                    {forgotLoading ? 'Menyimpan...' : 'Simpan Kata Sandi Baru'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
