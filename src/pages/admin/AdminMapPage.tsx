import React, { useState, useMemo, useEffect } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { LeafletMap } from '@/components/map/LeafletMap';
import { VendorDetailModal } from '@/components/ui/VendorDetailModal';
import { getStoredVendors } from '@/lib/store';
import { fetchVendorsApi } from '@/lib/api';
import { DISTRICTS, CATEGORIES } from '@/lib/data';
import { Vendor } from '@/types';
import { Map, Search, Filter, RotateCcw } from 'lucide-react';

export const AdminMapPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>(() => getStoredVendors());

  useEffect(() => {
    fetchVendorsApi().then((data) => {
      if (data && data.length > 0) setVendors(data);
    }).catch(() => {});
  }, []);
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [filterDistrict, setFilterDistrict] = useState('Semua');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVendor, setModalVendor] = useState<Vendor | null>(null);

  const filteredVendors = useMemo(() => {
    return vendors.filter((v) => {
      const matchStatus = filterStatus === 'Semua' || v.status === filterStatus;
      const matchDistrict = filterDistrict === 'Semua' || v.district === filterDistrict;
      const matchSearch =
        searchQuery === '' ||
        v.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.address.toLowerCase().includes(searchQuery.toLowerCase());
      return matchStatus && matchDistrict && matchSearch;
    });
  }, [vendors, filterStatus, filterDistrict, searchQuery]);

  return (
    <div className="flex h-screen bg-background overflow-hidden font-sans">
      <div className="hidden md:flex flex-shrink-0">
        <AdminSidebar />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-slate-900/60" onClick={() => setSidebarOpen(false)} />
          <div className="relative z-10 w-64 h-full">
            <AdminSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <AdminHeader 
          title="Peta Spasial Pemantauan Lapak PKL" 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-4 max-w-7xl flex-1 flex flex-col">
          {/* Filter Bar */}
          <div className="bg-white p-3.5 rounded-2xl border border-border-subtle shadow-card flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative min-w-[200px]">
                <Search className="w-3.5 h-3.5 text-text-muted absolute left-2.5 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari lapak PKL..."
                  className="w-full text-xs bg-surface-container-low border border-border-subtle rounded-xl pl-8 pr-3 py-2 text-text-primary placeholder:text-text-muted/60 outline-none focus:bg-white focus:border-primary transition-all"
                />
              </div>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-surface-container-low border border-border-subtle rounded-xl px-3 py-2 text-text-primary outline-none focus:bg-white focus:border-primary transition-all"
              >
                <option value="Semua">Semua Status ({vendors.length})</option>
                <option value="terverifikasi">Terverifikasi</option>
                <option value="menunggu">Menunggu</option>
                <option value="revisi">Perlu Perbaikan</option>
                <option value="ditolak">Ditolak</option>
              </select>

              <select
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                className="bg-surface-container-low border border-border-subtle rounded-xl px-3 py-2 text-text-primary outline-none focus:bg-white focus:border-primary transition-all"
              >
                <option value="Semua">Semua Kecamatan</option>
                {DISTRICTS.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="text-text-muted font-semibold">
              Menampilkan <span className="text-primary font-bold">{filteredVendors.length}</span> titik lapak
            </div>
          </div>

          {/* Container Peta */}
          <div className="flex-1 min-h-[500px] rounded-2xl overflow-hidden shadow-card border border-border-subtle">
            <LeafletMap
              vendors={filteredVendors}
              onSelectVendor={(v) => setModalVendor(v)}
              height="100%"
            />
          </div>
        </main>
      </div>

      <VendorDetailModal
        vendor={modalVendor}
        onClose={() => setModalVendor(null)}
        isAdminView={true}
      />
    </div>
  );
};

