<!--
  ChatHeader Component

  Displays the widget header bar with tenant branding and a close button.
  Shows the tenant logo or a default icon, tenant name, and
  an "online" status indicator.

  @props tenantName - Display name of the tenant
  @props iconPath  - Optional URL to tenant logo image
  @props onClose   - Callback to close the widget
-->
<template>
  <div class="flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
    <!-- Tenant logo or default icon -->
    <div class="flex-shrink-0">
      <NuxtImg
        v-if="iconPath"
        :src="iconPath"
        :alt="tenantName"
        class="size-9 rounded-full object-cover"
      />
      <div
        v-else
        class="flex size-9 items-center justify-center rounded-full bg-primary/10"
      >
        <UIcon name="i-lucide-bot" class="text-lg text-primary" />
      </div>
    </div>

    <!-- Tenant info -->
    <div class="flex-1 min-w-0">
      <p class="text-sm font-semibold text-gray-900 dark:text-white truncate">
        {{ tenantName }}
      </p>
      <p class="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
        <span class="inline-block size-2 rounded-full bg-green-500" />
        Online
      </p>
    </div>

    <!-- Close button -->
    <UButton
      icon="i-lucide-x"
      variant="ghost"
      color="neutral"
      size="sm"
      aria-label="Tutup widget"
      @click="onClose"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * ChatHeader — widget header with tenant branding
 *
 * @see ~/composables/useWidget.ts for close handler
 */

defineProps<{
  /** Display name of the tenant */
  tenantName: string
  /** Optional URL path to tenant's logo */
  iconPath: string | null
  /** Callback when close button is clicked */
  onClose: () => void
}>()
</script>
