/**
 * Chatbot Settings Types
 *
 * @see docs/swagger.yml — ChatbotSettingsResponse, UpdateChatbotSettingsRequest
 */

import { z } from 'zod'

export interface ChatbotSettingsResponse {
  id: string
  systemInstruction: string
  modelName: string
  embeddingModel: string
  temperature: number
  maxTokens: number
  topP: number
  topK: number
}

export interface UpdateChatbotSettingsRequest {
  systemInstruction?: string
  modelName?: string
  embeddingModel?: string
  temperature?: number
  maxTokens?: number
  topP?: number
  topK?: number
}

// ── Zod Schemas ──────────────────────────────────────────────

export const updateChatbotSettingsSchema = z.object({
  systemInstruction: z.string().optional(),
  modelName: z.string().max(100).optional(),
  embeddingModel: z.string().max(100).optional(),
  temperature: z.number().min(0, 'Min 0').max(2, 'Max 2').optional(),
  maxTokens: z.number().min(1, 'Min 1').optional(),
  topP: z.number().min(0, 'Min 0').max(1, 'Max 1').optional(),
  topK: z.number().min(1, 'Min 1').optional(),
})
