/**
 * Base API Service
 *
 * Abstract base class for all API service classes.
 * Provides a configured Axios instance with:
 * - Base URL from runtime config
 * - Request/response interceptors
 * - Standard error handling
 * - Auth token management
 *
 * Usage:
 *   class AuthService extends BaseApiService { ... }
 *
 * @see ARCHITECTURE.md for the service layer pattern
 */

import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios'
import type { ApiResponse, PaginatedApiResponse } from '~~/shared/types/api'
import { ApiError } from './ApiError'

export abstract class BaseApiService {
  protected readonly http: AxiosInstance

  constructor(baseURL?: string) {
    this.http = axios.create({
      baseURL: baseURL ?? this.getBaseUrl(),
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  /**
   * Get API base URL from runtime config.
   * Falls back to default if not in Nuxt context.
   */
  private getBaseUrl(): string {
    try {
      const config = useRuntimeConfig()
      return config.public.apiBaseUrl as string
    }
    catch {
      return 'http://localhost:3000/api'
    }
  }

  /**
   * Setup request and response interceptors.
   * Override in subclasses to add custom interceptors.
   */
  protected setupInterceptors(): void {
    // Request interceptor — attach auth token and tenant ID
    this.http.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getAuthToken()
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }

        // Attach tenant ID if available
        const tenantId = this.getTenantId()
        if (tenantId && config.headers) {
          config.headers['X-Tenant-ID'] = tenantId
        }

        return config
      },
      (error: unknown) => Promise.reject(error),
    )

    // Response interceptor — transform errors to ApiError
    this.http.interceptors.response.use(
      response => response,
      (error: unknown) => {
        if (axios.isAxiosError(error) && error.response) {
          const { data, status } = error.response
          const apiData = data as Record<string, unknown> | undefined

          throw new ApiError(
            (apiData?.message as string) ?? error.message,
            status,
            apiData?.errors as Record<string, string[]> | undefined,
          )
        }

        throw new ApiError(
          error instanceof Error ? error.message : 'An unexpected error occurred',
          500,
        )
      },
    )
  }

  /**
   * Get authentication token.
   * Override in subclasses for different auth strategies
   * (e.g., session token for widget, JWT for dashboard).
   */
  protected getAuthToken(): string | null {
    return null
  }

  /**
   * Get current tenant ID for X-Tenant-ID header.
   * Reads from localStorage. Override in subclasses if needed.
   */
  protected getTenantId(): string | null {
    try {
      if (typeof localStorage === 'undefined') return null
      const stored = localStorage.getItem('crm_current_tenant')
      if (stored) {
        const tenant = JSON.parse(stored)
        return tenant?.id ?? null
      }
    }
    catch {
      // Ignore parse errors
    }
    return null
  }

  /**
   * Perform a GET request and return typed response data
   */
  protected async get<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.http.get<ApiResponse<T>>(url, config)
    return response.data
  }

  /**
   * Perform a GET request for paginated data
   */
  protected async getPaginated<T>(url: string, config?: AxiosRequestConfig): Promise<PaginatedApiResponse<T>> {
    const response = await this.http.get<PaginatedApiResponse<T>>(url, config)
    return response.data
  }

  /**
   * Perform a POST request and return typed response data
   */
  protected async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.http.post<ApiResponse<T>>(url, data, config)
    return response.data
  }

  /**
   * Perform a PUT request and return typed response data
   */
  protected async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.http.put<ApiResponse<T>>(url, data, config)
    return response.data
  }

  /**
   * Perform a DELETE request and return typed response data
   */
  protected async delete<T>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.http.delete<ApiResponse<T>>(url, config)
    return response.data
  }
}
