import React, { useState, useMemo } from 'react';
import { PublicNavbar } from '@/components/layout/PublicNavbar';
import { LeafletMap } from '@/components/map/LeafletMap';
import { VendorDetailModal } from '@/components/ui/VendorDetailModal';
import { getStoredVendors, getStoredCategories } from '@/lib/store';
import { DISTRICTS } from '@/lib/data';
import { Vendor } from '@/types';
import { 
  Search, 
  MapPin, 
  RotateCcw,
  SlidersHorizontal
} from 'lucide-react';

export const PublicMapPage: React.FC = () => {
  const [vendors] = useState<Vendor[]>(() => getStoredVendors());
  const [categories] = useState(() => getStoredCategories());
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('Semua');
  const [selectedCategory, setSelectedCategory] = useState<string>('Semua');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [modalVendor, setModalVendor] = useState<Vendor | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const publicVendors = useMemo(() => {
    return vendors.filter((v) => v.isPublic && v.status === 'terverifikasi');
  }, [vendors]);

  const filteredVendors = useMemo(() => {
    return publicVendors.filter((v) => {
      const matchSearch =
        searchQuery === '' ||
        v.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.address.toLowerCase().includes(searchQuery.toLowerCase());

      const matchDistrict =
        selectedDistrict === 'Semua' || v.district === selectedDistrict;

      const matchCategory =
        selectedCategory === 'Semua' || v.category === selectedCategory;

      return matchSearch && matchDistrict && matchCategory;
    });
  }, [publicVendors, searchQuery, selectedDistrict, selectedCategory]);

  const handleReset = () => {
    setSearchQuery('');
    setSelectedDistrict('Semua');
    setSelectedCategory('Semua');
    setSelectedVendor(null);
  };

  return (
    <div className="h-screen flex flex-col bg-background overflow-hidden font-sans text-text-primary">
      <PublicNavbar />

      <div className="flex-1 relative flex overflow-hidden">
        {/* SIDE PANEL DAFTAR & FILTER LAPAK */}
        <div
          className={`absolute md:relative z-20 h-full bg-white border-r border-border-subtle flex flex-col transition-all duration-300 shadow-card md:shadow-none ${
            sidebarOpen ? 'w-full sm:w-96 left-0' : '-left-full md:left-0 md:w-0'
          }`}
        >
          {/* Header Panel */}
          <div className="p-4 border-b border-border-subtle bg-surface-container-low space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-text-primary flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  Peta PKL Bandar Lampung
                </h2>
                <p className="text-xs text-text-muted">
                  {filteredVendors.length} lapak ditemukan
                </p>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-1.5 text-text-muted hover:text-text-primary"
              >
                Tutup
              </button>
            </div>

            {/* Input Pencarian */}
            <div className="relative">
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari nama usaha atau alamat..."
                className="w-full text-xs bg-white border border-border-subtle rounded-xl pl-9 pr-3 py-2 outline-none focus:border-primary text-text-primary"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="grid grid-cols-2 gap-2">
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                className="text-xs bg-white border border-border-subtle rounded-lg px-2.5 py-2 text-text-primary outline-none font-medium cursor-pointer"
              >
                <option value="Semua">Semua Wilayah</option>
                {DISTRICTS.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="text-xs bg-white border border-border-subtle rounded-lg px-2.5 py-2 text-text-primary outline-none font-medium cursor-pointer"
              >
                <option value="Semua">Semua Kategori</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {(searchQuery || selectedDistrict !== 'Semua' || selectedCategory !== 'Semua') && (
              <button
                onClick={handleReset}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-bold text-primary bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors border border-rose-200"
              >
                <RotateCcw className="w-3 h-3" />
                Reset Filter
              </button>
            )}
          </div>

          {/* List Kartu Lapak */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {filteredVendors.length === 0 ? (
              <div className="text-center py-12 text-text-muted text-xs">
                Tidak ada pedagang yang sesuai filter di area ini.
              </div>
            ) : (
              filteredVendors.map((vendor) => {
                const isSelected = selectedVendor?.id === vendor.id;
                return (
                  <div
                    key={vendor.id}
                    onClick={() => {
                      setSelectedVendor(vendor);
                      if (window.innerWidth < 768) setSidebarOpen(false);
                    }}
                    className={`p-3 rounded-xl border transition-all cursor-pointer flex gap-3 ${
                      isSelected
                        ? 'border-primary bg-surface-container-low shadow-soft'
                        : 'border-border-subtle bg-white hover:border-primary/40 hover:bg-surface-container-low'
                    }`}
                  >
                    <img
                      src={vendor.photoUrl}
                      alt={vendor.businessName}
                      className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
                      onError={(e: any) => {
                        e.target.src = 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold text-primary uppercase truncate">
                        {vendor.category}
                      </div>
                      <h4 className="text-xs font-bold text-text-primary truncate">
                        {vendor.businessName}
                      </h4>
                      <p className="text-[11px] text-text-muted truncate mt-0.5">
                        {vendor.district} &bull; {vendor.address}
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setModalVendor(vendor);
                        }}
                        className="text-[10px] font-bold text-primary hover:underline mt-1 block"
                      >
                        Detail Lengkap
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* AREA PETA LEAFLET */}
        <div className="flex-1 relative h-full">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="absolute top-4 left-4 z-[999] bg-white text-text-primary text-xs font-bold px-3 py-2 rounded-xl shadow-card border border-border-subtle flex items-center gap-2 hover:bg-surface-container-low"
            >
              <SlidersHorizontal className="w-4 h-4 text-primary" />
              <span>Daftar Lapak ({filteredVendors.length})</span>
            </button>
          )}

          <LeafletMap
            vendors={filteredVendors}
            selectedVendor={selectedVendor}
            onSelectVendor={(v) => {
              setSelectedVendor(v);
              setModalVendor(v);
            }}
            height="100%"
          />
        </div>
      </div>

      <VendorDetailModal
        vendor={modalVendor}
        onClose={() => setModalVendor(null)}
      />
    </div>
  );
};
