/**
 * Auth Store
 *
 * Manages authentication state — user, tokens, login/logout.
 * Uses JWT Bearer token with auto-refresh.
 *
 * @see docs/API_GUIDE.md — Authentication patterns
 */

import type { AuthTokens, LoginRequest, RegisterRequest, UserResponse } from '~~/shared/types/auth'

const AUTH_STORAGE_KEY = 'crm_auth'

interface PersistedAuth {
  accessToken: string
  refreshToken: string
  user: UserResponse | null
}

export const useAuthStore = defineStore('auth', () => {
  // ── State ────────────────────────────────────────────────
  const user = ref<UserResponse | null>(null)
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const isLoading = ref(false)

  // ── Getters ──────────────────────────────────────────────
  const isAuthenticated = computed(() => !!accessToken.value)
  const fullName = computed(() => {
    if (!user.value) return ''
    return `${user.value.firstName} ${user.value.lastName}`
  })
  const userInitials = computed(() => {
    if (!user.value) return ''
    return `${user.value.firstName.charAt(0)}${user.value.lastName.charAt(0)}`.toUpperCase()
  })

  // ── Actions ──────────────────────────────────────────────

  /** Restore auth state from localStorage */
  function restoreAuth(): void {
    if (import.meta.server) return
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY)
      if (stored) {
        const data: PersistedAuth = JSON.parse(stored)
        accessToken.value = data.accessToken
        refreshToken.value = data.refreshToken
        user.value = data.user
      }
    }
    catch {
      clearAuth()
    }
  }

  /** Persist auth state to localStorage */
  function persistAuth(): void {
    if (import.meta.server) return
    const data: PersistedAuth = {
      accessToken: accessToken.value ?? '',
      refreshToken: refreshToken.value ?? '',
      user: user.value,
    }
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data))
  }

  /** Set tokens and persist */
  function setTokens(tokens: AuthTokens): void {
    accessToken.value = tokens.accessToken
    refreshToken.value = tokens.refreshToken
    persistAuth()
  }

  /** Set user data */
  function setUser(userData: UserResponse): void {
    user.value = userData
    persistAuth()
  }

  /** Login with email/password. Returns 'has_tenant', 'no_tenant', or false on failure. */
  async function login(payload: LoginRequest): Promise<'has_tenant' | 'no_tenant' | false> {
    isLoading.value = true
    try {
      const { authService } = await import('~/services/AuthService')
      const response = await authService.login(payload)
      const { tokens, user: userData, tenants: tenantList, activeTenant } = response.data

      // Set tokens first so subsequent API calls have auth
      setTokens(tokens)
      setUser(userData)

      // Set tenants in tenant store
      const tenantStore = useTenantStore()
      if (activeTenant) {
        tenantStore.setCurrentTenant(activeTenant as never)
        return 'has_tenant'
      }
      else if (tenantList && tenantList.length > 0) {
        // Has tenants but no active one — let user select
        return 'no_tenant'
      }

      return 'no_tenant'
    }
    catch {
      return false
    }
    finally {
      isLoading.value = false
    }
  }

  /** Register new user */
  async function register(payload: RegisterRequest): Promise<boolean> {
    isLoading.value = true
    try {
      const { authService } = await import('~/services/AuthService')
      await authService.register(payload)
      return true
    }
    catch {
      return false
    }
    finally {
      isLoading.value = false
    }
  }

  /** Refresh access token */
  async function refreshAccessToken(): Promise<boolean> {
    if (!refreshToken.value) return false
    try {
      const { authService } = await import('~/services/AuthService')
      const response = await authService.refresh({ refreshToken: refreshToken.value })
      setTokens(response.data)
      return true
    }
    catch {
      clearAuth()
      return false
    }
  }

  /** Logout and clear auth state */
  async function logout(): Promise<void> {
    try {
      if (refreshToken.value) {
        const { authService } = await import('~/services/AuthService')
        await authService.logout(refreshToken.value)
      }
    }
    catch {
      // Ignore logout errors
    }
    finally {
      clearAuth()
      navigateTo('/login')
    }
  }

  /** Clear all auth state */
  function clearAuth(): void {
    user.value = null
    accessToken.value = null
    refreshToken.value = null
    if (!import.meta.server) {
      localStorage.removeItem(AUTH_STORAGE_KEY)
    }
  }

  return {
    user: readonly(user),
    accessToken: readonly(accessToken),
    refreshToken: readonly(refreshToken),
    isLoading: readonly(isLoading),
    isAuthenticated,
    fullName,
    userInitials,
    restoreAuth,
    setTokens,
    setUser,
    login,
    register,
    refreshAccessToken,
    logout,
    clearAuth,
  }
})
