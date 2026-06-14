<!--
  Widget Settings Page

  Two-column layout: form (left) and live preview (right).
  Manages widget appearance: welcome message, color, font,
  session timeout, and active status.

  @see shared/types/widget-settings.ts — WidgetSettingsResponse
  @see app/services/WidgetSettingsService.ts
-->
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Widget Settings</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Konfigurasi tampilan dan perilaku chat widget</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoadingData" class="flex items-center justify-center py-16">
      <UIcon name="i-lucide-loader-2" class="size-8 text-gray-400 animate-spin" />
    </div>

    <!-- Main Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Form Panel -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-settings" class="size-5 text-gray-500" />
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Konfigurasi Widget</h2>
          </div>
        </template>

        <div class="space-y-5">
          <UFormField label="Welcome Message" name="welcomeMessage">
            <UTextarea
              v-model="form.welcomeMessage"
              placeholder="Pesan selamat datang untuk pengunjung..."
              :rows="3"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Primary Color" name="primaryColor">
            <div class="flex items-center gap-3">
              <UInput
                v-model="form.primaryColor"
                type="color"
                class="w-12 h-10"
              />
              <UInput
                v-model="form.primaryColor"
                placeholder="#4F46E5"
                class="flex-1"
              />
            </div>
          </UFormField>

          <UFormField label="Font Family" name="fontFamily">
            <USelect
              v-model="form.fontFamily"
              :items="fontFamilyOptions"
              placeholder="Pilih font..."
              class="w-full"
            />
          </UFormField>

          <UFormField label="Session Timeout (menit)" name="sessionTimeout">
            <UInput
              v-model.number="form.sessionTimeout"
              type="number"
              :min="1"
              placeholder="30"
              icon="i-lucide-clock"
              class="w-full"
            />
          </UFormField>

          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">Widget Aktif</p>
              <p class="text-xs text-gray-500 dark:text-gray-400">Tampilkan widget di halaman publik</p>
            </div>
            <USwitch v-model="form.isActive" />
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton
              icon="i-lucide-save"
              label="Simpan Pengaturan"
              :loading="isSaving"
              @click="onSave"
            />
          </div>
        </template>
      </UCard>

      <!-- Preview Panel -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-eye" class="size-5 text-gray-500" />
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Preview</h2>
          </div>
        </template>

        <div class="space-y-4">
          <!-- Mock Chat Window -->
          <div class="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
            <!-- Chat Header -->
            <div
              class="px-4 py-3 text-white flex items-center gap-2"
              :style="{ backgroundColor: form.primaryColor || '#4F46E5' }"
            >
              <UIcon name="i-lucide-bot" class="size-5" />
              <span class="font-medium" :style="{ fontFamily: form.fontFamily || 'Inter' }">
                {{ tenantStore.currentTenant?.name ?? 'CRM Widget' }}
              </span>
            </div>
            <!-- Chat Body -->
            <div class="p-4 bg-gray-50 dark:bg-gray-900 min-h-32">
              <div class="bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm max-w-xs">
                <p class="text-sm text-gray-700 dark:text-gray-300" :style="{ fontFamily: form.fontFamily || 'Inter' }">
                  {{ form.welcomeMessage || 'Halo! Ada yang bisa saya bantu?' }}
                </p>
              </div>
            </div>
          </div>

          <!-- Mock Floating Button -->
          <div class="flex justify-end">
            <div
              class="size-12 rounded-full flex items-center justify-center shadow-lg cursor-default"
              :style="{ backgroundColor: form.primaryColor || '#4F46E5' }"
            >
              <UIcon name="i-lucide-message-circle" class="size-6 text-white" />
            </div>
          </div>

          <!-- Info -->
          <div class="text-xs text-gray-400 dark:text-gray-500 space-y-1">
            <p>Font: {{ form.fontFamily || 'Inter' }}</p>
            <p>Timeout: {{ form.sessionTimeout || 30 }} menit</p>
            <p>Status: {{ form.isActive ? 'Aktif' : 'Nonaktif' }}</p>
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Widget Settings Page Script
 *
 * Loads settings on mount, provides form editing, and saves via API.
 */
import { widgetSettingsService } from '~/services/WidgetSettingsService'
import type { UpdateWidgetSettingsRequest } from '~~/shared/types/widget-settings'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Widget Settings — CRM Widget' })

const toast = useToast()
const tenantStore = useTenantStore()

const isLoadingData = ref(true)
const isSaving = ref(false)

const fontFamilyOptions = ['Inter', 'Roboto', 'Open Sans', 'Outfit', 'Poppins']

const form = reactive({
  welcomeMessage: '',
  primaryColor: '#4F46E5',
  fontFamily: 'Inter',
  sessionTimeout: 30,
  isActive: true,
})

/** Load current widget settings from API */
async function loadSettings(): Promise<void> {
  isLoadingData.value = true
  try {
    const response = await widgetSettingsService.getSettings()
    const data = response.data
    form.welcomeMessage = data.welcomeMessage
    form.primaryColor = data.primaryColor
    form.fontFamily = data.fontFamily
    form.sessionTimeout = data.sessionTimeout
    form.isActive = data.isActive
  } catch {
    toast.add({ title: 'Gagal memuat pengaturan widget', color: 'error', icon: 'i-lucide-x' })
  } finally {
    isLoadingData.value = false
  }
}

/** Save widget settings to API */
async function onSave(): Promise<void> {
  isSaving.value = true
  try {
    const payload: UpdateWidgetSettingsRequest = {
      welcomeMessage: form.welcomeMessage,
      primaryColor: form.primaryColor,
      fontFamily: form.fontFamily,
      sessionTimeout: form.sessionTimeout,
      isActive: form.isActive,
    }
    await widgetSettingsService.updateSettings(payload)
    toast.add({ title: 'Pengaturan widget berhasil disimpan', color: 'success', icon: 'i-lucide-check' })
  } catch {
    toast.add({ title: 'Gagal menyimpan pengaturan', color: 'error', icon: 'i-lucide-x' })
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  loadSettings()
})
</script>
