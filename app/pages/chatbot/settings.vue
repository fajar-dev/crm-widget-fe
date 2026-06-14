<!--
  Chatbot Settings Page

  Manages AI model configuration: system instruction,
  model name, embedding model, temperature, max tokens,
  top P, and top K parameters.

  @see shared/types/chatbot-settings.ts — ChatbotSettingsResponse
  @see app/services/ChatbotSettingsService.ts
-->
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Chatbot Settings</h1>
      <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Konfigurasi model AI dan instruksi sistem</p>
    </div>

    <!-- Loading State -->
    <div v-if="isLoadingData" class="flex items-center justify-center py-16">
      <UIcon name="i-lucide-loader-2" class="size-8 text-gray-400 animate-spin" />
    </div>

    <!-- Main Content -->
    <div v-else class="space-y-6">
      <!-- System Instruction -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-file-text" class="size-5 text-gray-500" />
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">System Instruction</h2>
          </div>
        </template>

        <UFormField label="Instruksi Sistem" name="systemInstruction">
          <UTextarea
            v-model="form.systemInstruction"
            placeholder="Masukkan instruksi sistem untuk chatbot..."
            :rows="8"
            class="w-full font-mono min-h-48"
          />
        </UFormField>
        <p class="text-xs text-gray-400 dark:text-gray-500 mt-2">
          Instruksi ini menentukan perilaku dan kepribadian chatbot saat berinteraksi dengan pengguna.
        </p>
      </UCard>

      <!-- Model Configuration -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-cpu" class="size-5 text-gray-500" />
            <h2 class="text-lg font-medium text-gray-900 dark:text-white">Model Configuration</h2>
          </div>
        </template>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
          <UFormField label="Model Name" name="modelName">
            <UInput
              v-model="form.modelName"
              placeholder="gemini-2.0-flash"
              icon="i-lucide-brain"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Embedding Model" name="embeddingModel">
            <UInput
              v-model="form.embeddingModel"
              placeholder="text-embedding-004"
              icon="i-lucide-layers"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Temperature" name="temperature">
            <UInput
              v-model.number="form.temperature"
              type="number"
              :step="0.1"
              :min="0"
              :max="2"
              placeholder="0.7"
              icon="i-lucide-thermometer"
              class="w-full"
            />
            <p class="text-xs text-gray-400 mt-1">0 = deterministik, 2 = kreatif</p>
          </UFormField>

          <UFormField label="Max Tokens" name="maxTokens">
            <UInput
              v-model.number="form.maxTokens"
              type="number"
              :min="1"
              placeholder="4096"
              icon="i-lucide-hash"
              class="w-full"
            />
          </UFormField>

          <UFormField label="Top P" name="topP">
            <UInput
              v-model.number="form.topP"
              type="number"
              :step="0.05"
              :min="0"
              :max="1"
              placeholder="0.95"
              icon="i-lucide-percent"
              class="w-full"
            />
            <p class="text-xs text-gray-400 mt-1">Nucleus sampling (0–1)</p>
          </UFormField>

          <UFormField label="Top K" name="topK">
            <UInput
              v-model.number="form.topK"
              type="number"
              :min="1"
              placeholder="40"
              icon="i-lucide-list-ordered"
              class="w-full"
            />
            <p class="text-xs text-gray-400 mt-1">Jumlah token teratas untuk sampling</p>
          </UFormField>
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
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Chatbot Settings Page Script
 *
 * Loads and saves AI model configuration via ChatbotSettingsService.
 */
import { chatbotSettingsService } from '~/services/ChatbotSettingsService'
import type { UpdateChatbotSettingsRequest } from '~~/shared/types/chatbot-settings'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Chatbot Settings — CRM Widget' })

const toast = useToast()

const isLoadingData = ref(true)
const isSaving = ref(false)

const form = reactive({
  systemInstruction: '',
  modelName: 'gemini-2.0-flash',
  embeddingModel: 'text-embedding-004',
  temperature: 0.7,
  maxTokens: 4096,
  topP: 0.95,
  topK: 40,
})

/** Load current chatbot settings from API */
async function loadSettings(): Promise<void> {
  isLoadingData.value = true
  try {
    const response = await chatbotSettingsService.getSettings()
    const data = response.data
    form.systemInstruction = data.systemInstruction
    form.modelName = data.modelName
    form.embeddingModel = data.embeddingModel
    form.temperature = data.temperature
    form.maxTokens = data.maxTokens
    form.topP = data.topP
    form.topK = data.topK
  } catch {
    toast.add({ title: 'Gagal memuat pengaturan chatbot', color: 'error', icon: 'i-lucide-x' })
  } finally {
    isLoadingData.value = false
  }
}

/** Save chatbot settings to API */
async function onSave(): Promise<void> {
  isSaving.value = true
  try {
    const payload: UpdateChatbotSettingsRequest = {
      systemInstruction: form.systemInstruction,
      modelName: form.modelName,
      embeddingModel: form.embeddingModel,
      temperature: form.temperature,
      maxTokens: form.maxTokens,
      topP: form.topP,
      topK: form.topK,
    }
    await chatbotSettingsService.updateSettings(payload)
    toast.add({ title: 'Pengaturan chatbot berhasil disimpan', color: 'success', icon: 'i-lucide-check' })
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
