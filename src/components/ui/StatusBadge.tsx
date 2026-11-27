import React from 'react';
import { VerificationStatus } from '@/types';

interface StatusBadgeProps {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const configMap: Record<
    VerificationStatus,
    { label: string; bg: string; text: string; border: string; dot: string }
  > = {
    terverifikasi: {
      label: 'Disetujui (Resmi)',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      dot: 'bg-[#16A34A]',
    },
    menunggu: {
      label: 'Menunggu Pemeriksaan',
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      dot: 'bg-[#EAB308]',
    },
    ditinjau: {
      label: 'Sedang Ditinjau',
      bg: 'bg-yellow-50',
      text: 'text-yellow-800',
      border: 'border-yellow-200',
      dot: 'bg-[#EAB308]',
    },
    revisi: {
      label: 'Perlu Perbaikan',
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      dot: 'bg-[#EAB308]',
    },
    ditolak: {
      label: 'Ditolak / Non-Zonasi',
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      dot: 'bg-[#DC2626]',
    },
  };

  const config = configMap[status] || configMap.menunggu;
  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs'
      : size === 'lg'
      ? 'px-3.5 py-1.5 text-sm font-semibold'
      : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};
