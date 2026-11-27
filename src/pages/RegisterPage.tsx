import React, { useState } from 'react';
import { HeaderBranding } from '@/components/layout/HeaderBranding';
import { useRouter, Link } from '@/lib/router';
import { registerApi } from '@/lib/api';
import { DISTRICTS, CATEGORIES } from '@/lib/data';
import { UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { navigate } = useRouter();

  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [nik, setNik] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [district, setDistrict] = useState(DISTRICTS[0].name);
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError('Kata sandi akun minimal 6 karakter.');
      return;
    }

    setLoading(true);
    try {
      const subDistrict = DISTRICTS.find((d) => d.name === district)?.subDistricts[0] || 'Kelurahan';
      await registerApi({
        ownerName,
        phone,
        email,
        nik,
        password,
        businessName,
        category,
        district,
        subDistrict,
        address: `Jl. Protokol ${district}, Bandar Lampung`,
        description: `Usaha ${category} oleh ${ownerName}. Menyediakan aneka hidangan/produk berkualitas.`,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/pedagang/dashboard');
      }, 1200);
    } catch (err: any) {
      setError(err.message || 'Gagal mendaftarkan akun. Periksa kembali data Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-block mb-3">
          <HeaderBranding />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-text-primary">
          Pendaftaran Usaha PKL
        </h2>
        <p className="mt-1 text-xs text-text-muted">
          Daftarkan identitas dan usaha Anda ke sistem Smart Street Vendor Bandar Lampung
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl px-4">
        <div className="bg-white py-8 px-6 shadow-card rounded-2xl border border-border-subtle sm:px-10">
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto border border-emerald-100">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-text-primary">
                Pendaftaran Berhasil Dikirim!
              </h3>
              <p className="text-xs text-text-muted max-w-sm mx-auto">
                Akun usaha Anda telah terdaftar dalam sistem dengan status <strong className="text-primary">Menunggu Verifikasi</strong>. Mengalihkan ke dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-semibold flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Nama Lengkap Pemilik *
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Contoh: Bpk. Ahmad Dahlan"
                    className="w-full text-xs bg-surface-container-low border border-border-subtle rounded-xl px-3.5 py-2.5 text-text-primary placeholder:text-text-muted/60 outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Nomor WhatsApp / HP *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full text-xs bg-surface-container-low border border-border-subtle rounded-xl px-3.5 py-2.5 text-text-primary placeholder:text-text-muted/60 outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Alamat Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@gmail.com"
                    className="w-full text-xs bg-surface-container-low border border-border-subtle rounded-xl px-3.5 py-2.5 text-text-primary placeholder:text-text-muted/60 outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Kata Sandi Akun *
                  </label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full text-xs bg-surface-container-low border border-border-subtle rounded-xl px-3.5 py-2.5 text-text-primary placeholder:text-text-muted/60 outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-text-primary mb-1">
                  Nomor Induk Kependudukan (NIK)
                </label>
                <input
                  type="text"
                  value={nik}
                  onChange={(e) => setNik(e.target.value)}
                  placeholder="1871xxxxxxxxxxxx (Internal)"
                  className="w-full text-xs bg-surface-container-low border border-border-subtle rounded-xl px-3.5 py-2.5 text-text-primary placeholder:text-text-muted/60 outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                />
                <span className="text-[10px] text-text-muted">Dijaga kerahasiaannya oleh sistem &amp; dapat digunakan untuk verifikasi lupa kata sandi.</span>
              </div>

              <div className="pt-2 border-t border-border-subtle space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-primary">
                  Informasi Lapak Usaha
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Nama Usaha / Lapak Dagangan *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Contoh: Pempek Cek Meymey Way Halim"
                    className="w-full text-xs bg-surface-container-low border border-border-subtle rounded-xl px-3.5 py-2.5 text-text-primary placeholder:text-text-muted/60 outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1">
                      Kategori Dagangan *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-xs bg-surface-container-low border border-border-subtle rounded-xl px-3.5 py-2.5 text-text-primary outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1">
                      Wilayah Kecamatan *
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full text-xs bg-surface-container-low border border-border-subtle rounded-xl px-3.5 py-2.5 text-text-primary outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all"
                    >
                      {DISTRICTS.map((d) => (
                        <option key={d.id} value={d.name}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 py-3 px-4 bg-primary hover:bg-primary-hover text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <UserPlus className="w-4 h-4" />
                <span>{loading ? 'Mendaftarkan Akun...' : 'Kirim Pendaftaran Usaha PKL'}</span>
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-xs text-text-muted">
            Sudah memiliki akun?{' '}
            <Link href="/login" className="font-semibold text-primary hover:underline">
              Masuk ke Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
