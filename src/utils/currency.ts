/**
 * Converts an amount in paise to an Indian Rupee (INR) formatted string
 * with Indian number system grouping (e.g. ₹1,24,500).
 */
export function formatINR(paise: number, showDecimals: boolean = false): string {
  const rupees = paise / 100;
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: showDecimals ? 2 : 0,
    minimumFractionDigits: showDecimals ? 2 : 0,
  }).format(rupees);
}

/**
 * Formats a raw number using Indian digit grouping (e.g. 1,24,500).
 */
export function formatIndianNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}
