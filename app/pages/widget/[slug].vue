<!--
  Widget Preview Page (Standalone)

  Full-page widget preview for testing. Uses no layout (no dashboard chrome).
  Loads the WidgetContainer component with the tenant slug from route params.

  Route: /widget/:slug
-->
<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-950">
    <!-- Minimal top bar -->
    <div class="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-3">
      <div class="max-w-2xl mx-auto flex items-center justify-between">
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-eye" class="text-lg text-primary" />
          <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
            Widget Preview
          </span>
          <UBadge :label="tenantSlug" variant="subtle" color="neutral" size="sm" />
        </div>
        <UButton
          label="Kembali"
          icon="i-lucide-arrow-left"
          variant="ghost"
          color="neutral"
          size="sm"
          to="/embed"
        />
      </div>
    </div>

    <!-- Preview area — widget renders fixed bottom-right -->
    <div class="max-w-2xl mx-auto p-6">
      <UCard>
        <div class="text-center space-y-3 py-8">
          <UIcon name="i-lucide-monitor" class="size-12 text-gray-300 dark:text-gray-600 mx-auto" />
          <div class="space-y-1">
            <p class="text-sm font-medium text-gray-700 dark:text-gray-300">
              Preview Mode
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400">
              Widget chat ditampilkan di pojok kanan bawah halaman ini.
              Klik tombol chat untuk memulai.
            </p>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Widget Component (renders as fixed bottom-right overlay) -->
    <WidgetWidgetContainer :tenant-slug="tenantSlug" />
  </div>
</template>

<script setup lang="ts">
/**
 * Widget Preview Page — /widget/:slug
 *
 * Standalone page for previewing/testing the chat widget.
 * No dashboard layout — just a minimal shell with the widget.
 */

definePageMeta({
  layout: false,
})

const route = useRoute()

/** Extract tenant slug from route params */
const tenantSlug = computed(() => {
  const slug = route.params.slug
  return Array.isArray(slug) ? slug[0] : slug
})

useSeoMeta({
  title: `Widget Preview — ${tenantSlug.value}`,
})
</script>
