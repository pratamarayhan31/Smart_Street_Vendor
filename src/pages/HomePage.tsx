import React, { useState, useMemo, useEffect } from 'react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { LeafletMap } from '@/components/map/LeafletMap';
import { VendorDetailModal } from '@/components/ui/VendorDetailModal';
import { getStoredVendors, getStoredCategories } from '@/lib/store';
import { fetchVendorsApi, fetchCategoriesApi } from '@/lib/api';
import { Vendor, Category } from '@/types';
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
  Layers
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { navigate } = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>(() => getStoredVendors());
  const [categories, setCategories] = useState<Category[]>(() => getStoredCategories());
  const [selectedVendorForModal, setSelectedVendorForModal] = useState<Vendor | null>(null);

  useEffect(() => {
    fetchVendorsApi().then((data) => {
      if (data && data.length > 0) setVendors(data);
    }).catch(() => {});
    fetchCategoriesApi().then((data) => {
      if (data && data.length > 0) setCategories(data);
    }).catch(() => {});
  }, []);

  const publicVendors = useMemo(() => {
    return vendors.filter((v) => v.isPublic && v.status === 'terverifikasi');
  }, [vendors]);

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-text-primary">
      <PublicNavbar />

      <main className="flex-1">
        {/* HERO SECTION DENGAN MERAH UTAMA & SENTUHAN BIRU MUDA */}
        <section className="relative overflow-hidden bg-primary text-white py-16 lg:py-24 border-b border-primary-container">
          {/* Subtle light accents */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-brand-blue-light/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto space-y-6">
              {/* Badge Pemkot & Kampus */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-xs font-semibold text-white">
                <Sparkles className="w-4 h-4 text-brand-blue-light" />
                <span>Pemerintah Kota Bandar Lampung &bull; Universitas Teknokrat Indonesia</span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
                Sistem Pendataan &amp; Pemetaan PKL <br />
                <span className="text-brand-blue-light">Kota Bandar Lampung</span>
              </h1>

              <p className="text-base sm:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto">
                Platform Smart City resmi untuk mempermudah pencarian lapak pedagang kaki lima, mendukung kemajuan UMKM lokal, dan mewujudkan tata kelola perkotaan yang terintegrasi.
              </p>

              {/* ACTION SHORTCUT BUTTONS */}
              <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
                <Link
                  href="/katalog"
                  className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-surface-container-low text-primary font-bold text-sm rounded-xl shadow-soft transition-all flex items-center justify-center gap-2 group"
                >
                  <Compass className="w-4 h-4 text-primary" />
                  <span>Jelajahi Katalog PKL</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
                <Link
                  href="/peta"
                  className="w-full sm:w-auto px-6 py-3.5 bg-primary-container hover:bg-primary-container/80 text-white font-semibold text-sm rounded-xl border border-white/25 backdrop-blur-xs transition-colors flex items-center justify-center gap-2"
                >
                  <Map className="w-4 h-4 text-brand-blue-light" />
                  <span>Buka Peta Digital</span>
                </Link>
              </div>

              {/* STATISTIK CEPAT */}
              <div className="pt-8 grid grid-cols-3 gap-4 max-w-xl mx-auto text-center border-t border-white/15">
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    {publicVendors.length}
                  </div>
                  <div className="text-xs text-white/80 mt-0.5">Lapak Terdaftar</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    14+
                  </div>
                  <div className="text-xs text-white/80 mt-0.5">Kecamatan Aktif</div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-extrabold text-white">
                    {categories.length}
                  </div>
                  <div className="text-xs text-white/80 mt-0.5">Ragam Kategori</div>
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
                <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                  PETA SPASIAL KOTA
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
                  Persebaran Lokasi Pedagang Kaki Lima
                </h2>
                <p className="text-sm text-text-muted mt-1">
                  Pantau titik koordinat lapak PKL resmi terverifikasi di berbagai kecamatan Kota Bandar Lampung.
                </p>
              </div>
              <Link
                href="/peta"
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-surface-container-low text-primary font-bold text-xs sm:text-sm rounded-xl hover:bg-surface-container transition-colors border border-border-subtle shadow-soft"
              >
                <Compass className="w-4 h-4 text-primary" />
                <span>Buka Peta Layar Penuh</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <LeafletMap
              vendors={vendors}
              onSelectVendor={(v) => setSelectedVendorForModal(v)}
              height="420px"
            />
          </div>
        </section>

        {/* SECTION CUPLIKAN LAPAK UNGGULAN & SHORTCUT KATALOG */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-border-subtle pb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-primary mb-1">
                DIREKTORI USAHA
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
                Sebagian Pedagang Terdaftar
              </h2>
              <p className="text-sm text-text-muted mt-1">
                Untuk mencari, memfilter per kecamatan, dan melihat daftar lengkap, silakan kunjungi halaman Katalog Pedagang.
              </p>
            </div>
            <Link
              href="/katalog"
              className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm rounded-xl transition-colors shadow-soft"
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
                className="bg-white rounded-2xl border border-border-subtle overflow-hidden shadow-soft hover:shadow-card transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="relative h-44 w-full bg-surface-container-low overflow-hidden">
                    <img
                      src={vendor.photoUrl}
                      alt={vendor.businessName}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-white/95 text-primary px-2.5 py-1 rounded-lg shadow-soft backdrop-blur-xs border border-border-subtle">
                        {vendor.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-sm sm:text-base text-text-primary group-hover:text-primary transition-colors line-clamp-1">
                      {vendor.businessName}
                    </h3>
                    <div className="text-xs text-text-muted flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                      <span className="truncate">{vendor.district}</span>
                    </div>
                    <div className="text-xs text-text-muted flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                      <span>{vendor.operatingHours || '16:00 - 22:00 WIB'}</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 pt-0">
                  <button
                    onClick={() => setSelectedVendorForModal(vendor)}
                    className="w-full py-2.5 bg-surface-container-low hover:bg-surface-container text-primary font-bold text-xs rounded-xl transition-colors border border-border-subtle shadow-soft"
                  >
                    Lihat Rincian
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Panel Informasi dengan Aksen Biru Muda (#DCEEFF & #F2F8FF) */}
          <div className="p-6 bg-surface-container-low border border-border-subtle rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left shadow-soft">
            <div className="space-y-1">
              <h4 className="text-base font-bold text-text-primary">
                Ingin mencari lapak tertentu di kecamatan Anda?
              </h4>
              <p className="text-xs text-text-muted">
                Gunakan fitur pencarian nama usaha, nama pemilik, dan multi-filter kategori pada halaman Katalog.
              </p>
            </div>
            <Link
              href="/katalog"
              className="px-5 py-2.5 bg-primary hover:bg-primary-hover text-white font-bold text-xs rounded-xl transition-colors shadow-soft flex items-center gap-1.5 flex-shrink-0"
            >
              <Compass className="w-4 h-4" />
              <span>Menuju Halaman Katalog</span>
            </Link>
          </div>
        </section>

        {/* SECTION CALL TO ACTION UNTUK PEDAGANG */}
        <section className="bg-surface-container-low border-t border-border-subtle py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-2xl p-8 sm:p-10 border border-border-subtle shadow-soft flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-3 max-w-xl text-center md:text-left">
                <span className="text-xs font-bold text-primary uppercase tracking-wider bg-surface-container px-3 py-1 rounded-full border border-border-subtle inline-block">
                  Layanan Pedagang PKL
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-text-primary">
                  Daftarkan Usaha Anda ke Peta Digital Resmi
                </h3>
                <p className="text-xs sm:text-sm text-text-muted leading-relaxed">
                  Tingkatkan visibilitas lapak Anda agar mudah ditemukan masyarakat dan pelanggan. Pendaftaran gratis dan langsung diproses verifikasi oleh petugas dinas terkait.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                <Link
                  href="/register"
                  className="w-full sm:w-auto px-6 py-3 bg-primary hover:bg-primary-hover text-white font-bold text-xs sm:text-sm rounded-xl text-center shadow-soft transition-all"
                >
                  Daftar Akun Pedagang
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-surface-container-low text-text-primary font-semibold text-xs sm:text-sm rounded-xl text-center border border-border-subtle transition-colors shadow-soft"
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
