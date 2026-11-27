import React from 'react';
import { useRouter } from '@/lib/router';
import { HomePage } from '@/pages/HomePage';
import { PublicMapPage } from '@/pages/PublicMapPage';
import { LoginPage } from '@/pages/LoginPage';
import { RegisterPage } from '@/pages/RegisterPage';

// Admin Pages
import { AdminDashboard } from '@/pages/admin/AdminDashboard';
import { AdminVerificationPage } from '@/pages/admin/AdminVerificationPage';
import { AdminVendorsPage } from '@/pages/admin/AdminVendorsPage';
import { AdminCategoriesPage } from '@/pages/admin/AdminCategoriesPage';
import { AdminDistrictsPage } from '@/pages/admin/AdminDistrictsPage';
import { AdminMapPage } from '@/pages/admin/AdminMapPage';
import { AdminReportPage } from '@/pages/admin/AdminReportPage';

// Pedagang Pages
import { PedagangDashboard } from '@/pages/pedagang/PedagangDashboard';
import { PedagangProfilePage } from '@/pages/pedagang/PedagangProfilePage';
import { PedagangLocationPage } from '@/pages/pedagang/PedagangLocationPage';
import { PedagangStatusPage } from '@/pages/pedagang/PedagangStatusPage';

export const App: React.FC = () => {
  const { path } = useRouter();

  // Route Dispatcher
  if (path === '/' || path === '') {
    return <HomePage />;
  }

  if (path === '/peta') {
    return <PublicMapPage />;
  }

  if (path === '/login') {
    return <LoginPage />;
  }

  if (path === '/register') {
    return <RegisterPage />;
  }

  // Admin Routes
  if (path === '/admin/dashboard' || path === '/admin') {
    return <AdminDashboard />;
  }

  if (path === '/admin/verifikasi') {
    return <AdminVerificationPage />;
  }

  if (path === '/admin/pedagang') {
    return <AdminVendorsPage />;
  }

  if (path === '/admin/kategori') {
    return <AdminCategoriesPage />;
  }

  if (path === '/admin/wilayah') {
    return <AdminDistrictsPage />;
  }

  if (path === '/admin/peta') {
    return <AdminMapPage />;
  }

  if (path === '/admin/laporan') {
    return <AdminReportPage />;
  }

  // Pedagang Routes
  if (path === '/pedagang/dashboard' || path === '/pedagang') {
    return <PedagangDashboard />;
  }

  if (path === '/pedagang/profil') {
    return <PedagangProfilePage />;
  }

  if (path === '/pedagang/lokasi') {
    return <PedagangLocationPage />;
  }

  if (path === '/pedagang/status') {
    return <PedagangStatusPage />;
  }

  // Fallback default
  return <HomePage />;
};

export default App;

