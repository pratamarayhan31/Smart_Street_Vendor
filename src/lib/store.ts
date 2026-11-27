'use client';

import { Vendor, Category, VerificationStatus, District, User } from '@/types';
import { INITIAL_VENDORS, CATEGORIES, DISTRICTS } from './data';

const VENDORS_STORAGE_KEY = 'ssv_vendors_data_v1';
const CATEGORIES_STORAGE_KEY = 'ssv_categories_data_v1';
const CURRENT_USER_KEY = 'ssv_current_user_v1';

export function getStoredVendors(): Vendor[] {
  if (typeof window === 'undefined') return INITIAL_VENDORS;
  const data = localStorage.getItem(VENDORS_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(VENDORS_STORAGE_KEY, JSON.stringify(INITIAL_VENDORS));
    return INITIAL_VENDORS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_VENDORS;
  }
}

export function saveVendors(vendors: Vendor[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(VENDORS_STORAGE_KEY, JSON.stringify(vendors));
}

export function getStoredCategories(): Category[] {
  if (typeof window === 'undefined') return CATEGORIES;
  const data = localStorage.getItem(CATEGORIES_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(CATEGORIES));
    return CATEGORIES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return CATEGORIES;
  }
}

export function saveCategories(categories: Category[]) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(CATEGORIES_STORAGE_KEY, JSON.stringify(categories));
}

export function getCurrentUser(): User | null {
  if (typeof window === 'undefined') {
    return {
      id: 'admin-1',
      name: 'Petugas Administrator Pemkot',
      email: 'admin@bandarlampungkota.go.id',
      role: 'admin',
    };
  }
  const data = localStorage.getItem(CURRENT_USER_KEY);
  if (!data) {
    // Default logged in user (can switch easily between admin and pedagang)
    const defaultUser: User = {
      id: 'admin-1',
      name: 'Petugas Administrator Pemkot',
      email: 'admin@bandarlampungkota.go.id',
      role: 'admin',
    };
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(defaultUser));
    return defaultUser;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return null;
  }
}

export function setCurrentUser(user: User | null) {
  if (typeof window === 'undefined') return;
  if (!user) {
    localStorage.removeItem(CURRENT_USER_KEY);
  } else {
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  }
}

export function updateVendorStatus(
  vendorId: string,
  newStatus: VerificationStatus,
  notes?: string,
  adminName: string = 'Admin Dinas Koperasi & UMKM'
): Vendor[] {
  const vendors = getStoredVendors();
  const updated = vendors.map((v) => {
    if (v.id === vendorId) {
      return {
        ...v,
        status: newStatus,
        notes: notes ?? v.notes,
        isPublic: newStatus === 'terverifikasi',
        verifiedAt: new Date().toISOString(),
        verifiedBy: adminName,
      };
    }
    return v;
  });
  saveVendors(updated);
  return updated;
}

export function toggleVendorPublication(vendorId: string): Vendor[] {
  const vendors = getStoredVendors();
  const updated = vendors.map((v) => {
    if (v.id === vendorId) {
      return {
        ...v,
        isPublic: !v.isPublic,
      };
    }
    return v;
  });
  saveVendors(updated);
  return updated;
}

export function addOrUpdateVendor(vendorData: Partial<Vendor> & { id?: string }): Vendor {
  const vendors = getStoredVendors();
  const now = new Date().toISOString();
  
  if (vendorData.id && vendors.some((v) => v.id === vendorData.id)) {
    // Update existing
    const updated = vendors.map((v) => {
      if (v.id === vendorData.id) {
        return {
          ...v,
          ...vendorData,
          status: 'menunggu' as VerificationStatus, // Reset status to review on edit
          submittedAt: now,
        } as Vendor;
      }
      return v;
    });
    saveVendors(updated);
    return updated.find((v) => v.id === vendorData.id)!;
  } else {
    // Create new
    const newId = `PKL-${String(vendors.length + 1).padStart(3, '0')}`;
    const newVendor: Vendor = {
      id: newId,
      userId: vendorData.userId || 'user-current',
      ownerName: vendorData.ownerName || 'Nama Pedagang',
      phone: vendorData.phone || '081234567890',
      businessName: vendorData.businessName || 'Usaha Kaki Lima Baru',
      category: vendorData.category || 'Kuliner & Makanan Berat',
      description: vendorData.description || 'Deskripsi lapak dagangan.',
      operatingHours: vendorData.operatingHours || '16:00 - 22:00 WIB',
      address: vendorData.address || 'Kota Bandar Lampung',
      district: vendorData.district || 'Tanjung Karang Pusat',
      subDistrict: vendorData.subDistrict || 'Palapa',
      latitude: vendorData.latitude || -5.4297,
      longitude: vendorData.longitude || 105.2625,
      photoUrl: vendorData.photoUrl || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80',
      status: 'menunggu',
      isPublic: false,
      submittedAt: now,
      ...vendorData,
    };
    const updated = [newVendor, ...vendors];
    saveVendors(updated);
    return newVendor;
  }
}

