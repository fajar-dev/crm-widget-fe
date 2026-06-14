/**
 * String Utilities
 *
 * Common string manipulation functions.
 * Auto-imported by Nuxt from the utils/ directory.
 */

/**
 * Truncate a string to a maximum length with ellipsis
 *
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @returns Truncated string
 */
export function truncate(text: string, maxLength: number = 100): string {
  if (text.length <= maxLength) return text
  return `${text.slice(0, maxLength)}...`
}

/**
 * Convert a string to title case
 *
 * @param text - Text to convert
 * @returns Title-cased string
 */
export function toTitleCase(text: string): string {
  return text
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

/**
 * Generate initials from a name (e.g., "John Doe" → "JD")
 *
 * @param name - Full name
 * @param maxChars - Maximum number of initials (default: 2)
 * @returns Initials string
 */
export function getInitials(name: string, maxChars: number = 2): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, maxChars)
    .map(word => word.charAt(0).toUpperCase())
    .join('')
}
