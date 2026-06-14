/**
 * Auth Types
 *
 * TypeScript interfaces for authentication endpoints.
 * Must match backend Swagger spec: docs/swagger.yml
 */

import { z } from 'zod'

/** User roles available in the system */
export type UserRole = 'super_admin' | 'admin' | 'manager' | 'member'

/** User response from API */
export interface UserResponse {
  id: string
  firstName: string
  lastName: string
  email: string
  role: UserRole
  isActive: boolean
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}

/** Auth tokens returned by login/refresh */
export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: string
}

/** Login request payload */
export interface LoginRequest {
  email: string
  password: string
}

/** Register request payload */
export interface RegisterRequest {
  firstName: string
  lastName: string
  email: string
  password: string
  role?: UserRole
}

/** Refresh token request payload */
export interface RefreshTokenRequest {
  refreshToken: string
}

// ── Zod Schemas ──────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
})

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name wajib diisi').max(100),
  lastName: z.string().min(1, 'Last name wajib diisi').max(100),
  email: z.string().email('Email tidak valid'),
  password: z.string().min(8, 'Minimal 8 karakter').max(128, 'Maksimal 128 karakter'),
  confirmPassword: z.string().min(8, 'Konfirmasi password wajib diisi'),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
})

export type LoginPayload = z.infer<typeof loginSchema>
export type RegisterPayload = z.infer<typeof registerSchema>
