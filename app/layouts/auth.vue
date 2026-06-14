<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
    <div class="w-full max-w-md">
      <!-- Logo/Brand -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center gap-2 mb-2">
          <UIcon name="i-lucide-bot" class="text-primary text-3xl" />
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">CRM Widget</h1>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400">Multi-tenant CRM Chatbot Platform</p>
      </div>

      <!-- Page Content -->
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Auth Layout
 *
 * Centered layout for authentication pages (login/register).
 * Clean, minimal design with brand identity.
 */

definePageMeta({
  layout: 'auth',
})
</script>
