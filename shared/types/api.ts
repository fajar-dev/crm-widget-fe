/**
 * API Response Types
 *
 * Standard response format from the CRM Widget backend API.
 * All API responses follow this structure.
 *
 * @see docs/swagger.yml for complete API specification
 */

import { z } from 'zod'

/**
 * Pagination metadata returned with paginated responses
 */
export interface PaginationMeta {
  total: number
  perPage: number
  currentPage: number
  lastPage: number
  from: number
  to: number
}

/**
 * Standard API success response
 */
export interface ApiResponse<T> {
  success: true
  statusCode: number
  message: string
  data: T
}

/**
 * Paginated API success response
 */
export interface PaginatedApiResponse<T> {
  success: true
  statusCode: number
  message: string
  data: T[]
  meta: PaginationMeta
}

/**
 * API error response
 */
export interface ApiErrorResponse {
  success: false
  statusCode: number
  message: string
  data: null
  errors?: Record<string, string[]>
}

/**
 * Union type for all possible API responses
 */
export type ApiResult<T> = ApiResponse<T> | ApiErrorResponse

/**
 * Pagination query parameters
 */
export interface PaginationParams {
  page?: number
  perPage?: number
  sortBy?: string
  sortOrder?: 'ASC' | 'DESC'
  search?: string
}

/**
 * Zod schema for pagination metadata validation
 */
export const paginationMetaSchema = z.object({
  total: z.number(),
  perPage: z.number(),
  currentPage: z.number(),
  lastPage: z.number(),
  from: z.number(),
  to: z.number(),
})

/**
 * Zod schema for API error response validation
 */
export const apiErrorResponseSchema = z.object({
  success: z.literal(false),
  statusCode: z.number(),
  message: z.string(),
  data: z.null(),
  errors: z.record(z.array(z.string())).optional(),
})
