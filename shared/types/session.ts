/**
 * Session Types
 *
 * @see docs/swagger.yml — SessionResponse
 */

export interface SessionResponse {
  id: string
  sessionToken: string
  ipAddress: string | null
  userAgent: string | null
  expiresAt: string
  lastActivityAt: string
  values: Record<string, string>
}
