/**
 * Form Field Types
 *
 * @see docs/swagger.yml — FormFieldResponse, CreateFormFieldRequest
 */

import { z } from 'zod'
import type { FormFieldType } from './enums'

export interface FormFieldResponse {
  id: string
  fieldName: string
  label: string
  fieldType: FormFieldType
  placeholder: string | null
  options: Record<string, string> | null
  isRequired: boolean
  sortOrder: number
  isActive: boolean
}

export interface CreateFormFieldRequest {
  fieldName: string
  label: string
  fieldType: FormFieldType
  placeholder?: string
  options?: Record<string, string>
  isRequired?: boolean
  sortOrder?: number
}

export interface UpdateFormFieldRequest {
  fieldName?: string
  label?: string
  fieldType?: FormFieldType
  placeholder?: string
  options?: Record<string, string>
  isRequired?: boolean
  sortOrder?: number
  isActive?: boolean
}

export interface ReorderItem {
  id: string
  sortOrder: number
}

export interface ReorderFormFieldsRequest {
  items: ReorderItem[]
}

// ── Zod Schemas ──────────────────────────────────────────────

export const createFormFieldSchema = z.object({
  fieldName: z.string().min(1, 'Field name wajib diisi').max(100),
  label: z.string().min(1, 'Label wajib diisi').max(200),
  fieldType: z.enum(['text', 'email', 'phone', 'number', 'textarea', 'select']),
  placeholder: z.string().max(200).optional().or(z.literal('')),
  options: z.record(z.string()).optional(),
  isRequired: z.boolean().default(true),
  sortOrder: z.number().default(0),
})

export const updateFormFieldSchema = createFormFieldSchema.partial().extend({
  isActive: z.boolean().optional(),
})
