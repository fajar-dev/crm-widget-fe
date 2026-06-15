<!--
  Playground Page

  Two-column layout: chatbot settings (left) + chat interface (right).

  @see ~/services/PlaygroundService
  @see ~/services/ChatbotSettingsService
-->
<template>
  <div class="space-y-4">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">Playground</h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Konfigurasi model AI dan test chatbot.</p>
      </div>
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

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-5 gap-6" style="height: calc(100vh - 12rem);">
      <!-- Left: Settings (2/5) -->
      <div class="lg:col-span-2 flex flex-col min-h-0">
        <UCard class="flex flex-1 flex-col overflow-hidden">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon name="i-lucide-cpu" class="size-5 text-gray-500" />
              <h2 class="text-base font-medium text-gray-900 dark:text-white">Chatbot Settings</h2>
            </div>
          </template>

          <!-- Loading -->
          <div v-if="settingsLoading" class="flex items-center justify-center py-8">
            <UIcon name="i-lucide-loader-2" class="size-6 text-gray-400 animate-spin" />
          </div>

          <div v-else class="flex-1 overflow-y-auto space-y-4">
            <UFormField label="System Instruction" name="systemInstruction">
              <UTextarea
                v-model="settingsForm.systemInstruction"
                placeholder="Instruksi sistem untuk chatbot..."
                :rows="5"
                class="w-full font-mono"
              />
            </UFormField>

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

            <div class="grid grid-cols-2 gap-3">
              <UFormField label="Temperature" name="temperature">
                <UInput
                  v-model.number="settingsForm.temperature"
                  type="number"
                  :step="0.1"
                  :min="0"
                  :max="2"
                  placeholder="0.7"
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
                label="Simpan"
                size="sm"
                :loading="settingsSaving"
                @click="saveSettings"
              />
            </div>
          </template>
        </UCard>
      </div>

      <!-- Right: Chat (3/5) -->
      <div class="lg:col-span-3 flex flex-col min-h-0">
        <UCard class="flex flex-1 flex-col overflow-hidden">
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
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Playground Page
 *
 * Two-column: chatbot settings (left) + chat (right).
 */
import { playgroundService } from '~/services/PlaygroundService'
import { chatbotSettingsService } from '~/services/ChatbotSettingsService'
import type { PlaygroundHistoryItem } from '~~/shared/types/playground'
import type { ChatSource } from '~~/shared/types/chat'
import type { UpdateChatbotSettingsRequest } from '~~/shared/types/chatbot-settings'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Playground — CRM Widget' })

const toast = useToast()

// ── Settings ─────────────────────────────────────────────────
const settingsLoading = ref(true)
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
    const payload: UpdateChatbotSettingsRequest = { ...settingsForm }
    await chatbotSettingsService.updateSettings(payload)
    toast.add({ title: 'Settings disimpan', color: 'success', icon: 'i-lucide-check' })
  }
  catch {
    toast.add({ title: 'Gagal menyimpan', color: 'error', icon: 'i-lucide-x' })
  }
  finally {
    settingsSaving.value = false
  }
}

// ── Chat ─────────────────────────────────────────────────────
interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  sources?: ChatSource[]
}

const chatMessages = ref<ChatMessage[]>([])
const messageInput = ref('')
const sending = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

const history = computed<PlaygroundHistoryItem[]>(() =>
  chatMessages.value.map(msg => ({ role: msg.role, content: msg.content })),
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
    })
  }
  catch {
    toast.add({ title: 'Gagal mengirim pesan', color: 'error', icon: 'i-lucide-alert-circle' })
    chatMessages.value.pop()
  }
  finally {
    sending.value = false
    await nextTick()
    scrollToBottom()
  }
}

function clearChat(): void { chatMessages.value = [] }
function scrollToBottom(): void {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

onMounted(() => { loadSettings() })
</script>
