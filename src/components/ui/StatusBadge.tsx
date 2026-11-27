'use client';

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
    menunggu: {
      label: 'Menunggu Verifikasi',
      bg: 'bg-warning-surface',
      text: 'text-amber-800',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
    },
    ditinjau: {
      label: 'Sedang Ditinjau',
      bg: 'bg-surface-container-low',
      text: 'text-secondary',
      border: 'border-blue-200',
      dot: 'bg-secondary',
    },
    revisi: {
      label: 'Perlu Perbaikan',
      bg: 'bg-amber-50',
      text: 'text-amber-700',
      border: 'border-amber-300',
      dot: 'bg-amber-600',
    },
    terverifikasi: {
      label: 'Terverifikasi',
      bg: 'bg-success-surface',
      text: 'text-emerald-700',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
    },
    ditolak: {
      label: 'Ditolak',
      bg: 'bg-danger-surface',
      text: 'text-rose-700',
      border: 'border-rose-200',
      dot: 'bg-rose-500',
    },
  };

  const config = configMap[status] || configMap.menunggu;
  const sizeClasses =
    size === 'sm'
      ? 'px-2 py-0.5 text-xs'
      : size === 'lg'
      ? 'px-3.5 py-1.5 text-sm font-semibold'
      : 'px-2.5 py-1 text-xs font-medium';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${config.text} ${config.border} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
};

