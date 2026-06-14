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

onMounted(() => {
  authStore.restoreAuth()
  if (authStore.isAuthenticated) {
    navigateTo('/chatbot/widget')
  } else {
    navigateTo('/login')
  }
})
</script>
