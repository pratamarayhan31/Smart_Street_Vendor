import React, { useState } from 'react';
import { HeaderBranding } from '@/components/layout/HeaderBranding';
import { useRouter, Link } from '@/lib/router';
import { setCurrentUser } from '@/lib/store';
import { LogIn, ShieldCheck, Store, ArrowRight, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { navigate } = useRouter();
  const [role, setRole] = useState<'pedagang' | 'admin'>('pedagang');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      if (role === 'admin') {
        setCurrentUser({
          id: 'admin-1',
          name: 'Petugas Administrator Pemkot',
          email: email || 'admin@bandarlampungkota.go.id',
          role: 'admin',
        });
        navigate('/admin/dashboard');
      } else {
        setCurrentUser({
          id: 'user-pkl-1',
          name: 'Pak Joko Santoso',
          email: email || 'pedagang@pkl-lampung.id',
          role: 'pedagang',
          vendorId: 'PKL-001',
        });
        navigate('/pedagang/dashboard');
      }
    }, 400);
  };

  const handleQuickLogin = (selectedRole: 'admin' | 'pedagang') => {
    if (selectedRole === 'admin') {
      setCurrentUser({
        id: 'admin-1',
        name: 'Petugas Administrator Pemkot',
        email: 'admin@bandarlampungkota.go.id',
        role: 'admin',
      });
      navigate('/admin/dashboard');
    } else {
      setCurrentUser({
        id: 'user-pkl-1',
        name: 'Pak Joko Santoso',
        email: 'joko@gmail.com',
        role: 'pedagang',
        vendorId: 'PKL-001',
      });
      navigate('/pedagang/dashboard');
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
              onClick={() => setRole('pedagang')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
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
              onClick={() => setRole('admin')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                role === 'admin'
                  ? 'bg-primary text-white shadow-xs'
                  : 'text-text-muted hover:text-text-primary'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Admin Pemkot</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">
                Alamat Email / Nomor Telepon
              </label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={role === 'admin' ? 'admin@bandarlampungkota.go.id' : '0812xxxx atau email'}
                className="w-full text-sm bg-surface-container-low border border-border-subtle rounded-xl px-3.5 py-2.5 text-text-primary placeholder:text-text-muted/60 outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-primary mb-1">
                Kata Sandi
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-sm bg-surface-container-low border border-border-subtle rounded-xl px-3.5 py-2.5 text-text-primary placeholder:text-text-muted/60 outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-primary hover:bg-primary-hover text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>{loading ? 'Memproses Masuk...' : `Masuk sebagai ${role === 'admin' ? 'Admin' : 'Pedagang'}`}</span>
            </button>
          </form>

          {/* Quick Demo Access Bar */}
          <div className="pt-4 border-t border-border-subtle space-y-2">
            <div className="text-[11px] font-bold uppercase tracking-wider text-text-muted text-center">
              Akses Instan Pengujian (Tanpa Ketik)
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                className="py-2 px-2.5 bg-surface-container-low hover:bg-surface-container border border-border-subtle rounded-lg text-xs font-semibold text-text-primary flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                <span>Masuk Admin</span>
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('pedagang')}
                className="py-2 px-2.5 bg-surface-container-low hover:bg-surface-container border border-border-subtle rounded-lg text-xs font-semibold text-text-primary flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <Store className="w-3.5 h-3.5 text-primary" />
                <span>Masuk Pedagang</span>
              </button>
            </div>
          </div>

          <div className="text-center text-xs text-text-muted">
            Belum memiliki akun pedagang?{' '}
            <Link href="/register" className="font-semibold text-primary hover:underline">
              Daftar Usaha Baru
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

