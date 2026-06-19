import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, locale = 'ro-MD'): string {
  return new Intl.DateTimeFormat(locale, {
    day: '2-digit', month: '2-digit', year: 'numeric',
  }).format(new Date(date));
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + '...';
}

export function getStatusColor(status: string) {
  const map: Record<string, string> = {
    'in_vigoare': 'badge-success',
    'abrogat': 'badge-danger',
    'suspendat': 'badge-warning',
    'in_asteptare': 'badge-info',
    'incomplet': 'badge-muted',
    'sters': 'badge-danger',
  };
  return map[status] ?? 'badge-muted';
}
