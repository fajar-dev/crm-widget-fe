/**
 * Knowledge Base Types
 *
 * @see docs/swagger.yml — KnowledgeCategoryResponse, KnowledgeBaseResponse
 */

import { z } from 'zod'
import type { EntryType } from './enums'

export interface KnowledgeCategoryResponse {
  id: string
  name: string
  description: string | null
  sortOrder: number
  isActive: boolean
  knowledgeBaseCount: number
}

export interface CreateCategoryRequest {
  name: string
  description?: string
  sortOrder?: number
  isActive?: boolean
}

export interface UpdateCategoryRequest {
  name?: string
  description?: string
  sortOrder?: number
  isActive?: boolean
}

export interface KnowledgeBaseResponse {
  id: string
  categoryId: string
  title: string
  content: string
  entryType: EntryType
  metadata: Record<string, unknown> | null
  sortOrder: number
  isActive: boolean
}

export interface CreateKnowledgeBaseRequest {
  title: string
  content: string
  entryType?: EntryType
  metadata?: Record<string, unknown>
  sortOrder?: number
  isActive?: boolean
}

export interface UpdateKnowledgeBaseRequest {
  title?: string
  content?: string
  entryType?: EntryType
  metadata?: Record<string, unknown>
  sortOrder?: number
  isActive?: boolean
}

export interface BulkCreateKnowledgeBaseRequest {
  items: CreateKnowledgeBaseRequest[]
}

// ── Zod Schemas ──────────────────────────────────────────────

export const createCategorySchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi').max(200),
  description: z.string().optional().or(z.literal('')),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
})

export const updateCategorySchema = createCategorySchema.partial()

export const createKnowledgeBaseSchema = z.object({
  title: z.string().min(1, 'Title wajib diisi'),
  content: z.string().min(1, 'Content wajib diisi'),
  entryType: z.enum(['faq', 'document_chunk']).default('faq'),
  sortOrder: z.number().default(0),
  isActive: z.boolean().default(true),
})

export const updateKnowledgeBaseSchema = createKnowledgeBaseSchema.partial()
