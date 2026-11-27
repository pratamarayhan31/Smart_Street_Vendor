import React, { useState, useMemo } from 'react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { LeafletMap } from '@/components/map/LeafletMap';
import { VendorDetailModal } from '@/components/ui/VendorDetailModal';
import { getStoredVendors, getStoredCategories } from '@/lib/store';
import { Vendor } from '@/types';
import { Link, useRouter } from '@/lib/router';
import { 
  Search, 
  MapPin, 
  Store, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  Compass, 
  Map, 
  Layers,
  CheckCircle2,
  UserPlus,
  ShieldCheck
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const [vendors] = useState<Vendor[]>(() => getStoredVendors());
  const [categories] = useState(() => getStoredCategories());
  const [selectedVendorForModal, setSelectedVendorForModal] = useState<Vendor | null>(null);
  const [searchHero, setSearchHero] = useState('');

  // Ambil hanya pedagang publik terverifikasi
  const publicVendors = useMemo(() => {
    return vendors.filter((v) => v.isPublic && v.status === 'terverifikasi');
  }, [vendors]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/katalog');
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] font-sans">
      <PublicNavbar />

      <main className="flex-1">
        {/* HERO SECTION PENGENALAN SISTEM */}
        <section className="relative overflow-hidden bg-primary text-white py-16 lg:py-24">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-primary-container/40 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              {/* Badge Pemkot & Kampus */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-medium text-slate-200">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Pemerintah Kota Bandar Lampung &bull; Universitas Teknokrat Indonesia</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Sistem Pendataan &amp; Pemetaan PKL <br />
                <span className="text-secondary-container">Kota Bandar Lampung</span>
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
                Platform Smart City resmi untuk mempermudah pencarian lapak pedagang kaki lima, mendukung kemajuan UMKM lokal, dan mewujudkan tata kelola perkotaan yang terintegrasi.
              </p>

              {/* ACTION SHORTCUT BUTTONS */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                <Link
                  href="/katalog"
                  className="w-full sm:w-auto px-6 py-3 bg-secondary-container hover:bg-secondary text-white font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 group"
                >
                  <Compass className="w-4 h-4" />
                  <span>Jelajahi Katalog PKL</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/peta"
                  className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm rounded-xl border border-white/20 backdrop-blur-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Map className="w-4 h-4 text-sky-300" />
                  <span>Buka Peta Digital</span>
                </Link>
              </div>

              {/* STATISTIK CEPAT */}
              <div className="pt-8 grid grid-cols-3 gap-4 max-w-xl mx-auto text-center border-t border-white/10">
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
                  <div className="text-xs text-slate-300">Ragam Kategori</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION CUPLIKAN PETA DIGITAL */}
        <section className="py-12 bg-white border-b border-border-subtle">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">
                  PETA SPASIAL KOTA
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-primary">
                  Persebaran Lokasi Pedagang Kaki Lima
                </h2>
                <p className="text-sm text-text-muted mt-1">
                  Pantau titik koordinat lapak PKL resmi terverifikasi di berbagai kecamatan Kota Bandar Lampung.
                </p>
              </div>
              <Link
                href="/peta"
                className="inline-flex items-center gap-2 px-4 py-2 bg-surface-container-low text-secondary font-semibold text-sm rounded-xl hover:bg-surface-container transition-colors shadow-2xs"
              >
                <Compass className="w-4 h-4" />
                <span>Buka Peta Layar Penuh</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <LeafletMap
              vendors={publicVendors}
              onSelectVendor={(v) => setSelectedVendorForModal(v)}
              height="420px"
            />
          </div>
        </section>

        {/* SECTION CUPLIKAN LAPAK UNGGULAN & SHORTCUT KATALOG */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border-subtle pb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-secondary mb-1">
                DIREKTORI USAHA
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-primary">
                Sebagian Pedagang Terdaftar
              </h2>
              <p className="text-sm text-text-muted mt-1">
                Untuk mencari, memfilter per kecamatan, dan melihat daftar lengkap, silakan kunjungi halaman Katalog Pedagang.
              </p>
            </div>
            <Link
              href="/katalog"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary-container text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shadow-xs"
            >
              <span>Buka Katalog Lengkap</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Grid 4 Kartu Rekomendasi */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {publicVendors.slice(0, 4).map((vendor) => (
              <div
                key={vendor.id}
                className="bg-white rounded-2xl border border-border-subtle overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 w-full bg-slate-100 overflow-hidden">
                    <img
                      src={vendor.photoUrl}
                      alt={vendor.businessName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white/95 text-primary px-2.5 py-1 rounded-lg shadow-2xs backdrop-blur-xs">
                        {vendor.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-sm sm:text-base text-primary group-hover:text-secondary transition-colors line-clamp-1">
                      {vendor.businessName}
                    </h3>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-secondary flex-shrink-0" />
                      <span className="truncate">{vendor.district}</span>
                    </div>
                    <div className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{vendor.operatingHours || '16:00 - 22:00 WIB'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => setSelectedVendorForModal(vendor)}
                    className="w-full py-2 bg-slate-50 hover:bg-surface-container-low text-primary hover:text-secondary font-semibold text-xs rounded-xl transition-colors border border-slate-200"
                  >
                    Lihat Rincian
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="p-6 bg-surface-container-low border border-slate-200/80 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div>
              <h4 className="text-base font-bold text-primary">
                Ingin mencari lapak tertentu di kecamatan Anda?
              </h4>
              <p className="text-xs text-text-muted mt-0.5">
                Gunakan fitur pencarian nama usaha, nama pemilik, dan multi-filter kategori pada halaman Katalog.
              </p>
            </div>
            <Link
              href="/katalog"
              className="px-5 py-2.5 bg-secondary text-white font-semibold text-xs rounded-xl hover:bg-secondary-container transition-colors shadow-xs flex items-center gap-1.5 flex-shrink-0"
            >
              <Compass className="w-4 h-4" />
              <span>Menuju Halaman Katalog</span>
            </Link>
          </div>
        </section>

        {/* SECTION CALL TO ACTION UNTUK PEDAGANG */}
        <section className="bg-slate-900 text-white py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-slate-800/80 rounded-2xl p-8 sm:p-10 border border-slate-700 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-xl text-center md:text-left">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider bg-sky-950 px-2.5 py-1 rounded-full border border-sky-800 inline-block">
                  Layanan Pedagang PKL
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Daftarkan Usaha Anda ke Peta Digital Resmi
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Tingkatkan visibilitas lapak Anda agar mudah ditemukan masyarakat dan pelanggan. Pendaftaran gratis dan langsung diproses verifikasi oleh petugas dinas terkait.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-6 py-3 bg-secondary hover:bg-secondary-container text-white font-semibold text-xs sm:text-sm rounded-xl text-center shadow-xs transition-all"
                >
                  Daftar Akun Pedagang
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white font-semibold text-xs sm:text-sm rounded-xl text-center border border-slate-600 transition-colors"
                >
                  Masuk Portal
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <PublicFooter />

      <VendorDetailModal
        vendor={selectedVendorForModal}
        onClose={() => setSelectedVendorForModal(null)}
      />
    </div>
  );
};
