import React, { useState } from 'react';
import { PedagangSidebar } from '@/components/layout/PedagangSidebar';
import { PedagangHeader } from '@/components/layout/PedagangHeader';
import { getStoredVendors, addOrUpdateVendor } from '@/lib/store';
import { CATEGORIES, DISTRICTS } from '@/lib/data';
import { Vendor } from '@/types';
import { Store, User, Upload, CheckCircle2, Image as ImageIcon } from 'lucide-react';

export const PedagangProfilePage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vendors] = useState<Vendor[]>(() => getStoredVendors());
  
  const currentVendor = vendors[0] || {
    id: 'PKL-001',
    businessName: 'Soto Betawi Bang Joko',
    ownerName: 'Pak Joko Santoso',
    phone: '081278912345',
    nik: '1871012304850001',
    category: 'Kuliner & Makanan Berat',
    description: 'Soto betawi kuah susu & santan gurih.',
    operatingHours: '16:00 - 23:00 WIB',
    address: 'Jl. R.A. Kartini No. 45',
    district: 'Tanjung Karang Pusat',
    subDistrict: 'Palapa',
    photoUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80',
  };

  const [ownerName, setOwnerName] = useState(currentVendor.ownerName);
  const [phone, setPhone] = useState(currentVendor.phone);
  const [nik, setNik] = useState(currentVendor.nik || '');
  const [businessName, setBusinessName] = useState(currentVendor.businessName);
  const [category, setCategory] = useState(currentVendor.category);
  const [description, setDescription] = useState(currentVendor.description);
  const [operatingHours, setOperatingHours] = useState(currentVendor.operatingHours || '16:00 - 22:00 WIB');
  const [address, setAddress] = useState(currentVendor.address);
  const [district, setDistrict] = useState(currentVendor.district);
  const [photoUrl, setPhotoUrl] = useState(currentVendor.photoUrl);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2 MB');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addOrUpdateVendor({
      id: currentVendor.id,
      ownerName,
      phone,
      nik,
      businessName,
      category,
      description,
      operatingHours,
      address,
      district,
      photoUrl,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <div className="hidden md:flex flex-shrink-0">
        <PedagangSidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-900/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 w-64 h-full">
            <PedagangSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <PedagangHeader 
          title="Profil & Data Usaha PKL" 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-4xl">
          {savedSuccess && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Perubahan profil dan informasi usaha berhasil disimpan ke sistem!</span>
            </div>
          )}

          <form onSubmit={handleSave} className="space-y-6">
            {/* Bagian 1: Data Identitas Pedagang */}
            <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-secondary" />
                <h3 className="text-sm font-bold text-primary">Identitas Pemilik Lapak</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap Pemilik *</label>
                  <input
                    type="text"
                    required
                    value={ownerName}
                    onChange={(e) => setOwnerName(e.target.value)}
                    className="w-full bg-slate-50 border border-border-subtle rounded-xl p-2.5 outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nomor WhatsApp / HP *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-slate-50 border border-border-subtle rounded-xl p-2.5 outline-none focus:bg-white"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Nomor Induk Kependudukan (NIK)</label>
                  <input
                    type="text"
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    className="w-full bg-slate-50 border border-border-subtle rounded-xl p-2.5 outline-none focus:bg-white"
                  />
                  <span className="text-[10px] text-text-muted mt-1 block">
                    Data NIK hanya untuk verifikasi internal petugas dinas dan dirahasiakan dari publik.
                  </span>
                </div>
              </div>
            </div>

            {/* Bagian 2: Data Informasi Usaha */}
            <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                <Store className="w-4 h-4 text-secondary" />
                <h3 className="text-sm font-bold text-primary">Informasi Lapak &amp; Dagangan</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Usaha / Lapak *</label>
                  <input
                    type="text"
                    required
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full bg-slate-50 border border-border-subtle rounded-xl p-2.5 outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kategori Dagangan *</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-border-subtle rounded-xl p-2.5 outline-none focus:bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Deskripsi Usaha &amp; Menu Utama</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-slate-50 border border-border-subtle rounded-xl p-2.5 outline-none focus:bg-white"
                    placeholder="Jelaskan menu andalan atau keistimewaan dagangan Anda..."
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Operasional</label>
                  <input
                    type="text"
                    value={operatingHours}
                    onChange={(e) => setOperatingHours(e.target.value)}
                    placeholder="Contoh: 16:00 - 23:00 WIB"
                    className="w-full bg-slate-50 border border-border-subtle rounded-xl p-2.5 outline-none focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kecamatan</label>
                  <select
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    className="w-full bg-slate-50 border border-border-subtle rounded-xl p-2.5 outline-none focus:bg-white"
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Alamat / Patokan Tempat Berjualan</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="Nama jalan atau patokan dekat bangunan terkenal"
                    className="w-full bg-slate-50 border border-border-subtle rounded-xl p-2.5 outline-none focus:bg-white"
                  />
                </div>
              </div>
            </div>

            {/* Bagian 3: Unggah Foto Lapak */}
            <div className="bg-white rounded-2xl border border-border-subtle p-6 shadow-xs space-y-4">
              <div className="border-b border-slate-100 pb-3 flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-secondary" />
                <h3 className="text-sm font-bold text-primary">Foto Lapak Tampak Depan</h3>
              </div>

              <div className="flex flex-col sm:flex-row gap-6 items-center">
                <div className="w-full sm:w-56 h-40 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 flex-shrink-0">
                  <img
                    src={photoUrl}
                    alt="Preview Lapak"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="space-y-3 text-xs">
                  <p className="text-slate-600 leading-relaxed">
                    Unggah foto tampak depan lapak Anda yang menampilkan gerobak/tenda dan nama usaha dengan jelas. Format JPG atau PNG, maksimal 2 MB.
                  </p>
                  <label className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold rounded-xl cursor-pointer transition-colors border border-slate-200">
                    <Upload className="w-4 h-4 text-secondary" />
                    <span>Pilih Foto dari Perangkat</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-primary hover:bg-primary-container text-white font-semibold text-sm rounded-xl shadow-xs transition-colors"
              >
                Simpan Pembaruan Usaha
              </button>
            </div>
          </form>
        </main>
      </div>
    </div>
  );
};

