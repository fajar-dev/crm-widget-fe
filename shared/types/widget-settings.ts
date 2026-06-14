/**
 * Widget Settings Types
 *
 * @see docs/swagger.yml — WidgetSettingsResponse, UpdateWidgetSettingsRequest
 */

import { z } from 'zod'

export interface WidgetSettingsResponse {
  id: string
  welcomeMessage: string
  iconPath: string | null
  primaryColor: string
  fontFamily: string
  sessionTimeout: number
  isActive: boolean
}

export interface UpdateWidgetSettingsRequest {
  welcomeMessage?: string
  iconPath?: string | null
  primaryColor?: string
  fontFamily?: string
  sessionTimeout?: number
  isActive?: boolean
}

// ── Zod Schemas ──────────────────────────────────────────────

export const updateWidgetSettingsSchema = z.object({
  welcomeMessage: z.string().optional(),
  iconPath: z.string().nullable().optional(),
  primaryColor: z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Format warna tidak valid (#RRGGBB)').optional(),
  fontFamily: z.string().optional(),
  sessionTimeout: z.number().min(1, 'Minimal 1 menit').optional(),
  isActive: z.boolean().optional(),
})
