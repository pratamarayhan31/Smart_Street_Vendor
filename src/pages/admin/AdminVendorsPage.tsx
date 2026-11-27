import React, { useState, useEffect } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { VendorDetailModal } from '@/components/ui/VendorDetailModal';
import { getStoredVendors, toggleVendorPublication, addOrUpdateVendor } from '@/lib/store';
import { fetchVendorsApi, toggleVendorPublicApi, createVendorAdminApi } from '@/lib/api';
import { DISTRICTS, CATEGORIES } from '@/lib/data';
import { Vendor } from '@/types';
import { 
  Users, 
  Search, 
  Filter, 
  Eye, 
  Globe, 
  Plus, 
  Check, 
  X,
  MapPin,
  RotateCcw
} from 'lucide-react';

export const AdminVendorsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>(() => getStoredVendors());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDistrict, setFilterDistrict] = useState('Semua');
  const [filterStatus, setFilterStatus] = useState('Semua');
  const [modalVendor, setModalVendor] = useState<Vendor | null>(null);

  useEffect(() => {
    fetchVendorsApi().then((data) => {
      if (data && data.length > 0) setVendors(data);
    }).catch(() => {});
  }, []);

  // Modal Tambah Pedagang
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newOwner, setNewOwner] = useState('');
  const [newBusiness, setNewBusiness] = useState('');
  const [newCategory, setNewCategory] = useState(CATEGORIES[0].name);
  const [newDistrict, setNewDistrict] = useState(DISTRICTS[0].name);
  const [newPhone, setNewPhone] = useState('');
  const [newAddress, setNewAddress] = useState('');

  const filteredVendors = vendors.filter((v) => {
    const matchSearch =
      searchQuery === '' ||
      v.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchDistrict =
      filterDistrict === 'Semua' || v.district === filterDistrict;

    const matchStatus =
      filterStatus === 'Semua' || v.status === filterStatus;

    return matchSearch && matchDistrict && matchStatus;
  });

  const handleTogglePublic = async (id: string) => {
    const updated = toggleVendorPublication(id);
    setVendors(updated);
    try {
      await toggleVendorPublicApi(id);
    } catch (e) {
      // Local fallback active
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ownerName: newOwner,
      businessName: newBusiness,
      category: newCategory,
      district: newDistrict,
      phone: newPhone,
      address: newAddress || `Jl. Utama ${newDistrict}`,
      subDistrict: DISTRICTS.find((d) => d.name === newDistrict)?.subDistricts[0] || 'Pusat',
    };

    try {
      const created = await createVendorAdminApi(payload);
      setVendors((prev) => [created, ...prev]);
    } catch (err) {
      addOrUpdateVendor({
        ...payload,
        status: 'terverifikasi',
        isPublic: true,
      });
      setVendors(getStoredVendors());
    }

    setIsAddModalOpen(false);
    setNewOwner('');
    setNewBusiness('');
    setNewPhone('');
    setNewAddress('');
  };

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
          title="Master Data Pedagang Kaki Lima" 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
          {/* Header Aksi */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Data Pedagang Kaki Lima Kota Bandar Lampung
              </h2>
              <p className="text-xs text-text-muted">
                Total {filteredVendors.length} pedagang terdata dalam basis data
              </p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2.5 bg-primary hover:bg-primary-hover text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Data Pedagang</span>
            </button>
          </div>

          {/* Bar Filter & Pencarian */}
          <div className="bg-white p-4 rounded-2xl border border-border-subtle shadow-card space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="relative">
                <Search className="w-4 h-4 text-text-muted absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari pedagang, nama usaha, ID..."
                  className="w-full text-xs bg-surface-container-low border border-border-subtle rounded-xl pl-9 pr-3 py-2 text-text-primary placeholder:text-text-muted/60 outline-none focus:bg-white focus:border-primary transition-all"
                />
              </div>

              <select
                value={filterDistrict}
                onChange={(e) => setFilterDistrict(e.target.value)}
                className="text-xs bg-surface-container-low border border-border-subtle rounded-xl px-3 py-2 text-text-primary outline-none focus:bg-white focus:border-primary transition-all"
              >
                <option value="Semua">Semua Kecamatan</option>
                {DISTRICTS.map((d) => (
                  <option key={d.id} value={d.name}>{d.name}</option>
                ))}
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="text-xs bg-surface-container-low border border-border-subtle rounded-xl px-3 py-2 text-text-primary outline-none focus:bg-white focus:border-primary transition-all"
              >
                <option value="Semua">Semua Status</option>
                <option value="terverifikasi">Terverifikasi</option>
                <option value="menunggu">Menunggu</option>
                <option value="revisi">Perlu Perbaikan</option>
                <option value="ditolak">Ditolak</option>
              </select>
            </div>
          </div>

          {/* Tabel Data Pedagang */}
          <div className="bg-white rounded-2xl border border-border-subtle shadow-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead className="bg-surface-container-low text-text-muted border-b border-border-subtle">
                  <tr>
                    <th className="py-3 px-4 font-semibold">ID / Usaha</th>
                    <th className="py-3 px-4 font-semibold">Pemilik &amp; Kontak</th>
                    <th className="py-3 px-4 font-semibold">Kategori</th>
                    <th className="py-3 px-4 font-semibold">Wilayah</th>
                    <th className="py-3 px-4 font-semibold">Status Data</th>
                    <th className="py-3 px-4 font-semibold text-center">Publikasi Peta</th>
                    <th className="py-3 px-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-subtle/60">
                  {filteredVendors.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-text-muted">
                        Tidak ada data pedagang yang cocok dengan filter.
                      </td>
                    </tr>
                  ) : (
                    filteredVendors.map((vendor) => (
                      <tr key={vendor.id} className="hover:bg-surface-container-low/60 transition-colors">
                        <td className="py-3 px-4">
                          <div className="font-bold text-text-primary">{vendor.businessName}</div>
                          <span className="text-[10px] text-text-muted font-mono">{vendor.id}</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-semibold text-text-primary">{vendor.ownerName}</div>
                          <div className="text-[11px] text-text-muted">{vendor.phone}</div>
                        </td>
                        <td className="py-3 px-4 text-text-muted">{vendor.category}</td>
                        <td className="py-3 px-4">
                          <div className="text-text-primary font-medium">{vendor.district}</div>
                          <div className="text-[11px] text-text-muted truncate max-w-[150px]">{vendor.address}</div>
                        </td>
                        <td className="py-3 px-4">
                          <StatusBadge status={vendor.status} size="sm" />
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button
                            onClick={() => handleTogglePublic(vendor.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-colors cursor-pointer ${
                              vendor.isPublic
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                                : 'bg-surface-container-low text-text-muted hover:bg-surface-container border border-border-subtle'
                            }`}
                            title="Klik untuk mengubah izin publikasi di peta umum"
                          >
                            {vendor.isPublic ? 'Tampil' : 'Sembunyi'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => setModalVendor(vendor)}
                            className="p-1.5 text-primary hover:text-primary-hover hover:bg-surface-container-low rounded-lg transition-colors inline-flex items-center gap-1 font-semibold cursor-pointer"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Detail</span>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* Modal Tambah Pedagang */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-card max-w-lg w-full p-6 border border-border-subtle space-y-4">
            <div className="flex items-center justify-between border-b border-border-subtle pb-3">
              <h3 className="text-base font-bold text-text-primary">Tambah Data Pedagang Baru</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-text-muted hover:text-text-primary cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-text-primary mb-1">Nama Pemilik *</label>
                <input
                  type="text"
                  required
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-xl p-2.5 text-text-primary outline-none focus:bg-white focus:border-primary transition-all"
                  placeholder="Nama lengkap pedagang"
                />
              </div>

              <div>
                <label className="block font-semibold text-text-primary mb-1">Nama Usaha / Lapak *</label>
                <input
                  type="text"
                  required
                  value={newBusiness}
                  onChange={(e) => setNewBusiness(e.target.value)}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-xl p-2.5 text-text-primary outline-none focus:bg-white focus:border-primary transition-all"
                  placeholder="Contoh: Nasi Uduk Pasir Gintung"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-text-primary mb-1">Kategori *</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-surface-container-low border border-border-subtle rounded-xl p-2.5 text-text-primary outline-none focus:bg-white focus:border-primary transition-all"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-text-primary mb-1">Kecamatan *</label>
                  <select
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="w-full bg-surface-container-low border border-border-subtle rounded-xl p-2.5 text-text-primary outline-none focus:bg-white focus:border-primary transition-all"
                  >
                    {DISTRICTS.map((d) => (
                      <option key={d.id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-text-primary mb-1">Nomor WhatsApp / HP *</label>
                <input
                  type="tel"
                  required
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-xl p-2.5 text-text-primary outline-none focus:bg-white focus:border-primary transition-all"
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              <div>
                <label className="block font-semibold text-text-primary mb-1">Alamat Singkat</label>
                <input
                  type="text"
                  value={newAddress}
                  onChange={(e) => setNewAddress(e.target.value)}
                  className="w-full bg-surface-container-low border border-border-subtle rounded-xl p-2.5 text-text-primary outline-none focus:bg-white focus:border-primary transition-all"
                  placeholder="Jl. Raden Intan No. 20"
                />
              </div>

              <div className="pt-3 border-t border-border-subtle flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-border-subtle text-text-muted font-semibold rounded-xl hover:bg-surface-container-low cursor-pointer transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white font-semibold rounded-xl hover:bg-primary-hover shadow-xs cursor-pointer transition-colors"
                >
                  Simpan Pedagang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Detail */}
      <VendorDetailModal
        vendor={modalVendor}
        onClose={() => setModalVendor(null)}
        isAdminView={true}
      />
    </div>
  );
};

