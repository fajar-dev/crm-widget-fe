/**
 * Conversation & Message Types
 *
 * @see docs/swagger.yml — ConversationResponse, MessageResponse
 */

import type { ConversationStatus, MessageRole } from './enums'

export interface ConversationResponse {
  id: string
  sessionId: string
  status: ConversationStatus
  totalMessages: number
  promptTokens: number
  completionTokens: number
  totalTokens: number
  startedAt: string
  endedAt: string | null
}

export interface MessageResponse {
  id: string
  conversationId: string
  role: MessageRole
  content: string
  promptTokens: number
  completionTokens: number
  totalTokens: number
  latencyMs: number | null
  modelName: string | null
}
