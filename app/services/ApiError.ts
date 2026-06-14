/**
 * Custom API Error
 *
 * Structured error class for API call failures.
 * Provides typed access to error details from the backend response format.
 */
export class ApiError extends Error {
  public readonly statusCode: number
  public readonly errors: Record<string, string[]> | undefined

  constructor(
    message: string,
    statusCode: number,
    errors?: Record<string, string[]>,
  ) {
    super(message)
    this.name = 'ApiError'
    this.statusCode = statusCode
    this.errors = errors
  }

  /**
   * Get validation errors for a specific field
   */
  getFieldErrors(field: string): string[] {
    return this.errors?.[field] ?? []
  }

  /**
   * Check if error is a validation error (422)
   */
  get isValidationError(): boolean {
    return this.statusCode === 422
  }

  /**
   * Check if error is an authentication error (401)
   */
  get isAuthError(): boolean {
    return this.statusCode === 401
  }

  /**
   * Check if error is a forbidden error (403)
   */
  get isForbiddenError(): boolean {
    return this.statusCode === 403
  }

  /**
   * Check if error is a not found error (404)
   */
  get isNotFoundError(): boolean {
    return this.statusCode === 404
  }
}
