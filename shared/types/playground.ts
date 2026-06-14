/**
 * Playground Types
 *
 * @see docs/swagger.yml — PlaygroundRequest
 */

import { z } from 'zod'
import type { ChatSource } from './chat'

export interface PlaygroundHistoryItem {
  role: string
  content: string
}

export interface PlaygroundRequest {
  message: string
  history?: PlaygroundHistoryItem[]
}

export interface PlaygroundResponse {
  reply: string
  sources: ChatSource[]
  conversationId: string
}

// ── Zod Schema ───────────────────────────────────────────────

export const playgroundMessageSchema = z.object({
  message: z.string().min(1, 'Pesan tidak boleh kosong').max(5000, 'Maksimal 5000 karakter'),
})
