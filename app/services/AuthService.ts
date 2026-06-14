/**
 * Auth Service
 *
 * Handles authentication API calls: login, register, token refresh,
 * logout, and current user retrieval.
 *
 * @see docs/swagger.yml — Auth endpoints
 */

import { DashboardApiService } from './DashboardApiService'
import type { ApiResponse } from '~~/shared/types/api'
import type {
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  RefreshTokenRequest,
  UserResponse,
} from '~~/shared/types/auth'

export class AuthService extends DashboardApiService {
  /**
   * Authenticate user with email and password
   */
  async login(payload: LoginRequest): Promise<ApiResponse<AuthTokens>> {
    return this.post<AuthTokens>('/auth/login', payload)
  }

  /**
   * Register a new user account
   */
  async register(payload: RegisterRequest): Promise<ApiResponse<UserResponse>> {
    return this.post<UserResponse>('/auth/register', payload)
  }

  /**
   * Refresh access token using a valid refresh token
   */
  async refresh(payload: RefreshTokenRequest): Promise<ApiResponse<AuthTokens>> {
    return this.post<AuthTokens>('/auth/refresh', payload)
  }

  /**
   * Invalidate the current refresh token
   */
  async logout(refreshToken: string): Promise<ApiResponse<null>> {
    return this.post<null>('/auth/logout', { refreshToken })
  }

  /**
   * Get the currently authenticated user's profile
   */
  async getMe(): Promise<ApiResponse<UserResponse>> {
    return this.get<UserResponse>('/auth/me')
  }
}

export const authService = new AuthService()
