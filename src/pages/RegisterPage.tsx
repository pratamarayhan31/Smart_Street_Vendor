import React, { useState } from 'react';
import { HeaderBranding } from '@/components/layout/HeaderBranding';
import { useRouter, Link } from '@/lib/router';
import { addOrUpdateVendor, setCurrentUser } from '@/lib/store';
import { DISTRICTS, CATEGORIES } from '@/lib/data';
import { Store, UserPlus, CheckCircle2, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { navigate } = useRouter();

  const [ownerName, setOwnerName] = useState('');
  const [phone, setPhone] = useState('');
  const [nik, setNik] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0].name);
  const [district, setDistrict] = useState(DISTRICTS[0].name);
  const [password, setPassword] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Buat data pedagang baru ke storage
    const newVendor = addOrUpdateVendor({
      ownerName,
      phone,
      nik,
      businessName,
      category,
      district,
      subDistrict: DISTRICTS.find((d) => d.name === district)?.subDistricts[0] || 'Kelurahan',
      address: `Jl. Protokol ${district}, Bandar Lampung`,
      description: `Usaha ${category} oleh ${ownerName}. Menyediakan aneka hidangan/produk berkualitas.`,
      status: 'menunggu',
      isPublic: false,
    });

    // Login sebagai pedagang baru
    setCurrentUser({
      id: `user-${newVendor.id}`,
      name: ownerName,
      email: `${phone}@pkl-lampung.id`,
      role: 'pedagang',
      vendorId: newVendor.id,
    });

    setSuccess(true);
    setTimeout(() => {
      navigate('/pedagang/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-10 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-block mb-3">
          <HeaderBranding />
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-primary">
          Pendaftaran Usaha PKL
        </h2>
        <p className="mt-1 text-xs text-text-muted">
          Daftarkan identitas dan usaha Anda ke sistem Smart Street Vendor Bandar Lampung
        </p>
      </div>

      <div className="mt-6 sm:mx-auto sm:w-full sm:max-w-xl px-4">
        <div className="bg-white py-8 px-6 shadow-md rounded-2xl border border-border-subtle sm:px-10">
          {success ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Pendaftaran Berhasil Dikirim!
              </h3>
              <p className="text-xs text-slate-600 max-w-sm mx-auto">
                Akun usaha Anda telah terdaftar dalam sistem dengan status <strong>Menunggu Verifikasi</strong>. Mengalihkan ke dashboard...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap Pemilik *
                  </label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    placeholder="Contoh: Bpk. Ahmad Dahlan"
                    className="w-full text-xs bg-white border border-border-subtle rounded-xl px-3.5 py-2.5 outline-none focus:border-secondary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp / HP *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full text-xs bg-white border border-border-subtle rounded-xl px-3.5 py-2.5 outline-none focus:border-secondary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor Induk Kependudukan (NIK)
                  </label>
                  <input
                    type="text"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    placeholder="1871xxxxxxxxxxxx (Internal)"
                    className="w-full text-xs bg-white border border-border-subtle rounded-xl px-3.5 py-2.5 outline-none focus:border-secondary"
                  />
                  <span className="text-[10px] text-slate-400">Dijaga kerahasiaannya oleh sistem.</span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kata Sandi Akun *
                  </label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Minimal 6 karakter"
                    className="w-full text-xs bg-white border border-border-subtle rounded-xl px-3.5 py-2.5 outline-none focus:border-secondary"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 space-y-4">
                <div className="text-xs font-bold uppercase tracking-wider text-secondary">
                  Informasi Lapak Usaha
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Usaha / Lapak Dagangan *
                  </label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    placeholder="Contoh: Pempek Cek Meymey Way Halim"
                    className="w-full text-xs bg-white border border-border-subtle rounded-xl px-3.5 py-2.5 outline-none focus:border-secondary"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Kategori Dagangan *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full text-xs bg-white border border-border-subtle rounded-xl px-3.5 py-2.5 outline-none focus:border-secondary"
                    >
                      {CATEGORIES.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Wilayah Kecamatan *
                    </label>
                    <select
                      value={district}
                      onChange={(e) => setDistrict(e.target.value)}
                      className="w-full text-xs bg-white border border-border-subtle rounded-xl px-3.5 py-2.5 outline-none focus:border-secondary"
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
                className="w-full mt-4 py-3 px-4 bg-primary hover:bg-primary-container text-white font-semibold text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                <span>Kirim Pendaftaran Usaha PKL</span>
              </button>
            </form>
          )}

          <div className="mt-6 text-center text-xs text-text-muted">
            Sudah memiliki akun?{' '}
            <Link href="/login" className="font-semibold text-secondary hover:underline">
              Masuk ke Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

