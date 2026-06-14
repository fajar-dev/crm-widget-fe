/**
 * Dashboard API Service
 *
 * Extends BaseApiService with JWT Bearer token authentication.
 * All dashboard services should extend this class instead of BaseApiService directly.
 *
 * @see docs/API_GUIDE.md — Dashboard auth pattern
 */

import { BaseApiService } from './BaseApiService'

const AUTH_STORAGE_KEY = 'crm_auth'

export abstract class DashboardApiService extends BaseApiService {
  /**
   * Get JWT access token from localStorage.
   * Used by request interceptor to set Authorization header.
   */
  protected getAuthToken(): string | null {
    try {
      if (typeof localStorage === 'undefined') return null
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      if (stored) {
        const data = JSON.parse(stored)
        return data?.accessToken ?? null
      }
    }
    catch {
      // Ignore parse errors
    }
    return null
  }
}
