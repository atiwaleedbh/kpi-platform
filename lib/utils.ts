import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merges Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number with thousand separators
 */
export function formatNumber(value: number, decimals: number = 2): string {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(value);
}

/**
 * Format percentage
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${formatNumber(value, decimals)}%`;
}

/**
 * Format currency
 */
export function formatCurrency(value: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(value);
}

/**
 * Calculate KPI performance percentage
 */
export function calculatePerformance(
  actual: number,
  target: number,
  targetType: 'maximize' | 'minimize' | 'maintain' = 'maximize'
): number {
  if (target === 0) return 0;

  switch (targetType) {
    case 'maximize':
      return (actual / target) * 100;
    case 'minimize':
      return target === 0 ? 100 : (target / actual) * 100;
    case 'maintain':
      return 100 - Math.abs(((actual - target) / target) * 100);
    default:
      return 0;
  }
}

/**
 * Get KPI status color based on performance
 */
export function getKPIStatusColor(performance: number): {
  color: string;
  label: string;
  className: string;
} {
  if (performance >= 100) {
    return {
      color: '#10B981',
      label: 'Excellent',
      className: 'status-excellent',
    };
  } else if (performance >= 90) {
    return {
      color: '#84CC16',
      label: 'Good',
      className: 'status-good',
    };
  } else if (performance >= 75) {
    return {
      color: '#F59E0B',
      label: 'Warning',
      className: 'status-warning',
    };
  } else {
    return {
      color: '#EF4444',
      label: 'Critical',
      className: 'status-danger',
    };
  }
}

/**
 * Check if value is within target range
 */
export function isWithinTarget(
  value: number,
  target: number,
  targetMin?: number,
  targetMax?: number,
  targetType: 'maximize' | 'minimize' | 'maintain' | 'range' = 'maximize'
): boolean {
  if (targetType === 'range') {
    if (targetMin !== undefined && targetMax !== undefined) {
      return value >= targetMin && value <= targetMax;
    }
    // Fallback if range values not provided
    return true;
  }

  const performance = calculatePerformance(value, target, targetType);
  return performance >= 90; // 90% threshold for "within target"
}

/**
 * Generate unique ID
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Format time duration
 */
export function formatDuration(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)} min`;
  } else if (hours < 24) {
    return `${formatNumber(hours, 1)} hrs`;
  } else {
    return `${formatNumber(hours / 24, 1)} days`;
  }
}

/**
 * Calculate trend direction
 */
export function calculateTrend(
  current: number,
  previous: number
): 'up' | 'down' | 'stable' {
  const threshold = 0.01; // 1% threshold for stability
  const percentChange = Math.abs((current - previous) / previous);

  if (percentChange < threshold) return 'stable';
  return current > previous ? 'up' : 'down';
}

/**
 * Calculate percent change
 */
export function calculatePercentChange(
  current: number,
  previous: number
): number {
  if (previous === 0) return current === 0 ? 0 : 100;
  return ((current - previous) / previous) * 100;
}
