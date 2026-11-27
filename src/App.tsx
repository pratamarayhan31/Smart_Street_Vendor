import React, { useEffect } from 'react';
import { useRouter } from '@/lib/router';
import { getCurrentUser } from '@/lib/store';
import { Role } from '@/types';
import { HomePage } from '@/pages/HomePage';
import { KatalogPage } from '@/pages/KatalogPage';
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

interface ProtectedRouteProps {
  requiredRole: Role;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole, children }) => {
  const { navigate } = useRouter();
  const user = getCurrentUser();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else if (user.role !== requiredRole) {
      navigate(user.role === 'admin' ? '/admin/dashboard' : '/pedagang/dashboard');
    }
  }, [user, requiredRole, navigate]);

  if (!user || user.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
};

export const App: React.FC = () => {
  const { path } = useRouter();

  // Route Dispatcher Publik
  if (path === '/' || path === '') {
    return <HomePage />;
  }

  if (path === '/katalog') {
    return <KatalogPage />;
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

  // Admin Routes (Wajib Login sebagai Admin)
  if (path === '/admin/dashboard' || path === '/admin') {
    return (
      <ProtectedRoute requiredRole="admin">
        <AdminDashboard />
      </ProtectedRoute>
    );
  }

  if (path === '/admin/verifikasi') {
    return (
      <ProtectedRoute requiredRole="admin">
        <AdminVerificationPage />
      </ProtectedRoute>
    );
  }

  if (path === '/admin/pedagang') {
    return (
      <ProtectedRoute requiredRole="admin">
        <AdminVendorsPage />
      </ProtectedRoute>
    );
  }

  if (path === '/admin/kategori') {
    return (
      <ProtectedRoute requiredRole="admin">
        <AdminCategoriesPage />
      </ProtectedRoute>
    );
  }

  if (path === '/admin/wilayah') {
    return (
      <ProtectedRoute requiredRole="admin">
        <AdminDistrictsPage />
      </ProtectedRoute>
    );
  }

  if (path === '/admin/peta') {
    return (
      <ProtectedRoute requiredRole="admin">
        <AdminMapPage />
      </ProtectedRoute>
    );
  }

  if (path === '/admin/laporan') {
    return (
      <ProtectedRoute requiredRole="admin">
        <AdminReportPage />
      </ProtectedRoute>
    );
  }

  // Pedagang Routes (Wajib Login sebagai Pedagang)
  if (path === '/pedagang/dashboard' || path === '/pedagang') {
    return (
      <ProtectedRoute requiredRole="pedagang">
        <PedagangDashboard />
      </ProtectedRoute>
    );
  }

  if (path === '/pedagang/profil') {
    return (
      <ProtectedRoute requiredRole="pedagang">
        <PedagangProfilePage />
      </ProtectedRoute>
    );
  }

  if (path === '/pedagang/lokasi') {
    return (
      <ProtectedRoute requiredRole="pedagang">
        <PedagangLocationPage />
      </ProtectedRoute>
    );
  }

  if (path === '/pedagang/status') {
    return (
      <ProtectedRoute requiredRole="pedagang">
        <PedagangStatusPage />
      </ProtectedRoute>
    );
  }

  // Fallback default
  return <HomePage />;
};

export default App;
