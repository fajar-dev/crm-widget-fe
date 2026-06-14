/**
 * Auth Middleware
 *
 * Protects dashboard routes — redirects to /login if not authenticated.
 */

export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()

  // Public routes that don't need auth
  const publicRoutes = ['/login', '/register', '/widget']
  const isPublic = publicRoutes.some(route => to.path.startsWith(route))

  if (isPublic) {
    // Redirect to dashboard if already logged in (for login/register)
    if (authStore.isAuthenticated && (to.path === '/login' || to.path === '/register')) {
      return navigateTo('/chatbot/widget')
    }
    return
  }

  // Redirect to login if not authenticated
  if (!authStore.isAuthenticated) {
    return navigateTo('/login')
  }
})
