<!--
  Playground Page

  Interactive chat interface for testing chatbot AI responses.
  Maintains client-side history and supports clear/reset.

  @see ~/services/PlaygroundService
  @see ~~/shared/types/playground
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
          Test chatbot AI tanpa membuat session baru.
        </p>
      </div>
      <UButton
        icon="i-lucide-trash-2"
        label="Clear Chat"
        variant="outline"
        color="neutral"
        :disabled="chatMessages.length === 0"
        @click="clearChat"
      />
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
 * Interactive chat interface for testing chatbot AI.
 * Maintains client-side history array for multi-turn conversations.
 */
import { playgroundService } from '~/services/PlaygroundService'
import type { PlaygroundHistoryItem } from '~~/shared/types/playground'
import type { ChatSource } from '~~/shared/types/chat'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Playground — CRM Widget' })

const toast = useToast()

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

// ── History for API calls ────────────────────────────────────
const history = computed<PlaygroundHistoryItem[]>(() =>
  chatMessages.value.map(msg => ({
    role: msg.role,
    content: msg.content,
  })),
)

// ── Send Message ─────────────────────────────────────────────
async function sendMessage(): Promise<void> {
  const trimmed = messageInput.value.trim()
  if (!trimmed || sending.value) return

  // Add user message
  chatMessages.value.push({
    role: 'user',
    content: trimmed,
  })
  messageInput.value = ''
  sending.value = true

  await nextTick()
  scrollToBottom()

  try {
    const response = await playgroundService.sendMessage({
      message: trimmed,
      history: history.value.slice(0, -1), // exclude the just-added user msg
    })

    chatMessages.value.push({
      role: 'assistant',
      content: response.data.reply,
      sources: response.data.sources,
      stats: {
        conversationId: response.data.conversationId,
      },
    })
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'Gagal mengirim pesan ke AI',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
    // Remove the user message on failure
    chatMessages.value.pop()
  }
  finally {
    sending.value = false
    await nextTick()
    scrollToBottom()
  }
}

// ── Clear Chat ───────────────────────────────────────────────
function clearChat(): void {
  chatMessages.value = []
}

// ── Helpers ──────────────────────────────────────────────────
function scrollToBottom(): void {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}
</script>
