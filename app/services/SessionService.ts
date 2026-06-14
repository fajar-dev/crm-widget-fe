/**
 * Session Service
 *
 * Handles chatbot session API calls: paginated listing,
 * retrieval, and deletion of visitor sessions.
 *
 * @see docs/swagger.yml — Chatbot Session endpoints
 */

import { DashboardApiService } from './DashboardApiService'
import type { ApiResponse, PaginatedApiResponse, PaginationParams } from '~~/shared/types/api'
import type { SessionResponse } from '~~/shared/types/session'

export class SessionService extends DashboardApiService {
  /**
   * List chatbot sessions with pagination and optional search/sort
   */
  async list(params?: PaginationParams): Promise<PaginatedApiResponse<SessionResponse>> {
    return this.getPaginated<SessionResponse>('/chatbot-sessions', { params })
  }

  /**
   * Get a single chatbot session by ID
   */
  async getById(id: string): Promise<ApiResponse<SessionResponse>> {
    return this.get<SessionResponse>(`/chatbot-sessions/${id}`)
  }

  /**
   * Delete a chatbot session by ID
   */
  async remove(id: string): Promise<ApiResponse<null>> {
    return this.delete<null>(`/chatbot-sessions/${id}`)
  }
}

export const sessionService = new SessionService()
