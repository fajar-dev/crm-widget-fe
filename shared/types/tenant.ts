/**
 * Tenant Types
 *
 * TypeScript interfaces for tenant management endpoints.
 * @see docs/swagger.yml
 */

import { z } from 'zod'
import type { UserResponse, UserRole } from './auth'

export interface TenantResponse {
  id: string
  name: string
  company: string
  slug: string
  code: string
  createdAt: string
  updatedAt: string
}

export interface CreateTenantRequest {
  name: string
  company: string
  slug: string
}

export interface UpdateTenantRequest {
  name?: string
  company?: string
  slug?: string
}

export interface JoinTenantRequest {
  code: string
}

export interface AcceptInvitationRequest {
  token: string
}

export interface InviteMemberRequest {
  email: string
  role?: UserRole
}

export interface UpdateMemberRoleRequest {
  role: UserRole
}

export interface MemberResponse {
  id: string
  userId: string
  role: UserRole
  user: UserResponse
  createdAt: string
}

// ── Zod Schemas ──────────────────────────────────────────────

export const createTenantSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi').max(200),
  company: z.string().min(1, 'Perusahaan wajib diisi').max(200),
  slug: z.string().min(2, 'Slug minimal 2 karakter').max(100).regex(/^[a-z0-9-]+$/, 'Hanya huruf kecil, angka, dan dash'),
})

export const joinTenantSchema = z.object({
  code: z.string().min(1, 'Kode wajib diisi').max(20),
})

export const inviteMemberSchema = z.object({
  email: z.string().email('Email tidak valid'),
  role: z.enum(['super_admin', 'admin', 'manager', 'member']).default('member'),
})
