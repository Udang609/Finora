import type { Category, TransactionType } from '../types';

/**
 * Format number to Indonesian Rupiah currency format (e.g. Rp5.000.000)
 */
export const formatIDR = (amount: number, withPrefix = true): string => {
  const formatted = new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));

  if (!withPrefix) return formatted;
  const prefix = amount < 0 ? '-Rp' : 'Rp';
  return `${prefix}${formatted}`;
};

/**
 * Format signed IDR currency (e.g. +Rp5.000.000 or -Rp25.000)
 */
export const formatSignedIDR = (amount: number, type: TransactionType): string => {
  const formatted = new Intl.NumberFormat('id-ID', {
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));

  return type === 'income' ? `+Rp${formatted}` : `-Rp${formatted}`;
};

/**
 * Parse currency string to raw number
 */
export const parseNumberInput = (value: string): number => {
  const clean = value.replace(/[^0-9]/g, '');
  return clean ? parseInt(clean, 10) : 0;
};

export const INDONESIAN_MONTHS = [
  'Januari',
  'Februari',
  'Maret',
  'April',
  'Mei',
  'Juni',
  'Juli',
  'Agustus',
  'September',
  'Oktober',
  'November',
  'Desember',
];

/**
 * Format YYYY-MM-DD to Indonesian format (e.g. 19 November 2026)
 */
export const formatDateID = (dateStr: string): string => {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  if (!year || !month || !day) return dateStr;
  return `${day} ${INDONESIAN_MONTHS[month - 1]} ${year}`;
};

/**
 * Format month number (1-12) to month name
 */
export const getMonthNameID = (monthNumber: number): string => {
  return INDONESIAN_MONTHS[monthNumber - 1] || '';
};

/**
 * Predefined category list divided by income and expense
 */
export const INCOME_CATEGORIES: Category[] = [
  'Gaji',
  'Investasi',
  'Bonus',
  'Bisnis',
  'Lain-lain',
];

export const EXPENSE_CATEGORIES: Category[] = [
  'Makanan & Minuman',
  'Transportasi',
  'Belanja',
  'Hiburan',
  'Tagihan & Utilitas',
  'Kesehatan',
  'Pendidikan',
  'Keluarga',
  'Lain-lain',
];

export const ALL_CATEGORIES: Category[] = [
  'Gaji',
  'Investasi',
  'Bonus',
  'Bisnis',
  'Makanan & Minuman',
  'Transportasi',
  'Belanja',
  'Hiburan',
  'Tagihan & Utilitas',
  'Kesehatan',
  'Pendidikan',
  'Keluarga',
  'Lain-lain',
];

/**
 * Category color badge mapping
 */
export const getCategoryColor = (category: Category): { bg: string; text: string; border: string } => {
  switch (category) {
    case 'Gaji':
      return { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200' };
    case 'Investasi':
    case 'Bisnis':
    case 'Bonus':
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' };
    case 'Makanan & Minuman':
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200' };
    case 'Transportasi':
      return { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200' };
    case 'Belanja':
      return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200' };
    case 'Hiburan':
      return { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' };
    case 'Tagihan & Utilitas':
      return { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
    case 'Kesehatan':
      return { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' };
    case 'Pendidikan':
      return { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200' };
    default:
      return { bg: 'bg-slate-100', text: 'text-slate-700', border: 'border-slate-200' };
  }
};
