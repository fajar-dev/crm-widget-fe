/**
 * Auth Init Plugin
 *
 * Restores auth and tenant state from localStorage on app startup.
 */

export default defineNuxtPlugin(() => {
  const authStore = useAuthStore()
  const tenantStore = useTenantStore()

  authStore.restoreAuth()
  tenantStore.restoreCurrentTenant()
})
