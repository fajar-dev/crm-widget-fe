/**
 * Public Chat Types (Widget)
 *
 * Types for the embeddable chat widget — session-based auth (NOT JWT).
 * @see docs/swagger.yml — Public Chat endpoints
 */

import { z } from 'zod'
import type { FormFieldResponse } from './form-field'
import type { WidgetSettingsResponse } from './widget-settings'

/** Public config response — returned by GET /api/chat/{slug}/config */
export interface PublicConfigResponse {
  tenant: {
    name: string
    logoPath: string | null
  }
  widget: WidgetSettingsResponse
  formFields: FormFieldResponse[]
}

/** Start session request — dynamic form values */
export type StartSessionRequest = Record<string, string>

/** Send message request */
export interface SendMessageRequest {
  message: string
}

/** Chat source reference */
export interface ChatSource {
  id: string
  title: string
  content: string
  distance: number
}

/** Chat response from bot */
export interface ChatResponse {
  reply: string
  sources: ChatSource[]
  conversationId: string
}

// ── Zod Schemas ──────────────────────────────────────────────

export const sendMessageSchema = z.object({
  message: z.string().min(1, 'Pesan tidak boleh kosong').max(5000, 'Maksimal 5000 karakter'),
})
