<!--
  Embed Code Page

  Dashboard page displaying the embeddable widget script tag
  with copy-to-clipboard functionality.

  Layout: dashboard
  Route: /embed
-->
<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div>
      <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
        Kode Embed
      </h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
        Salin kode berikut dan tempel di website Anda untuk menampilkan widget chat
      </p>
    </div>

    <!-- Embed Code Card -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-code" class="text-lg text-primary" />
            <h2 class="text-base font-semibold text-gray-900 dark:text-white">
              Script Tag
            </h2>
          </div>
          <UButton
            :icon="copied ? 'i-lucide-check' : 'i-lucide-copy'"
            :label="copied ? 'Tersalin!' : 'Salin'"
            :color="copied ? 'success' : 'neutral'"
            variant="outline"
            size="sm"
            @click="handleCopy"
          />
        </div>
      </template>

      <!-- Code snippet -->
      <div class="rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 overflow-x-auto">
        <pre class="text-sm font-mono text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-all">{{ embedCode }}</pre>
      </div>

      <template #footer>
        <div class="flex items-start gap-2 text-xs text-gray-500 dark:text-gray-400">
          <UIcon name="i-lucide-info" class="size-4 flex-shrink-0 mt-0.5" />
          <p>
            Tempel kode ini sebelum tag penutup <code class="px-1 py-0.5 rounded bg-gray-100 dark:bg-gray-700 font-mono text-xs">&lt;/body&gt;</code>
            pada halaman HTML Anda. Widget akan otomatis tampil di pojok kanan bawah.
          </p>
        </div>
      </template>
    </UCard>

    <!-- Preview Link -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon name="i-lucide-eye" class="text-lg text-primary" />
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">
            Preview Widget
          </h2>
        </div>
      </template>

      <div class="flex items-center justify-between">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          Lihat preview widget chat sebelum embed di website Anda
        </p>
        <UButton
          v-if="tenantSlug"
          :to="`/widget/${tenantSlug}`"
          label="Buka Preview"
          icon="i-lucide-external-link"
          variant="outline"
          size="sm"
          target="_blank"
        />
      </div>
    </UCard>
  </div>
</template>

<script setup lang="ts">
/**
 * Embed Code Page — /embed
 *
 * Displays the widget embed script snippet with
 * copy-to-clipboard using VueUse's useClipboard.
 */

definePageMeta({
  layout: 'dashboard',
})

useSeoMeta({
  title: 'Kode Embed — CRM Widget',
})

const toast = useToast()
const tenantStore = useTenantStore()
const { copy, copied } = useClipboard()

/** Current tenant slug */
const tenantSlug = computed(() => tenantStore.currentTenantSlug)

/** Generate the embed code snippet */
const embedCode = computed(() => {
  const slug = tenantSlug.value ?? 'YOUR_TENANT_SLUG'
  return `<script src="https://cdn.example.com/widget.js" data-tenant="${slug}"><\/script>`
})

/** Copy embed code to clipboard with toast feedback */
async function handleCopy(): Promise<void> {
  try {
    await copy(embedCode.value)
    toast.add({
      title: 'Tersalin!',
      description: 'Kode embed berhasil disalin ke clipboard',
      icon: 'i-lucide-check-circle',
      color: 'success',
    })
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'Gagal menyalin ke clipboard',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
}
</script>
