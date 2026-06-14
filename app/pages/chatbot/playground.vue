<!--
  Playground Page

  Interactive chat interface for testing chatbot AI responses,
  with collapsible chatbot settings panel (model config, system instruction).

  @see ~/services/PlaygroundService
  @see ~/services/ChatbotSettingsService
-->
<template>
  <div class="flex flex-col" style="height: calc(100vh - 8rem);">
    <!-- Page Header -->
    <div class="flex items-center justify-between pb-4">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
          Playground
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Test chatbot AI dan konfigurasi model.
        </p>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          icon="i-lucide-settings"
          label="Settings"
          variant="outline"
          color="neutral"
          size="sm"
          @click="showSettings = !showSettings"
        />
        <UButton
          icon="i-lucide-trash-2"
          label="Clear Chat"
          variant="outline"
          color="neutral"
          size="sm"
          :disabled="chatMessages.length === 0"
          @click="clearChat"
        />
      </div>
    </div>

    <!-- Chatbot Settings Panel (Collapsible) -->
    <div v-if="showSettings" class="pb-4">
      <UCard>
        <template #header>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-cpu" class="size-5 text-gray-500" />
              <h2 class="text-base font-medium text-gray-900 dark:text-white">Chatbot Settings</h2>
            </div>
            <UButton
              icon="i-lucide-x"
              variant="ghost"
              color="neutral"
              size="xs"
              @click="showSettings = false"
            />
          </div>
        </template>

        <!-- Loading -->
        <div v-if="settingsLoading" class="flex items-center justify-center py-8">
          <UIcon name="i-lucide-loader-2" class="size-6 text-gray-400 animate-spin" />
        </div>

        <div v-else class="space-y-5">
          <!-- System Instruction -->
          <UFormField label="System Instruction" name="systemInstruction">
            <UTextarea
              v-model="settingsForm.systemInstruction"
              placeholder="Instruksi sistem untuk chatbot..."
              :rows="5"
              class="w-full font-mono"
            />
          </UFormField>

          <!-- Model Config Grid -->
          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <UFormField label="Model" name="modelName">
              <UInput
                v-model="settingsForm.modelName"
                placeholder="gemini-2.0-flash"
                icon="i-lucide-brain"
                class="w-full"
                size="sm"
              />
            </UFormField>

            <UFormField label="Embedding Model" name="embeddingModel">
              <UInput
                v-model="settingsForm.embeddingModel"
                placeholder="text-embedding-004"
                icon="i-lucide-layers"
                class="w-full"
                size="sm"
              />
            </UFormField>

            <UFormField label="Temperature" name="temperature">
              <UInput
                v-model.number="settingsForm.temperature"
                type="number"
                :step="0.1"
                :min="0"
                :max="2"
                placeholder="0.7"
                icon="i-lucide-thermometer"
                class="w-full"
                size="sm"
              />
            </UFormField>

            <UFormField label="Max Tokens" name="maxTokens">
              <UInput
                v-model.number="settingsForm.maxTokens"
                type="number"
                :min="1"
                placeholder="4096"
                icon="i-lucide-hash"
                class="w-full"
                size="sm"
              />
            </UFormField>

            <UFormField label="Top P" name="topP">
              <UInput
                v-model.number="settingsForm.topP"
                type="number"
                :step="0.05"
                :min="0"
                :max="1"
                placeholder="0.95"
                icon="i-lucide-percent"
                class="w-full"
                size="sm"
              />
            </UFormField>

            <UFormField label="Top K" name="topK">
              <UInput
                v-model.number="settingsForm.topK"
                type="number"
                :min="1"
                placeholder="40"
                icon="i-lucide-list-ordered"
                class="w-full"
                size="sm"
              />
            </UFormField>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end">
            <UButton
              icon="i-lucide-save"
              label="Simpan Settings"
              size="sm"
              :loading="settingsSaving"
              @click="saveSettings"
            />
          </div>
        </template>
      </UCard>
    </div>

    <!-- Chat Area -->
    <UCard class="flex flex-1 flex-col min-h-0 overflow-hidden">
      <!-- Messages -->
      <div ref="messagesContainer" class="flex-1 overflow-y-auto space-y-4 p-1">
        <!-- Empty State -->
        <div
          v-if="chatMessages.length === 0"
          class="flex h-full items-center justify-center"
        >
          <div class="text-center">
            <UIcon name="i-lucide-bot" class="size-12 text-gray-300 dark:text-gray-600" />
            <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
              Mulai percakapan dengan mengirim pesan di bawah.
            </p>
          </div>
        </div>

        <!-- Messages List -->
        <template v-else>
          <div
            v-for="(msg, idx) in chatMessages"
            :key="idx"
            class="flex"
            :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
          >
            <div
              class="max-w-prose rounded-lg px-4 py-2.5"
              :class="msg.role === 'user'
                ? 'bg-primary text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'"
            >
              <!-- eslint-disable-next-line vue/no-v-html -->
              <div
                v-if="msg.role === 'assistant'"
                class="prose prose-sm dark:prose-invert max-w-none"
                v-html="msg.content"
              />
              <p v-else class="text-sm whitespace-pre-wrap">
                {{ msg.content }}
              </p>

              <!-- Sources -->
              <div
                v-if="msg.role === 'assistant' && msg.sources && msg.sources.length > 0"
                class="mt-2 border-t border-gray-200 dark:border-gray-700 pt-2"
              >
                <details class="text-xs">
                  <summary class="cursor-pointer text-gray-500 dark:text-gray-400 select-none">
                    {{ msg.sources.length }} sumber referensi
                  </summary>
                  <ul class="mt-1 space-y-1">
                    <li
                      v-for="(source, sIdx) in msg.sources"
                      :key="sIdx"
                      class="rounded bg-gray-50 dark:bg-gray-900 p-2"
                    >
                      <span class="font-medium">{{ source.title }}</span>
                      <p class="mt-0.5 text-gray-500 dark:text-gray-400 line-clamp-2">
                        {{ source.content }}
                      </p>
                    </li>
                  </ul>
                </details>
              </div>

              <!-- Stats -->
              <div
                v-if="msg.role === 'assistant' && msg.stats"
                class="mt-1.5 flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500"
              >
                <span v-if="msg.stats.conversationId">
                  Conv: {{ msg.stats.conversationId.slice(0, 8) }}...
                </span>
              </div>
            </div>
          </div>

          <!-- Typing indicator -->
          <div v-if="sending" class="flex justify-start">
            <div class="rounded-lg bg-gray-100 dark:bg-gray-800 px-4 py-3">
              <div class="flex items-center gap-1">
                <span class="size-2 animate-bounce rounded-full bg-gray-400" />
                <span class="size-2 animate-bounce rounded-full bg-gray-400 delay-100" />
                <span class="size-2 animate-bounce rounded-full bg-gray-400 delay-200" />
              </div>
            </div>
          </div>
        </template>
      </div>

      <!-- Input Area -->
      <template #footer>
        <form class="flex items-center gap-2" @submit.prevent="sendMessage">
          <UInput
            v-model="messageInput"
            placeholder="Ketik pesan..."
            class="flex-1"
            :disabled="sending"
            autofocus
          />
          <UButton
            type="submit"
            icon="i-lucide-send"
            :loading="sending"
            :disabled="!messageInput.trim() || sending"
          />
        </form>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
/**
 * Playground Page
 *
 * Interactive chat interface for testing chatbot AI,
 * with inline chatbot settings (collapsible panel).
 */
import { playgroundService } from '~/services/PlaygroundService'
import { chatbotSettingsService } from '~/services/ChatbotSettingsService'
import type { PlaygroundHistoryItem } from '~~/shared/types/playground'
import type { ChatSource } from '~~/shared/types/chat'
import type { UpdateChatbotSettingsRequest } from '~~/shared/types/chatbot-settings'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Playground — CRM Widget' })

const toast = useToast()

// ── Settings State ──────────────────────────────────────────
const showSettings = ref(false)
const settingsLoading = ref(false)
const settingsSaving = ref(false)

const settingsForm = reactive({
  systemInstruction: '',
  modelName: 'gemini-2.0-flash',
  embeddingModel: 'text-embedding-004',
  temperature: 0.7,
  maxTokens: 4096,
  topP: 0.95,
  topK: 40,
})

async function loadSettings(): Promise<void> {
  settingsLoading.value = true
  try {
    const response = await chatbotSettingsService.getSettings()
    const data = response.data
    settingsForm.systemInstruction = data.systemInstruction
    settingsForm.modelName = data.modelName
    settingsForm.embeddingModel = data.embeddingModel
    settingsForm.temperature = data.temperature
    settingsForm.maxTokens = data.maxTokens
    settingsForm.topP = data.topP
    settingsForm.topK = data.topK
  }
  catch {
    toast.add({ title: 'Gagal memuat settings', color: 'error', icon: 'i-lucide-x' })
  }
  finally {
    settingsLoading.value = false
  }
}

async function saveSettings(): Promise<void> {
  settingsSaving.value = true
  try {
    const payload: UpdateChatbotSettingsRequest = {
      systemInstruction: settingsForm.systemInstruction,
      modelName: settingsForm.modelName,
      embeddingModel: settingsForm.embeddingModel,
      temperature: settingsForm.temperature,
      maxTokens: settingsForm.maxTokens,
      topP: settingsForm.topP,
      topK: settingsForm.topK,
    }
    await chatbotSettingsService.updateSettings(payload)
    toast.add({ title: 'Settings berhasil disimpan', color: 'success', icon: 'i-lucide-check' })
  }
  catch {
    toast.add({ title: 'Gagal menyimpan settings', color: 'error', icon: 'i-lucide-x' })
  }
  finally {
    settingsSaving.value = false
  }
}

// ── Chat State ───────────────────────────────────────────────
interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  sources?: ChatSource[]
  stats?: {
    conversationId: string
  }
}

const chatMessages = ref<ChatMessage[]>([])
const messageInput = ref('')
const sending = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

const history = computed<PlaygroundHistoryItem[]>(() =>
  chatMessages.value.map(msg => ({
    role: msg.role,
    content: msg.content,
  })),
)

async function sendMessage(): Promise<void> {
  const trimmed = messageInput.value.trim()
  if (!trimmed || sending.value) return

  chatMessages.value.push({ role: 'user', content: trimmed })
  messageInput.value = ''
  sending.value = true

  await nextTick()
  scrollToBottom()

  try {
    const response = await playgroundService.sendMessage({
      message: trimmed,
      history: history.value.slice(0, -1),
    })

    chatMessages.value.push({
      role: 'assistant',
      content: response.data.reply,
      sources: response.data.sources,
      stats: { conversationId: response.data.conversationId },
    })
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'Gagal mengirim pesan ke AI',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
    chatMessages.value.pop()
  }
  finally {
    sending.value = false
    await nextTick()
    scrollToBottom()
  }
}

function clearChat(): void {
  chatMessages.value = []
}

function scrollToBottom(): void {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// ── Lifecycle ────────────────────────────────────────────────
watch(showSettings, (val) => {
  if (val && settingsForm.systemInstruction === '') {
    loadSettings()
  }
})
</script>
