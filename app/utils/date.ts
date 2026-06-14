/**
 * Date Formatting Utilities
 *
 * Utility functions for date formatting and manipulation.
 * Auto-imported by Nuxt from the utils/ directory.
 *
 * @example
 *   const formatted = formatDate(new Date())
 *   const relative = formatRelativeTime(new Date())
 */

/**
 * Format a date to a localized string
 *
 * @param date - Date to format
 * @param locale - Locale string (default: 'id-ID')
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  locale: string = 'id-ID',
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * Format a date to a localized date-time string
 *
 * @param date - Date to format
 * @param locale - Locale string (default: 'id-ID')
 * @returns Formatted date-time string
 */
export function formatDateTime(
  date: Date | string,
  locale: string = 'id-ID',
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Format a date as relative time (e.g., "2 hours ago")
 *
 * @param date - Date to format
 * @param locale - Locale string (default: 'id-ID')
 * @returns Relative time string
 */
export function formatRelativeTime(
  date: Date | string,
  locale: string = 'id-ID',
): string {
  const d = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  if (diffDays > 0) return rtf.format(-diffDays, 'day')
  if (diffHours > 0) return rtf.format(-diffHours, 'hour')
  if (diffMinutes > 0) return rtf.format(-diffMinutes, 'minute')
  return rtf.format(-diffSeconds, 'second')
}
