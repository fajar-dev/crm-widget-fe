/**
 * Conversation Service
 *
 * Handles chatbot conversation API calls: paginated listing,
 * retrieval, deletion, and message history for conversations.
 *
 * @see docs/swagger.yml — Chatbot Conversation endpoints
 */

import { DashboardApiService } from './DashboardApiService'
import type { ApiResponse, PaginatedApiResponse, PaginationParams } from '~~/shared/types/api'
import type { ConversationResponse, MessageResponse } from '~~/shared/types/conversation'

export class ConversationService extends DashboardApiService {
  /**
   * List chatbot conversations with pagination and optional search/sort
   */
  async list(params?: PaginationParams): Promise<PaginatedApiResponse<ConversationResponse>> {
    return this.getPaginated<ConversationResponse>('/chatbot-conversations', { params })
  }

  /**
   * Get a single conversation by ID
   */
  async getById(id: string): Promise<ApiResponse<ConversationResponse>> {
    return this.get<ConversationResponse>(`/chatbot-conversations/${id}`)
  }

  /**
   * Delete a conversation by ID
   */
  async remove(id: string): Promise<ApiResponse<null>> {
    return this.delete<null>(`/chatbot-conversations/${id}`)
  }

  /**
   * Get messages for a specific conversation with pagination
   */
  async getMessages(
    conversationId: string,
    params?: PaginationParams,
  ): Promise<PaginatedApiResponse<MessageResponse>> {
    return this.getPaginated<MessageResponse>(
      `/chatbot-conversations/${conversationId}/messages`,
      { params },
    )
  }
}

export const conversationService = new ConversationService()
