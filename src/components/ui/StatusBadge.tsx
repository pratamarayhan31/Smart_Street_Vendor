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
      bg: 'bg-amber-50',
      text: 'text-amber-800',
      border: 'border-amber-200',
      dot: 'bg-amber-500',
    },
    ditinjau: {
      label: 'Sedang Ditinjau',
      bg: 'bg-surface-container',
      text: 'text-text-primary',
      border: 'border-border-subtle',
      dot: 'bg-primary',
    },
    revisi: {
      label: 'Perlu Perbaikan',
      bg: 'bg-orange-50',
      text: 'text-orange-800',
      border: 'border-orange-200',
      dot: 'bg-orange-500',
    },
    terverifikasi: {
      label: 'Terverifikasi',
      bg: 'bg-emerald-50',
      text: 'text-emerald-800',
      border: 'border-emerald-200',
      dot: 'bg-emerald-500',
    },
    ditolak: {
      label: 'Ditolak',
      bg: 'bg-rose-50',
      text: 'text-primary',
      border: 'border-rose-200',
      dot: 'bg-primary',
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
