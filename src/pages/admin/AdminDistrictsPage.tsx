import React, { useState } from 'react';
import { AdminSidebar } from '@/components/layout/AdminSidebar';
import { AdminHeader } from '@/components/layout/AdminHeader';
import { DISTRICTS } from '@/lib/data';
import { getStoredVendors } from '@/lib/store';
import { MapPin, Building, Users } from 'lucide-react';

export const AdminDistrictsPage: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [vendors] = useState(() => getStoredVendors());

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
          title="Master Referensi Wilayah Administratif" 
          onMenuToggle={() => setSidebarOpen(!sidebarOpen)} 
        />

        <main className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
          <div>
            <h2 className="text-xl font-bold text-text-primary flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              Kecamatan &amp; Kelurahan Kota Bandar Lampung
            </h2>
            <p className="text-xs text-text-muted">
              Data master wilayah administratif yang digunakan dalam formulir lokasi dan pemetaan sistem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {DISTRICTS.map((district) => {
              const vendorCount = vendors.filter(
                (v) => v.district.toLowerCase() === district.name.toLowerCase()
              ).length;

              return (
                <div
                  key={district.id}
                  className="bg-white p-5 rounded-2xl border border-border-subtle shadow-card space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-text-muted uppercase tracking-wider">
                      Kecamatan
                    </span>
                    <span className="text-xs font-semibold text-primary bg-surface-container px-2.5 py-0.5 rounded-full flex items-center gap-1 border border-border-subtle">
                      <Users className="w-3 h-3" />
                      <span>{vendorCount} PKL</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-text-primary">
                    {district.name}
                  </h3>

                  <div>
                    <span className="text-[11px] font-semibold text-text-muted block mb-1.5">
                      Kelurahan Cakupan ({district.subDistricts.length}):
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {district.subDistricts.map((sub) => (
                        <span
                          key={sub}
                          className="text-[11px] bg-surface-container-low border border-border-subtle text-text-primary px-2 py-0.5 rounded-md"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      </div>
    </div>
  );
};

