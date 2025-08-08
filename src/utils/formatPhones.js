/**
 * Normalize phone numbers into "+<country> <local>" format.
 * Handles multiple numbers separated by common delimiters.
 * @param {string|number|null|undefined} value
 * @returns {string}
 */
export const formatPhones = (value) => {
  if (value === undefined || value === null) return ''
  return String(value)
    .split(/[\\/;,]+/)
    .map((num) => num.trim())
    .filter(Boolean)
    .map((num) => {
      const digits = num.replace(/\D/g, '')
      if (!digits) return ''
      const country = digits.length > 10 ? digits.slice(0, digits.length - 10) : '1'
      const local = digits.slice(-10)
      return `+${country} ${local}`
    })
    .filter(Boolean)
    .join(', ')
}
