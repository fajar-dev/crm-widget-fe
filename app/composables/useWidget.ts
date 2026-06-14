/**
 * useWidget Composable
 *
 * State machine composable for the embeddable chat widget.
 * Manages the full widget lifecycle: config loading, pre-chat form,
 * session creation, messaging, and conversation end/restart.
 *
 * Uses localStorage for session persistence across page reloads.
 * Implements a 1-second debounce between messages to prevent spam.
 *
 * @param tenantSlug - The tenant's unique slug identifier
 * @see ~/services/ChatService for API methods
 * @see ~~/shared/types/chat for type definitions
 */

import { chatService } from '~/services/ChatService'
import { ApiError } from '~/services/ApiError'
import type { PublicConfigResponse, ChatSource } from '~~/shared/types/chat'

/** Possible states for the widget state machine */
export type WidgetState =
  | 'CLOSED'
  | 'LOADING_CONFIG'
  | 'SHOW_FORM'
  | 'CREATING_SESSION'
  | 'CHAT_ACTIVE'
  | 'CHAT_ENDED'
  | 'SESSION_EXPIRED'
  | 'SHOW_DISABLED'

/** A single chat message in the conversation */
export interface WidgetMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
  sources?: ChatSource[]
}

export function useWidget(tenantSlug: string) {
  // ── Reactive State ──────────────────────────────────────────
  const state = ref<WidgetState>('CLOSED')
  const config = ref<PublicConfigResponse | null>(null)
  const messages = ref<WidgetMessage[]>([])
  const conversationId = ref<string | null>(null)
  const isTyping = ref(false)
  const isSending = ref(false)
  const errorMessage = ref<string | null>(null)

  // ── LocalStorage Keys ───────────────────────────────────────
  const sessionTokenKey = `crm_widget_session_${tenantSlug}`
  const convIdKey = `crm_widget_conv_${tenantSlug}`

  // ── Debounce Tracking ───────────────────────────────────────
  let lastSentAt = 0
  const DEBOUNCE_MS = 1000

  // ── Computed ────────────────────────────────────────────────
  const isOpen = computed(() => state.value !== 'CLOSED')
  const canSend = computed(() =>
    state.value === 'CHAT_ACTIVE' && !isSending.value && !isTyping.value,
  )

  // ── Private Helpers ─────────────────────────────────────────

  /** Retrieve stored session token from localStorage */
  function getStoredSessionToken(): string | null {
    try {
      return localStorage.getItem(sessionTokenKey)
    }
    catch {
      return null
    }
  }

  /** Persist session token to localStorage */
  function setStoredSessionToken(token: string): void {
    try {
      localStorage.setItem(sessionTokenKey, token)
    }
    catch {
      // localStorage unavailable
    }
  }

  /** Retrieve stored conversation ID from localStorage */
  function getStoredConversationId(): string | null {
    try {
      return localStorage.getItem(convIdKey)
    }
    catch {
      return null
    }
  }

  /** Persist conversation ID to localStorage */
  function setStoredConversationId(id: string): void {
    try {
      localStorage.setItem(convIdKey, id)
    }
    catch {
      // localStorage unavailable
    }
  }

  /** Clear all stored session data */
  function clearStoredSession(): void {
    try {
      localStorage.removeItem(sessionTokenKey)
      localStorage.removeItem(convIdKey)
    }
    catch {
      // localStorage unavailable
    }
  }

  // ── Public Methods ──────────────────────────────────────────

  /**
   * Load widget configuration from the API.
   * Transitions: CLOSED → LOADING_CONFIG → SHOW_FORM | SHOW_DISABLED
   */
  async function loadConfig(): Promise<void> {
    state.value = 'LOADING_CONFIG'
    errorMessage.value = null

    try {
      const response = await chatService.getConfig(tenantSlug)
      config.value = response.data

      // Check if widget is active
      if (!config.value.widget.isActive) {
        state.value = 'SHOW_DISABLED'
        return
      }

      // Check for existing session
      const storedToken = getStoredSessionToken()
      const storedConvId = getStoredConversationId()

      if (storedToken && storedConvId) {
        try {
          await chatService.validateSession(tenantSlug, storedToken)
          conversationId.value = storedConvId
          state.value = 'CHAT_ACTIVE'
          return
        }
        catch {
          // Session expired — clear and show form
          clearStoredSession()
        }
      }

      state.value = 'SHOW_FORM'
    }
    catch (err) {
      errorMessage.value = err instanceof ApiError
        ? err.message
        : 'Gagal memuat konfigurasi widget'
      state.value = 'CLOSED'
    }
  }

  /**
   * Submit the pre-chat form to create a session.
   * Transitions: SHOW_FORM → CREATING_SESSION → CHAT_ACTIVE
   */
  async function submitForm(values: Record<string, string>): Promise<void> {
    state.value = 'CREATING_SESSION'
    errorMessage.value = null

    try {
      // Start session with form values
      const sessionResponse = await chatService.startSession(tenantSlug, values)
      const sessionToken = sessionResponse.data.sessionToken
      setStoredSessionToken(sessionToken)

      // Start a conversation
      const convResponse = await chatService.startConversation(tenantSlug)
      conversationId.value = convResponse.data.id
      setStoredConversationId(convResponse.data.id)

      // Add welcome message if configured
      if (config.value?.widget.welcomeMessage) {
        messages.value.push({
          role: 'assistant',
          content: config.value.widget.welcomeMessage,
        })
      }

      state.value = 'CHAT_ACTIVE'
    }
    catch (err) {
      errorMessage.value = err instanceof ApiError
        ? err.message
        : 'Gagal membuat sesi'
      state.value = 'SHOW_FORM'
    }
  }

  /**
   * Send a message in the active conversation.
   * Implements 1-second debounce between messages.
   */
  async function sendMessage(message: string): Promise<void> {
    if (!conversationId.value || !canSend.value) return

    // Debounce: prevent sending within 1s of last message
    const now = Date.now()
    if (now - lastSentAt < DEBOUNCE_MS) return
    lastSentAt = now

    const trimmedMessage = message.trim()
    if (!trimmedMessage || trimmedMessage.length > 5000) return

    // Add user message to the list immediately
    messages.value.push({
      role: 'user',
      content: trimmedMessage,
    })

    isSending.value = true
    isTyping.value = true
    errorMessage.value = null

    try {
      const response = await chatService.sendMessage(
        tenantSlug,
        conversationId.value,
        { message: trimmedMessage },
      )

      // Add bot response
      messages.value.push({
        role: 'assistant',
        content: response.data.reply,
        sources: response.data.sources,
      })
    }
    catch (err) {
      if (err instanceof ApiError && err.statusCode === 401) {
        // Session expired
        clearStoredSession()
        state.value = 'SESSION_EXPIRED'
        return
      }

      // Add error message as system message
      messages.value.push({
        role: 'system',
        content: err instanceof ApiError
          ? err.message
          : 'Gagal mengirim pesan. Silakan coba lagi.',
      })
    }
    finally {
      isSending.value = false
      isTyping.value = false
    }
  }

  /**
   * End the current conversation.
   * Transitions: CHAT_ACTIVE → CHAT_ENDED
   */
  async function endConversation(): Promise<void> {
    if (!conversationId.value) return

    try {
      await chatService.endConversation(tenantSlug, conversationId.value)
    }
    catch {
      // Even if API call fails, allow ending locally
    }
    finally {
      state.value = 'CHAT_ENDED'
    }
  }

  /**
   * Start a new chat after conversation ends.
   * Clears messages and starts fresh conversation.
   */
  async function startNewChat(): Promise<void> {
    messages.value = []
    conversationId.value = null
    errorMessage.value = null

    // Remove old conversation ID but keep session
    try {
      localStorage.removeItem(convIdKey)
    }
    catch {
      // localStorage unavailable
    }

    const storedToken = getStoredSessionToken()
    if (!storedToken) {
      state.value = 'SHOW_FORM'
      return
    }

    try {
      // Validate session is still valid
      await chatService.validateSession(tenantSlug, storedToken)

      // Start a new conversation with existing session
      const convResponse = await chatService.startConversation(tenantSlug)
      conversationId.value = convResponse.data.id
      setStoredConversationId(convResponse.data.id)

      // Add welcome message
      if (config.value?.widget.welcomeMessage) {
        messages.value.push({
          role: 'assistant',
          content: config.value.widget.welcomeMessage,
        })
      }

      state.value = 'CHAT_ACTIVE'
    }
    catch {
      clearStoredSession()
      state.value = 'SHOW_FORM'
    }
  }

  /** Open the widget and load config if needed */
  function openWidget(): void {
    if (state.value === 'CLOSED') {
      loadConfig()
    }
  }

  /** Close the widget panel */
  function closeWidget(): void {
    state.value = 'CLOSED'
  }

  return {
    // State
    state: readonly(state),
    config: readonly(config),
    messages: readonly(messages),
    conversationId: readonly(conversationId),
    isTyping: readonly(isTyping),
    isSending: readonly(isSending),
    errorMessage: readonly(errorMessage),

    // Computed
    isOpen,
    canSend,

    // Actions
    loadConfig,
    submitForm,
    sendMessage,
    endConversation,
    startNewChat,
    openWidget,
    closeWidget,
  }
}
