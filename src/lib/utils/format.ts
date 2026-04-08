/**
 * Format a number as Nepali Rupees (NPR).
 */
export function formatNPR(amount: number): string {
  return new Intl.NumberFormat('en-NP', {
    style: 'currency',
    currency: 'NPR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format a Date into Nepal Standard Time (UTC+5:45).
 */
export function formatNepalTime(date: Date): string {
  return new Intl.DateTimeFormat('en-NP', {
    timeZone: 'Asia/Kathmandu',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}
