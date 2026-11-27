import React, { useState } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { getStoredCategories, saveCategories, getStoredVendors } from '@/lib/store';
import { Category } from '@/types';
import { Tags, Plus, Trash2, Edit3, X, Check } from 'lucide-react';

export const AdminCategoriesPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>(() => getStoredCategories());
  const [vendors] = useState(() => getStoredVendors());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const newCat: Category = {
      id: `cat-${Date.now()}`,
      name: newName,
      description: newDesc || 'Kategori dagangan PKL Kota Bandar Lampung.',
    };

    const updated = [...categories, newCat];
    setCategories(updated);
    saveCategories(updated);
    setIsModalOpen(false);
    setNewName('');
    setNewDesc('');
  };

  const handleDeleteCategory = (id: string, name: string) => {
    const isUsed = vendors.some((v) => v.category === name);
    if (isUsed) {
      alert(`Kategori "${name}" sedang digunakan oleh pedagang terdaftar. Tidak dapat dihapus langsung.`);
      return;
    }
    if (confirm(`Yakin ingin menghapus kategori "${name}"?`)) {
      const updated = categories.filter((c) => c.id !== id);
      setCategories(updated);
      saveCategories(updated);
    }
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
          title="Manajemen Kategori Dagangan PKL" 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-bold text-primary flex items-center gap-2">
                <Tags className="w-5 h-5 text-secondary" />
                Daftar Klasifikasi Kategori Dagangan
              </h2>
              <p className="text-xs text-text-muted">
                Kategori digunakan oleh pedagang saat pendaftaran dan oleh masyarakat untuk memfilter pencarian lapak
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2.5 bg-primary hover:bg-primary-container text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kategori Baru</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map((category) => {
              const vendorCount = vendors.filter((v) => v.category === category.name).length;
              return (
                <div
                  key={category.id}
                  className="bg-white p-5 rounded-2xl border border-border-subtle shadow-xs hover:border-slate-300 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-secondary bg-sky-50 px-2.5 py-0.5 rounded-full">
                        {vendorCount} Lapak Terdaftar
                      </span>
                      <button
                        onClick={() => handleDeleteCategory(category.id, category.name)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded transition-colors"
                        title="Hapus Kategori"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <h3 className="font-bold text-base text-primary">
                      {category.name}
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed">
                      {category.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-primary">Tambah Kategori Dagangan</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddCategory} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Nama Kategori *</label>
                <input
                  type="text"
                  required
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full bg-slate-50 border border-border-subtle rounded-xl p-2.5 outline-none"
                  placeholder="Contoh: Tanaman Hias & Pupuk"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi &amp; Contoh Komoditas</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full bg-slate-50 border border-border-subtle rounded-xl p-2.5 outline-none"
                  placeholder="Tuliskan contoh barang dagangan dalam kategori ini..."
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-primary text-white font-semibold rounded-xl hover:bg-primary-container"
                >
                  Simpan Kategori
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

