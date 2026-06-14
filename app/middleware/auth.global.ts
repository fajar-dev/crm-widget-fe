/**
 * Auth Middleware
 *
 * Protects dashboard routes:
 * 1. No token → /login
 * 2. Token but no tenant → /tenant/select
 * 3. Token + tenant → allow
 */

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  const tenantStore = useTenantStore()

  // Public routes that don't need auth
  const publicRoutes = ['/login', '/register', '/widget']
  const isPublic = publicRoutes.some(route => to.path.startsWith(route))

  // Tenant onboarding route — needs auth but NOT tenant
  const isTenantSelect = to.path.startsWith('/tenant/select')

  if (isPublic) {
    // Redirect to dashboard if already logged in (for login/register)
    if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/register')) {
      if (tenantStore.currentTenantId) {
        return navigateTo('/chatbot/widget')
      }
      else {
        return navigateTo('/tenant/select')
      }
    }
    return
  }

  // Not authenticated → login
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }

  // Tenant select page — just needs auth, no tenant required
  if (isTenantSelect) {
    return
  }

  // Dashboard routes — require tenant context
  if (!tenantStore.currentTenantId) {
    return navigateTo('/tenant/select')
  }
})
