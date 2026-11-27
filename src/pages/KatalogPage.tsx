import React, { useState, useMemo, useEffect } from 'react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { PublicFooter } from '@/components/layout/PublicFooter';
import { VendorDetailModal } from '@/components/ui/VendorDetailModal';
import { getStoredVendors, getStoredCategories } from '@/lib/store';
import { fetchVendorsApi, fetchCategoriesApi } from '@/lib/api';
import { DISTRICTS } from '@/lib/data';
import { Vendor, Category } from '@/types';
import { Link, useRouter } from '@/lib/router';
import { 
  Search, 
  MapPin, 
  Store, 
  Clock, 
  User, 
  ArrowRight, 
  RotateCcw, 
  Compass, 
  ChevronDown,
  Layers,
  Map
} from 'lucide-react';

export const KatalogPage: React.FC = () => {
  const { navigate } = useRouter();
  const [vendors, setVendors] = useState<Vendor[]>(() => getStoredVendors());
  const [categories, setCategories] = useState<Category[]>(() => getStoredCategories());

  useEffect(() => {
    fetchVendorsApi().then((data) => {
      if (data && data.length > 0) setVendors(data);
    }).catch(() => {});
    fetchCategoriesApi().then((data) => {
      if (data && data.length > 0) setCategories(data);
    }).catch(() => {});
  }, []);

  // State Filter & Pencarian
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Semua');
  const [sortBy, setSortBy] = useState<string>('default');
  const [selectedVendorForModal, setSelectedVendorForModal] = useState<Vendor | null>(null);

  // Pagination / Load More
  const [itemsPerPage] = useState<number>(8);
  const [page, setPage] = useState<number>(1);

  // Ambil hanya pedagang publik terverifikasi
  const publicVendors = useMemo(() => {
    return vendors.filter((v) => v.isPublic && v.status === 'terverifikasi');
  }, [vendors]);

  // Logika Filter dan Sorting
  const filteredVendors = useMemo(() => {
    let result = publicVendors.filter((vendor) => {
      const matchSearch =
        searchQuery === '' ||
        vendor.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === 'Semua' || vendor.category === selectedCategory;

      const matchDistrict =
        selectedDistrict === 'Semua' || vendor.district === selectedDistrict;

      return matchSearch && matchCategory && matchDistrict;
    });

    // Sorting
    if (sortBy === 'name-asc') {
      result.sort((a, b) => a.businessName.localeCompare(b.businessName));
    } else if (sortBy === 'name-desc') {
      result.sort((a, b) => b.businessName.localeCompare(a.businessName));
    } else if (sortBy === 'newest') {
      result.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    }

    return result;
  }, [publicVendors, searchQuery, selectedCategory, selectedDistrict, sortBy]);

  // Paginated Data
  const paginatedVendors = useMemo(() => {
    return filteredVendors.slice(0, page * itemsPerPage);
  }, [filteredVendors, page, itemsPerPage]);

  const hasMore = paginatedVendors.length < filteredVendors.length;

  const handleResetFilter = () => {
    setSearchQuery('');
    setSelectedCategory('Semua');
    setSelectedDistrict('Semua');
    setSortBy('default');
    setPage(1);
  };

  const activeFilterCount = (selectedCategory !== 'Semua' ? 1 : 0) + 
                            (selectedDistrict !== 'Semua' ? 1 : 0) + 
                            (searchQuery ? 1 : 0) + 
                            (sortBy !== 'default' ? 1 : 0);

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans text-text-primary">
      <PublicNavbar />

      <main className="flex-1">
        {/* 1. HEADER KATALOG PEDAGANG */}
        <section className="bg-primary text-white border-b border-primary-container py-10 lg:py-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-80 h-80 bg-brand-blue-light/10 rounded-full blur-3xl pointer-events-none" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-3xl space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs border border-white/20 text-xs text-white font-medium">
                <Compass className="w-3.5 h-3.5 text-brand-blue-light" />
                <span>Pusat Direktori Resmi &bull; Kota Bandar Lampung</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                Katalog Pedagang Kaki Lima
              </h1>

              <p className="text-sm sm:text-base text-white/90 leading-relaxed max-w-2xl">
                Jelajahi dan temukan informasi lengkap pedagang kaki lima (PKL) terdaftar di Kota Bandar Lampung. 
                Cari berdasarkan nama lapak, pemilik, jenis kuliner/jajanan, hingga wilayah kecamatan.
              </p>

              {/* STATISTIK CHIPS */}
              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs">
                <div className="bg-white/15 border border-white/20 px-3.5 py-1.5 rounded-xl backdrop-blur-xs flex items-center gap-2">
                  <Store className="w-4 h-4 text-brand-blue-light" />
                  <span>Total <strong>{publicVendors.length} Pedagang</strong> Terdaftar</span>
                </div>
                <div className="bg-white/15 border border-white/20 px-3.5 py-1.5 rounded-xl backdrop-blur-xs flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-brand-blue-light" />
                  <span><strong>14+ Kecamatan</strong> Terdata</span>
                </div>
                <div className="bg-white/15 border border-white/20 px-3.5 py-1.5 rounded-xl backdrop-blur-xs flex items-center gap-2">
                  <Layers className="w-4 h-4 text-brand-blue-light" />
                  <span><strong>{categories.length} Kategori</strong> Dagangan</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. BAR PENCARIAN & MULTI-FILTER */}
        <section className="bg-white border-b border-border-subtle sticky top-16 z-30 shadow-soft">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3">
              {/* Kolom Pencarian Utama */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-text-muted absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setPage(1);
                  }}
                  placeholder="Cari nama usaha, pemilik (mis: Joko), soto, martabak..."
                  className="w-full text-xs sm:text-sm bg-surface-container-low border border-border-subtle rounded-xl pl-10 pr-4 py-2.5 outline-none focus:bg-white focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all text-text-primary placeholder:text-text-muted"
                />
              </div>

              {/* Filter Kontrol */}
              <div className="flex flex-wrap items-center gap-2">
                {/* Filter Kategori */}
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setPage(1);
                  }}
                  className="text-xs bg-surface-container-low hover:bg-surface-container border border-border-subtle rounded-xl px-3 py-2.5 text-text-primary outline-none font-semibold cursor-pointer transition-colors"
                >
                  <option value="Semua">Semua Kategori</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.name}>{c.name}</option>
                  ))}
                </select>

                {/* Filter Kecamatan */}
                <select
                  value={selectedDistrict}
                  onChange={(e) => {
                    setSelectedDistrict(e.target.value);
                    setPage(1);
                  }}
                  className="text-xs bg-surface-container-low hover:bg-surface-container border border-border-subtle rounded-xl px-3 py-2.5 text-text-primary outline-none font-semibold cursor-pointer transition-colors"
                >
                  <option value="Semua">Semua Kecamatan</option>
                  {DISTRICTS.map((d) => (
                    <option key={d.id} value={d.name}>{d.name}</option>
                  ))}
                </select>

                {/* Sorting */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs bg-surface-container-low hover:bg-surface-container border border-border-subtle rounded-xl px-3 py-2.5 text-text-primary outline-none font-semibold cursor-pointer transition-colors"
                >
                  <option value="default">Urutkan: Rekomendasi</option>
                  <option value="name-asc">Nama Usaha (A - Z)</option>
                  <option value="name-desc">Nama Usaha (Z - A)</option>
                  <option value="newest">Terbaru Terdaftar</option>
                </select>

                {/* Tombol Reset Filter */}
                {activeFilterCount > 0 && (
                  <button
                    onClick={handleResetFilter}
                    className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-bold text-primary bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors shadow-soft"
                    title="Bersihkan semua filter"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Reset ({activeFilterCount})</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* 3. HASIL DAN GRID KARTU PEDAGANG */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Status Bar Hasil */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-text-muted border-b border-border-subtle pb-3">
            <div>
              Menampilkan <strong className="text-text-primary">{Math.min(paginatedVendors.length, filteredVendors.length)}</strong> dari <strong className="text-text-primary">{filteredVendors.length}</strong> lapak yang cocok
              {selectedDistrict !== 'Semua' && <span> di wilayah <strong>{selectedDistrict}</strong></span>}
              {selectedCategory !== 'Semua' && <span> kategori <strong>{selectedCategory}</strong></span>}
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/peta"
                className="text-primary font-bold hover:underline flex items-center gap-1"
              >
                <Map className="w-3.5 h-3.5" />
                <span>Buka Tampilan Peta Digital</span>
              </Link>
            </div>
          </div>

          {/* TAMPILAN KOSONG JIKA TIDAK DITEMUKAN */}
          {filteredVendors.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-border-subtle p-8 space-y-4 max-w-lg mx-auto shadow-soft">
              <div className="w-14 h-14 rounded-full bg-surface-container-low flex items-center justify-center mx-auto text-primary">
                <Store className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-bold text-text-primary">
                  Pedagang Tidak Ditemukan
                </h3>
                <p className="text-xs text-text-muted leading-relaxed">
                  Tidak ada pedagang yang cocok dengan kata kunci <em>&quot;{searchQuery}&quot;</em> atau kombinasi filter wilayah dan kategori yang Anda pilih.
                </p>
              </div>
              <button
                onClick={handleResetFilter}
                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1.5 shadow-soft"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Pencarian &amp; Filter</span>
              </button>
            </div>
          ) : (
            <>
              {/* GRID KARTU RESPONSIVE */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {paginatedVendors.map((vendor) => (
                  <div
                    key={vendor.id}
                    className="bg-white rounded-2xl border border-border-subtle overflow-hidden shadow-soft hover:shadow-card transition-all duration-200 flex flex-col justify-between group"
                  >
                    <div>
                      {/* Foto Lapak & Badges */}
                      <div className="relative h-48 w-full bg-surface-container-low overflow-hidden">
                        <img
                          src={vendor.photoUrl}
                          alt={vendor.businessName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e: any) => {
                            e.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />

                        {/* Badge Kategori */}
                        <div className="absolute top-3 left-3">
                          <span className="text-[10px] font-bold uppercase tracking-wider bg-white/95 text-primary px-2.5 py-1 rounded-lg shadow-soft backdrop-blur-xs border border-border-subtle">
                            {vendor.category}
                          </span>
                        </div>

                        {/* Badge Status */}
                        <div className="absolute top-3 right-3">
                          <span className="text-[10px] font-bold bg-primary text-white px-2 py-0.5 rounded-full shadow-soft flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-white" />
                            <span>Terverifikasi</span>
                          </span>
                        </div>

                        {/* ID Pengenal Kecil */}
                        <div className="absolute bottom-2 left-3">
                          <span className="text-[10px] font-mono text-white/90 drop-shadow-xs">
                            {vendor.id}
                          </span>
                        </div>
                      </div>

                      {/* Konten Kartu */}
                      <div className="p-4 space-y-3">
                        <div>
                          <h3 className="font-bold text-base text-text-primary group-hover:text-primary transition-colors line-clamp-1 leading-snug">
                            {vendor.businessName}
                          </h3>
                          {vendor.ownerName && (
                            <div className="text-xs text-text-muted flex items-center gap-1 mt-0.5">
                              <User className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                              <span className="truncate">Pemilik: <strong>{vendor.ownerName}</strong></span>
                            </div>
                          )}
                        </div>

                        {/* Deskripsi Usaha Singkat */}
                        <p className="text-xs text-text-muted line-clamp-2 leading-relaxed">
                          {vendor.description || 'Menyediakan aneka produk dan layanan berkualitas bagi masyarakat Bandar Lampung.'}
                        </p>

                        {/* Detail Operasional & Alamat */}
                        <div className="pt-2 border-t border-border-subtle space-y-1.5 text-xs text-text-muted">
                          <div className="flex items-center gap-1.5 truncate">
                            <MapPin className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                            <span className="truncate font-medium text-text-primary">
                              {vendor.district} &bull; {vendor.address}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock className="w-3.5 h-3.5 text-text-muted flex-shrink-0" />
                            <span>
                              {vendor.operatingHours || '16:00 - 22:00 WIB'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Kartu & Tombol Aksi */}
                    <div className="p-4 pt-0">
                      <button
                        onClick={() => setSelectedVendorForModal(vendor)}
                        className="w-full py-2.5 px-3 bg-surface-container-low hover:bg-primary hover:text-white text-primary font-bold text-xs rounded-xl transition-all border border-border-subtle flex items-center justify-center gap-1.5 shadow-soft group/btn"
                      >
                        <span>Lihat Detail Lengkap</span>
                        <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 5. TOMBOL MUAT LEBIH BANYAK */}
              {hasMore && (
                <div className="text-center pt-8">
                  <button
                    onClick={() => setPage(page + 1)}
                    className="px-6 py-3 bg-white hover:bg-surface-container-low text-primary border border-border-subtle font-bold text-xs rounded-xl shadow-soft transition-colors inline-flex items-center gap-2"
                  >
                    <span>Muat Lebih Banyak Pedagang</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <p className="text-[11px] text-text-muted mt-2">
                    Menampilkan {paginatedVendors.length} dari {filteredVendors.length} lapak
                  </p>
                </div>
              )}
            </>
          )}
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
