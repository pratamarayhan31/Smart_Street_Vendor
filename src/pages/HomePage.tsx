import React, { useState, useMemo } from 'react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { LeafletMap } from '@/components/map/LeafletMap';
import { VendorDetailModal } from '@/components/ui/VendorDetailModal';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { getStoredVendors, getStoredCategories } from '@/lib/store';
import { DISTRICTS } from '@/lib/data';
import { Vendor } from '@/types';
import { Link } from '@/lib/router';
import { 
  Search, 
  MapPin, 
  Store, 
  Filter, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  FileEdit, 
  Compass,
  RotateCcw
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const [vendors] = useState<Vendor[]>(() => getStoredVendors());
  const [categories] = useState(() => getStoredCategories());
  
  // State Filter & Pencarian
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Semua');
  const [selectedVendorForModal, setSelectedVendorForModal] = useState<Vendor | null>(null);

  // Filter vendor publik (yang disetujui / isPublic)
  const publicVendors = useMemo(() => {
    return vendors.filter((v) => v.isPublic && v.status === 'terverifikasi');
  }, [vendors]);

  const filteredVendors = useMemo(() => {
    return publicVendors.filter((vendor) => {
      const matchSearch =
        searchQuery === '' ||
        vendor.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === 'Semua' || vendor.category === selectedCategory;

      const matchDistrict =
        selectedDistrict === 'Semua' || vendor.district === selectedDistrict;

      return matchSearch && matchCategory && matchDistrict;
    });
  }, [publicVendors, searchQuery, selectedCategory, selectedDistrict]);

  const handleResetFilter = () => {
    setSearchQuery('');
    setSelectedCategory('Semua');
    setSelectedDistrict('Semua');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <PublicNavbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-primary text-white py-16 lg:py-20">
          {/* Subtle background glow */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-primary-container/40 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              {/* Badge Pemkot & Kampus */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-slate-200">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Pemerintah Kota Bandar Lampung &bull; Universitas Teknokrat Indonesia</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Temukan Pedagang Kaki Lima di <span className="text-secondary-container">Kota Bandar Lampung</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
                Sistem informasi pendataan dan pemetaan spasial berbasis web untuk mempermudah pencarian lapak usaha, mendukung UMKM lokal, dan mewujudkan tata kelola Smart City yang teratur.
              </p>

              {/* SEARCH BAR HERO */}
              <div className="bg-white p-2 sm:p-2.5 rounded-2xl shadow-xl max-w-2xl mx-auto border border-slate-200 text-slate-900 flex flex-col sm:flex-row items-center gap-2">
                <div className="flex items-center gap-2.5 flex-1 px-3 w-full">
                  <Search className="w-5 h-5 text-secondary flex-shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Cari nama usaha kuliner, martabak, es segar..."
                    className="w-full text-sm sm:text-base outline-none bg-transparent placeholder:text-slate-400 py-1.5"
                  />
                </div>
                <div className="flex items-center gap-2 w-full sm:w-auto">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 outline-none w-full sm:w-auto"
                  >
                    <option value="Semua">Semua Kategori</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                  <Link
                    href="/peta"
                    className="flex-shrink-0 bg-primary hover:bg-primary-container text-white px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>Cari</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* STATISTIK CEPAT */}
              <div className="pt-6 grid grid-cols-3 gap-4 max-w-xl mx-auto text-center border-t border-white/10">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    {publicVendors.length}
                  </div>
                  <div className="text-xs text-slate-300">Lapak Terverifikasi</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    14+
                  </div>
                  <div className="text-xs text-slate-300">Kecamatan Aktif</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    {categories.length}
                  </div>
                  <div className="text-xs text-slate-300">Kategori Dagangan</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION PETA DIGITAL PREVIEW */}
        <section className="py-12 bg-white border-b border-border-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">
                  EKSPLORASI SPASIAL
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-primary">
                  Peta Persebaran Titik Lapak PKL
                </h2>
                <p className="text-sm text-text-muted mt-1">
                  Klik pin penanda untuk melihat foto dan informasi lapak PKL resmi terverifikasi.
                </p>
              </div>
              <Link
                href="/peta"
                className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-low text-secondary font-semibold text-sm rounded-xl hover:bg-surface-container transition-colors"
              >
                <Compass className="w-4 h-4" />
                <span>Buka Layar Penuh</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Peta Interaktif Langsung */}
            <LeafletMap
              vendors={publicVendors}
              onSelectVendor={(v) => setSelectedVendorForModal(v)}
              height="450px"
            />
          </div>
        </section>

        {/* SECTION KATALOG LISTING PEDAGANG */}
        <section id="katalog" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-subtle pb-4">
            <div>
              <h2 className="text-2xl font-bold text-primary">
                Katalog Lapak Pedagang
              </h2>
              <p className="text-sm text-text-muted">
                Menampilkan {filteredVendors.length} dari {publicVendors.length} lapak terdaftar
              </p>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 mr-1">
                <Filter className="w-3.5 h-3.5" />
                <span>Filter:</span>
              </div>
              {/* Kecamatan */}
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="text-xs bg-white border border-border-subtle rounded-lg px-3 py-2 text-slate-700 outline-none shadow-xs"
              >
                <option value="Semua">Semua Kecamatan</option>
                {DISTRICTS.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>

              {/* Kategori */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs bg-white border border-border-subtle rounded-lg px-3 py-2 text-slate-700 outline-none shadow-xs"
              >
                <option value="Semua">Semua Kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>

              {(searchQuery || selectedCategory !== 'Semua' || selectedDistrict !== 'Semua') && (
                <button
                  onClick={handleResetFilter}
                  className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 bg-rose-50 px-2.5 py-2 rounded-lg transition-colors"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </div>
          </div>

          {/* GRID KARTU VENDOR */}
          {filteredVendors.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300 p-8 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto text-slate-400">
                <Store className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-800">
                Tidak ada lapak yang cocok dengan kriteria pencarian
              </h3>
              <p className="text-xs text-text-muted max-w-sm mx-auto">
                Silakan coba ubah kata kunci pencarian, filter wilayah kecamatan, atau reset filter Anda.
              </p>
              <button
                onClick={handleResetFilter}
                className="px-4 py-2 bg-primary text-white text-xs font-semibold rounded-lg hover:bg-primary-container transition-colors inline-block"
              >
                Reset Pencarian
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredVendors.map((vendor) => (
                <div
                  key={vendor.id}
                  className="bg-white rounded-xl border border-border-subtle overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col group"
                >
                  {/* Foto Lapak */}
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={vendor.photoUrl}
                      alt={vendor.businessName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white/90 text-primary px-2 py-0.5 rounded backdrop-blur-xs shadow-xs">
                        {vendor.category}
                      </span>
                    </div>
                  </div>

                  {/* Konten Kartu */}
                  <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-base text-primary line-clamp-1 group-hover:text-secondary transition-colors">
                        {vendor.businessName}
                      </h3>
                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {vendor.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-slate-100 space-y-1.5 text-xs text-text-muted">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                        <span className="truncate">{vendor.district} &bull; {vendor.address}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{vendor.operatingHours || '16:00 - 22:00 WIB'}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setSelectedVendorForModal(vendor)}
                      className="w-full py-2 bg-slate-50 hover:bg-surface-container-low text-primary hover:text-secondary font-semibold text-xs rounded-lg transition-colors border border-slate-200 flex items-center justify-center gap-1.5"
                    >
                      <span>Lihat Rincian Lapak</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* SECTION CALL TO ACTION UNTUK PEDAGANG */}
        <section className="bg-surface-container-low border-t border-border-subtle py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl p-8 sm:p-10 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-xl">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider bg-secondary/10 px-2.5 py-1 rounded-full">
                  Untuk Pedagang Kaki Lima
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-primary">
                  Daftarkan Usaha Anda ke Peta Digital Resmi
                </h3>
                <p className="text-sm text-text-muted leading-relaxed">
                  Tingkatkan visibilitas lapak Anda agar mudah ditemukan masyarakat dan pelanggan. Pendaftaran gratis dan langsung diproses verifikasi oleh petugas dinas terkait.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-container text-white font-semibold text-sm rounded-xl text-center shadow-sm transition-all"
                >
                  Daftar Akun Pedagang
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm rounded-xl text-center border border-slate-300 transition-colors"
                >
                  Masuk Portal
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />

      {/* Modal Popup Detail Usaha */}
      <VendorDetailModal
        vendor={selectedVendorForModal}
        onClose={() => setSelectedVendorForModal(null)}
      />
    </div>
  );
};

