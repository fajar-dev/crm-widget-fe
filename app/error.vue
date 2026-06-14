<!--
  Error Page

  Global error handler page displayed when Nuxt encounters
  an unhandled error (404, 500, etc.).

  @see https://nuxt.com/docs/getting-started/error-handling
-->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
    <UCard class="w-full max-w-md text-center">
      <div class="space-y-4">
        <div class="flex justify-center">
          <UIcon name="i-lucide-alert-triangle" class="size-12 text-red-500" />
        </div>
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white">
          {{ error?.statusCode ?? 500 }}
        </h1>
        <p class="text-gray-500 dark:text-gray-400">
          {{ error?.message ?? 'Terjadi kesalahan yang tidak terduga' }}
        </p>
        <UButton
          icon="i-lucide-home"
          label="Kembali ke Beranda"
          variant="solid"
          @click="handleError"
        />
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
/**
 * Error Page Script
 *
 * Receives the error prop from Nuxt and provides
 * navigation back to the home page.
 */
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

useSeoMeta({ title: `Error ${props.error?.statusCode ?? 500} — CRM Widget` })

function handleError() {
  clearError({ redirect: '/' })
}
</script>
