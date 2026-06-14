/**
 * Playground Service
 *
 * Handles AI playground API calls for testing chatbot responses
 * without a live session.
 *
 * @see docs/swagger.yml — Playground endpoints
 */

import { DashboardApiService } from './DashboardApiService'
import type { ApiResponse } from '~~/shared/types/api'
import type { PlaygroundRequest, PlaygroundResponse } from '~~/shared/types/playground'

export class PlaygroundService extends DashboardApiService {
  /**
   * Send a message to the AI playground and receive a response
   */
  async sendMessage(payload: PlaygroundRequest): Promise<ApiResponse<PlaygroundResponse>> {
    return this.post<PlaygroundResponse>('/playground', payload)
  }
}

export const playgroundService = new PlaygroundService()
