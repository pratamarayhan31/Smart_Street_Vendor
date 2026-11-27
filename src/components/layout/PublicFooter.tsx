import React from 'react';
import { Link } from '@/lib/router';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-primary text-white border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Kolom 1: Logo & Profil */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-sm">
                <img
                  src="/images/logo-pemkot-bandar-lampung.jpg"
                  alt="Pemerintah Kota Bandar Lampung"
                  className="h-10 w-auto object-contain"
                />
                <div className="h-6 w-[1px] bg-slate-300" />
                <img
                  src="/images/logo-universitas-teknokrat-indonesia.png"
                  alt="Universitas Teknokrat Indonesia"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight text-white">Smart Street Vendor</h3>
                <p className="text-xs text-slate-300">Pemerintah Kota Bandar Lampung &amp; Universitas Teknokrat Indonesia</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              Sistem Informasi Pendataan, Verifikasi, dan Pemetaan Spasial Pedagang Kaki Lima (PKL) 
              berbasis web untuk mendukung ekosistem perkotaan yang tertib, modern, dan terhubung.
            </p>
            <div className="text-xs text-amber-300 bg-amber-950/50 border border-amber-800/60 p-2.5 rounded-lg max-w-md">
              <strong>Catatan Penafian:</strong> Data titik lokasi dan pedagang dalam prototipe ini berstatus data simulasi untuk keperluan evaluasi sistem Smart City.
            </div>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Layanan Sistem
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Beranda Publik</Link>
              </li>
              <li>
                <Link href="/peta" className="hover:text-white transition-colors">Peta Digital PKL</Link>
              </li>
              <li>
                <Link href="/login" className="hover:text-white transition-colors">Masuk Akun</Link>
              </li>
              <li>
                <Link href="/register" className="hover:text-white transition-colors">Pendaftaran Pedagang</Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Wilayah Cakupan */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-200 mb-4">
              Wilayah Cakupan
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-300">
              <li>Tanjung Karang Pusat &amp; Enggal</li>
              <li>Kedaton &amp; Way Halim</li>
              <li>Rajabasa &amp; Sukarame</li>
              <li>Teluk Betung Selatan &amp; Utara</li>
              <li>Kemiling &amp; Sukabumi</li>
              <li>Serta seluruh kecamatan di Kota Bandar Lampung</li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 text-xs text-slate-400 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} Smart Street Vendor Kota Bandar Lampung. Kolaborasi Riset &amp; Pengabdian Masyarakat.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-slate-400 hover:text-slate-200">
              Portal Admin
            </Link>
            <span>&bull;</span>
            <Link href="/pedagang/dashboard" className="text-slate-400 hover:text-slate-200">
              Portal Pedagang
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
