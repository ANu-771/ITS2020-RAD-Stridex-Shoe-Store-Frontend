/**
 * STRIDEX Sri Lankan Rupee (LKR) Currency Utilities
 * Formats monetary amounts strictly in Sri Lankan Rupees (e.g. "Rs. 12,500.00").
 * USD ($) or non-LKR currencies must never be used.
 */

export const formatLKR = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Rs. 0.00';
  }

  const formatted = new Intl.NumberFormat('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

  return `Rs. ${formatted}`;
};

export const parseLKR = (input: string | number): number => {
  if (typeof input === 'number') return input;
  const cleaned = input.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

export const calculateDiscountPercentage = (basePrice: number, discountPrice: number): number => {
  if (!basePrice || !discountPrice || discountPrice >= basePrice) return 0;
  return Math.round(((basePrice - discountPrice) / basePrice) * 100);
};
