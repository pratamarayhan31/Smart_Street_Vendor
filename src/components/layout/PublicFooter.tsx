import React from 'react';
import { Link } from '@/lib/router';

export const PublicFooter: React.FC = () => {
  return (
    <footer className="bg-text-primary text-white border-t border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Kolom 1: Logo & Profil */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 bg-white p-2 rounded-lg shadow-soft">
                <img
                  src="/images/logo-pemkot-bandar-lampung.jpg"
                  alt="Pemerintah Kota Bandar Lampung"
                  className="h-10 w-auto object-contain"
                />
                <div className="h-6 w-[1px] bg-border-subtle" />
                <img
                  src="/images/logo-universitas-teknokrat-indonesia.png"
                  alt="Universitas Teknokrat Indonesia"
                  className="h-10 w-auto object-contain"
                />
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight text-white">Smart Street Vendor</h3>
                <p className="text-xs text-surface-container">Pemerintah Kota Bandar Lampung &amp; Universitas Teknokrat Indonesia</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed max-w-md">
              Sistem Informasi Pendataan, Verifikasi, dan Pemetaan Spasial Pedagang Kaki Lima (PKL) 
              berbasis web untuk mendukung ekosistem perkotaan yang tertib, modern, dan terhubung.
            </p>
          </div>

          {/* Kolom 2: Navigasi Cepat */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-surface-container mb-4">
              Layanan Sistem
            </h4>
            <ul className="space-y-2 text-sm text-slate-300">
              <li>
                <Link href="/" className="hover:text-white transition-colors">Beranda Publik</Link>
              </li>
              <li>
                <Link href="/katalog" className="hover:text-white transition-colors">Katalog Pedagang</Link>
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
            <h4 className="text-xs font-bold uppercase tracking-wider text-surface-container mb-4">
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

        <div className="pt-8 border-t border-slate-700/80 text-xs text-slate-400 flex flex-col md:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} Smart Street Vendor Kota Bandar Lampung. Kolaborasi Riset &amp; Pengabdian Masyarakat.</p>
          <div className="flex items-center gap-4">
            <Link href="/admin/dashboard" className="text-slate-300 hover:text-white font-medium">
              Portal Admin
            </Link>
            <span className="text-slate-600">&bull;</span>
            <Link href="/pedagang/dashboard" className="text-slate-300 hover:text-white font-medium">
              Portal Pedagang
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
