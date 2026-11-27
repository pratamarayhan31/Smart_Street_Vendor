export type Role = 'admin' | 'pedagang' | 'masyarakat';

export type VerificationStatus = 
  | 'menunggu'      // Menunggu Verifikasi
  | 'ditinjau'      // Sedang Ditinjau
  | 'revisi'        // Perlu Perbaikan
  | 'terverifikasi' // Terverifikasi
  | 'ditolak';      // Ditolak

export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  count?: number;
}

export interface District {
  id: string;
  name: string;
  subDistricts: string[]; // Kelurahan
}

export interface Vendor {
  id: string;
  userId: string;
  nik?: string; // Disimpan internal, tidak dipublikasikan ke publik
  ownerName: string;
  phone: string; // Internal / hanya tampil jika disetujui
  businessName: string;
  category: string;
  description: string;
  operatingHours: string;
  address: string;
  district: string; // Kecamatan
  subDistrict: string; // Kelurahan
  latitude: number;
  longitude: number;
  photoUrl: string;
  status: VerificationStatus;
  isPublic: boolean;
  notes?: string; // Catatan perbaikan dari admin
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  vendorId?: string;
}

export interface VerificationLog {
  id: string;
  vendorId: string;
  status: VerificationStatus;
  adminName: string;
  notes: string;
  timestamp: string;
}

