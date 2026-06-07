import { format, parseISO, getMonth } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('zh-CN', {
    style: 'currency',
    currency: 'CNY',
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'yyyy-MM-dd', { locale: zhCN });
  } catch {
    return dateStr;
  }
}

export function formatMonth(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'yyyy年MM月', { locale: zhCN });
  } catch {
    return dateStr;
  }
}

export function isPeakSeason(dateStr: string): boolean {
  try {
    const month = getMonth(parseISO(dateStr)) + 1;
    return [1, 2, 7, 8].includes(month);
  } catch {
    return false;
  }
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export function getSeasonType(dateStr: string): '旺季' | '淡季' {
  return isPeakSeason(dateStr) ? '旺季' : '淡季';
}

export function getCourseTypeName(type: string): string {
  const names: Record<string, string> = {
    beginner: '启蒙班',
    intermediate: '进阶班',
    exam: '考级班',
  };
  return names[type] || type;
}

export function getStatusName(status: string): string {
  const names: Record<string, string> = {
    active: '在读',
    suspended: '停课',
    graduated: '结业',
    refunded: '已退费',
    pending: '待审批',
    approved: '已批准',
    rejected: '已拒绝',
  };
  return names[status] || status;
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    suspended: 'bg-yellow-100 text-yellow-800',
    graduated: 'bg-blue-100 text-blue-800',
    refunded: 'bg-red-100 text-red-800',
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100 * 100) / 100;
}

export function getChannelColor(name: string): string {
  const colors: Record<string, string> = {
    '地推': '#3b82f6',
    '短视频': '#ef4444',
    '老学员转介绍': '#10b981',
  };
  return colors[name] || '#64748b';
}
