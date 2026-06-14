<!--
  Index Page — Root Redirect

  Redirects authenticated users to /chatbot/widget (dashboard),
  and unauthenticated users to /login.

  @see app/stores/useAuthStore.ts — isAuthenticated
-->
<template>
  <div class="min-h-screen flex items-center justify-center">
    <UIcon name="i-lucide-loader-2" class="size-8 text-gray-400 animate-spin" />
  </div>
</template>

<script setup lang="ts">
/**
 * Index Page Script
 *
 * Performs auth-based redirect on mount. Shows a spinner
 * during the brief check.
 */
definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'CRM Widget' })

const authStore = useAuthStore()
const tenantStore = useTenantStore()

onMounted(() => {
  authStore.restoreAuth()
  tenantStore.restoreCurrentTenant()
  if (authStore.isAuthenticated) {
    if (tenantStore.currentTenantId) {
      navigateTo('/chatbot/widget')
    } else {
      navigateTo('/tenant/select')
    }
  } else {
    navigateTo('/login')
  }
})
</script>
