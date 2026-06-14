/**
 * Chat Service (Public Widget)
 *
 * Handles public chat widget API calls. Unlike other services,
 * this uses session-based auth via X-Session-Token header
 * instead of JWT Bearer tokens.
 *
 * - Config, session start, and session validation are unauthenticated
 * - Conversation and message endpoints require X-Session-Token
 *
 * @see docs/swagger.yml — Public Chat endpoints
 */

import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import { BaseApiService } from './BaseApiService'
import { ApiError } from './ApiError'
import type { ApiResponse } from '~~/shared/types/api'
import type {
  PublicConfigResponse,
  StartSessionRequest,
  SendMessageRequest,
  ChatResponse,
} from '~~/shared/types/chat'
import type { SessionResponse } from '~~/shared/types/session'
import type { ConversationResponse } from '~~/shared/types/conversation'

/** Key used to store session token in localStorage */
const SESSION_TOKEN_KEY = 'crm_widget_session_token'

export class ChatService extends BaseApiService {
  /**
   * Retrieve session token from localStorage
   */
  protected override getAuthToken(): string | null {
    if (typeof window === 'undefined') return null

    try {
      return localStorage.getItem(SESSION_TOKEN_KEY)
    }
    catch {
      return null
    }
  }

  /**
   * Override interceptors to use X-Session-Token header
   * instead of Bearer Authorization
   */
  protected override setupInterceptors(): void {
    // Request interceptor — attach session token via X-Session-Token
    this.http.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const token = this.getAuthToken()
        if (token && config.headers) {
          config.headers['X-Session-Token'] = token
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

  // ── Unauthenticated Endpoints ────────────────────────────────

  /**
   * Get public widget configuration (no auth required)
   */
  async getConfig(tenantSlug: string): Promise<ApiResponse<PublicConfigResponse>> {
    return this.get<PublicConfigResponse>(`/chat/${tenantSlug}/config`)
  }

  /**
   * Start a new visitor session (no auth required)
   */
  async startSession(
    tenantSlug: string,
    payload: StartSessionRequest,
  ): Promise<ApiResponse<SessionResponse>> {
    return this.post<SessionResponse>(`/chat/${tenantSlug}/sessions`, payload)
  }

  /**
   * Validate an existing session token (no auth required)
   */
  async validateSession(
    tenantSlug: string,
    token: string,
  ): Promise<ApiResponse<SessionResponse>> {
    return this.get<SessionResponse>(`/chat/${tenantSlug}/sessions/${token}`)
  }

  // ── Session-Authenticated Endpoints ──────────────────────────

  /**
   * Start a new conversation within the current session
   */
  async startConversation(tenantSlug: string): Promise<ApiResponse<ConversationResponse>> {
    return this.post<ConversationResponse>(`/chat/${tenantSlug}/conversations`)
  }

  /**
   * Send a message in an active conversation
   */
  async sendMessage(
    tenantSlug: string,
    conversationId: string,
    payload: SendMessageRequest,
  ): Promise<ApiResponse<ChatResponse>> {
    return this.post<ChatResponse>(
      `/chat/${tenantSlug}/conversations/${conversationId}/messages`,
      payload,
    )
  }

  /**
   * End an active conversation
   */
  async endConversation(
    tenantSlug: string,
    conversationId: string,
  ): Promise<ApiResponse<ConversationResponse>> {
    return this.post<ConversationResponse>(
      `/chat/${tenantSlug}/conversations/${conversationId}/end`,
    )
  }
}

export const chatService = new ChatService()
