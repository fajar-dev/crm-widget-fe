/**
 * Tenant Store
 *
 * Manages current tenant context and tenant list.
 * X-Tenant-ID header is derived from currentTenant.
 */

import type { TenantResponse } from '~~/shared/types/tenant'

const TENANT_STORAGE_KEY = 'crm_current_tenant'

export const useTenantStore = defineStore('tenant', () => {
  // ── State ────────────────────────────────────────────────
  const tenants = ref<TenantResponse[]>([])
  const currentTenant = ref<TenantResponse | null>(null)
  const isLoading = ref(false)

  // ── Getters ──────────────────────────────────────────────
  const currentTenantId = computed(() => currentTenant.value?.id ?? null)
  const currentTenantSlug = computed(() => currentTenant.value?.slug ?? null)
  const hasTenants = computed(() => tenants.value.length > 0)

  // ── Actions ──────────────────────────────────────────────

  /** Restore current tenant from localStorage */
  function restoreCurrentTenant(): void {
    if (import.meta.server) return
    try {
      const stored = localStorage.getItem(TENANT_STORAGE_KEY)
      if (stored) {
        currentTenant.value = JSON.parse(stored)
      }
    }
    catch {
      currentTenant.value = null
    }
  }

  /** Set current tenant and persist */
  function setCurrentTenant(tenant: TenantResponse): void {
    currentTenant.value = tenant
    if (!import.meta.server) {
      localStorage.setItem(TENANT_STORAGE_KEY, JSON.stringify(tenant))
    }
  }

  /** Fetch tenant list */
  async function fetchTenants(): Promise<void> {
    isLoading.value = true
    try {
      const { tenantService } = await import('~/services/TenantService')
      const response = await tenantService.listTenants()
      tenants.value = response.data as TenantResponse[]

      // Auto-select first tenant if none selected
      if (!currentTenant.value && tenants.value.length > 0) {
        setCurrentTenant(tenants.value[0])
      }
    }
    catch {
      tenants.value = []
    }
    finally {
      isLoading.value = false
    }
  }

  /** Set tenants list */
  function setTenants(list: TenantResponse[]): void {
    tenants.value = list
  }

  /** Clear tenant state on logout */
  function clearTenant(): void {
    tenants.value = []
    currentTenant.value = null
    if (!import.meta.server) {
      localStorage.removeItem(TENANT_STORAGE_KEY)
    }
  }

  return {
    tenants,
    currentTenant: readonly(currentTenant),
    isLoading: readonly(isLoading),
    currentTenantId,
    currentTenantSlug,
    hasTenants,
    restoreCurrentTenant,
    setCurrentTenant,
    setTenants,
    fetchTenants,
    clearTenant,
  }
})
