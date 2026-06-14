/**
 * Chatbot Settings Service
 *
 * Handles chatbot AI settings API calls: retrieval and update
 * of model configuration (temperature, max tokens, etc.).
 *
 * @see docs/swagger.yml — Chatbot Settings endpoints
 */

import { DashboardApiService } from './DashboardApiService'
import type { ApiResponse } from '~~/shared/types/api'
import type {
  ChatbotSettingsResponse,
  UpdateChatbotSettingsRequest,
} from '~~/shared/types/chatbot-settings'

export class ChatbotSettingsService extends DashboardApiService {
  /**
   * Get the current chatbot AI settings for the active tenant
   */
  async getSettings(): Promise<ApiResponse<ChatbotSettingsResponse>> {
    return this.get<ChatbotSettingsResponse>('/chatbot-settings')
  }

  /**
   * Update chatbot AI settings for the active tenant
   */
  async updateSettings(payload: UpdateChatbotSettingsRequest): Promise<ApiResponse<ChatbotSettingsResponse>> {
    return this.put<ChatbotSettingsResponse>('/chatbot-settings', payload)
  }
}

export const chatbotSettingsService = new ChatbotSettingsService()
