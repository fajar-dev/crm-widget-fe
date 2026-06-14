/**
 * Contact Types
 *
 * TypeScript interfaces for contact management endpoints.
 * @see docs/swagger.yml
 */

import { z } from 'zod'

export type ContactStatus = 'lead' | 'prospect' | 'customer' | 'inactive'
export type ContactSource = 'website' | 'referral' | 'social_media' | 'cold_call' | 'email' | 'other'

export interface ContactResponse {
  id: string
  firstName: string
  lastName: string
  fullName: string
  email?: string
  phone?: string
  company?: string
  jobTitle?: string
  status: ContactStatus
  source: ContactSource
  notes?: string
  address?: string
  createdAt: string
  updatedAt: string
}

export interface CreateContactRequest {
  firstName: string
  lastName: string
  email?: string
  phone?: string
  company?: string
  jobTitle?: string
  status?: ContactStatus
  source?: ContactSource
  notes?: string
  address?: string
}

export interface UpdateContactRequest {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  company?: string
  jobTitle?: string
  status?: ContactStatus
  source?: ContactSource
  notes?: string
  address?: string
}

// ── Zod Schemas ──────────────────────────────────────────────

export const createContactSchema = z.object({
  firstName: z.string().min(1, 'First name wajib diisi').max(100),
  lastName: z.string().min(1, 'Last name wajib diisi').max(100),
  email: z.string().email('Email tidak valid').optional().or(z.literal('')),
  phone: z.string().max(50).optional().or(z.literal('')),
  company: z.string().max(200).optional().or(z.literal('')),
  jobTitle: z.string().max(100).optional().or(z.literal('')),
  status: z.enum(['lead', 'prospect', 'customer', 'inactive']).default('lead'),
  source: z.enum(['website', 'referral', 'social_media', 'cold_call', 'email', 'other']).default('other'),
  notes: z.string().optional().or(z.literal('')),
  address: z.string().max(500).optional().or(z.literal('')),
})

export const updateContactSchema = createContactSchema.partial()
