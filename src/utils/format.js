export function formatCurrency(value) {
  if (value === null || value === undefined) return 'N/A'
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(value)
}

export function formatPercent(value) {
  if (value === null || value === undefined) return 'N/A'
  return `${value}%`
}

export function formatValue(value, suffix = '') {
  if (value === null || value === undefined || value === '') return 'N/A'
  return `${value}${suffix}`
}
