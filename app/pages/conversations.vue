<!--
  Conversations Page

  Split-panel layout showing conversation list and message thread.
  Left panel: paginated conversation list. Right panel: message detail.

  @see ~/services/ConversationService
  @see ~~/shared/types/conversation
-->
<template>
  <div class="space-y-4">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
        Conversations
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Lihat riwayat percakapan chatbot dengan pengunjung.
      </p>
    </div>

    <!-- Split Layout -->
    <div class="flex gap-4 overflow-hidden" style="height: calc(100vh - 14rem);">
      <!-- Left: Conversation List -->
      <div class="flex w-2/5 flex-col">
        <UCard class="flex flex-1 flex-col overflow-hidden">
          <!-- List Loading -->
          <div v-if="listLoading" class="space-y-3 p-1">
            <USkeleton v-for="i in 5" :key="i" class="h-16 w-full" />
          </div>

          <!-- Empty State -->
          <div
            v-else-if="conversations.length === 0"
            class="flex flex-1 items-center justify-center py-12"
          >
            <div class="text-center">
              <UIcon name="i-lucide-message-square" class="size-10 text-gray-300 dark:text-gray-600" />
              <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Belum ada conversations.
              </p>
            </div>
          </div>

          <!-- Conversation Items -->
          <div v-else class="flex-1 overflow-y-auto">
            <div
              v-for="conv in conversations"
              :key="conv.id"
              class="cursor-pointer border-b border-gray-100 px-4 py-3 transition-colors last:border-0 dark:border-gray-800"
              :class="selectedId === conv.id
                ? 'bg-primary-50 dark:bg-primary-950'
                : 'hover:bg-gray-50 dark:hover:bg-gray-800/50'"
              @click="selectConversation(conv)"
            >
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-900 dark:text-white truncate">
                  {{ conv.sessionId.slice(0, 12) }}...
                </span>
                <UBadge
                  :color="conv.status === 'active' ? 'success' : 'neutral'"
                  variant="subtle"
                  size="xs"
                >
                  {{ conv.status }}
                </UBadge>
              </div>
              <div class="mt-1 flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                <span class="flex items-center gap-1">
                  <UIcon name="i-lucide-message-circle" class="size-3" />
                  {{ conv.totalMessages }}
                </span>
                <span>{{ formatDate(conv.startedAt) }}</span>
              </div>
            </div>
          </div>

          <!-- Pagination -->
          <template v-if="meta && meta.lastPage > 1" #footer>
            <div class="flex justify-center">
              <UPagination
                v-model="currentPage"
                :total="meta.total"
                :items-per-page="meta.perPage"
                size="sm"
              />
            </div>
          </template>
        </UCard>
      </div>

      <!-- Right: Conversation Detail -->
      <div class="flex w-3/5 flex-col">
        <UCard class="flex flex-1 flex-col overflow-hidden">
          <!-- Empty State -->
          <div
            v-if="!selectedConversation"
            class="flex flex-1 items-center justify-center"
          >
            <div class="text-center">
              <UIcon name="i-lucide-message-square-dashed" class="size-12 text-gray-300 dark:text-gray-600" />
              <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
                Pilih conversation untuk melihat detail.
              </p>
            </div>
          </div>

          <!-- Detail View -->
          <div v-else class="flex flex-1 flex-col overflow-hidden">
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-3 mb-3">
              <div>
                <div class="flex items-center gap-2">
                  <span class="font-medium text-gray-900 dark:text-white">
                    Session {{ selectedConversation.sessionId.slice(0, 12) }}...
                  </span>
                  <UBadge
                    :color="selectedConversation.status === 'active' ? 'success' : 'neutral'"
                    variant="subtle"
                    size="xs"
                  >
                    {{ selectedConversation.status }}
                  </UBadge>
                </div>
                <p class="mt-0.5 text-xs text-gray-500 dark:text-gray-400">
                  {{ formatDate(selectedConversation.startedAt) }}
                  <span v-if="selectedConversation.endedAt">
                    — {{ formatDate(selectedConversation.endedAt) }}
                  </span>
                </p>
              </div>
              <UButton
                icon="i-lucide-trash-2"
                variant="ghost"
                color="error"
                size="xs"
                @click="confirmDelete"
              />
            </div>

            <!-- Messages -->
            <div ref="messagesContainer" class="flex-1 overflow-y-auto space-y-4 p-1">
              <div v-if="messagesLoading" class="space-y-3">
                <USkeleton v-for="i in 3" :key="i" class="h-16 w-3/4" />
              </div>

              <template v-else>
                <div
                  v-for="msg in messages"
                  :key="msg.id"
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

                    <!-- Message Stats -->
                    <div
                      v-if="msg.latencyMs || msg.modelName"
                      class="mt-1.5 flex items-center gap-2 text-xs"
                      :class="msg.role === 'user'
                        ? 'text-white/70'
                        : 'text-gray-400 dark:text-gray-500'"
                    >
                      <span v-if="msg.latencyMs">{{ msg.latencyMs }}ms</span>
                      <span v-if="msg.modelName">{{ msg.modelName }}</span>
                      <span v-if="msg.totalTokens">{{ msg.totalTokens }} tokens</span>
                    </div>
                  </div>
                </div>
              </template>
            </div>

            <!-- Token Stats -->
            <div class="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800 pt-3 mt-3">
              <span>Total: {{ selectedConversation.totalTokens }} tokens</span>
              <span>Prompt: {{ selectedConversation.promptTokens }}</span>
              <span>Completion: {{ selectedConversation.completionTokens }}</span>
            </div>
          </div>
        </UCard>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="deleteModalOpen">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Hapus Conversation
            </h3>
          </template>

          <p class="text-sm text-gray-600 dark:text-gray-400">
            Yakin ingin menghapus conversation ini beserta semua pesan di dalamnya?
            Tindakan ini tidak dapat dibatalkan.
          </p>

          <template #footer>
            <div class="flex justify-end gap-2">
              <UButton
                label="Batal"
                variant="outline"
                color="neutral"
                @click="deleteModalOpen = false"
              />
              <UButton
                label="Hapus"
                color="error"
                :loading="deleteLoading"
                @click="handleDelete"
              />
            </div>
          </template>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
/**
 * Conversations Page
 *
 * Split-panel layout: list (left 40%) and detail (right 60%).
 * Supports pagination, message viewing, and deletion.
 */
import { conversationService } from '~/services/ConversationService'
import type { ConversationResponse, MessageResponse } from '~~/shared/types/conversation'
import type { PaginationMeta } from '~~/shared/types/api'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Conversations — CRM Widget' })

const toast = useToast()

// ── List State ───────────────────────────────────────────────
const conversations = ref<ConversationResponse[]>([])
const meta = ref<PaginationMeta | null>(null)
const currentPage = ref(1)
const listLoading = ref(true)

// ── Detail State ─────────────────────────────────────────────
const selectedId = ref<string | null>(null)
const selectedConversation = ref<ConversationResponse | null>(null)
const messages = ref<MessageResponse[]>([])
const messagesLoading = ref(false)
const messagesContainer = ref<HTMLElement | null>(null)

// ── Delete State ─────────────────────────────────────────────
const deleteModalOpen = ref(false)
const deleteLoading = ref(false)

// ── Fetch Conversations ──────────────────────────────────────
async function fetchConversations(): Promise<void> {
  listLoading.value = true
  try {
    const response = await conversationService.list({
      page: currentPage.value,
      perPage: 20,
      sortBy: 'startedAt',
      sortOrder: 'DESC',
    })
    conversations.value = response.data
    meta.value = response.meta
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'Gagal memuat conversations',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    listLoading.value = false
  }
}

// ── Select Conversation ──────────────────────────────────────
async function selectConversation(conv: ConversationResponse): Promise<void> {
  selectedId.value = conv.id
  selectedConversation.value = conv
  messagesLoading.value = true

  try {
    const response = await conversationService.getMessages(conv.id, {
      perPage: 100,
      sortBy: 'id',
      sortOrder: 'ASC',
    })
    messages.value = response.data

    await nextTick()
    scrollToBottom()
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'Gagal memuat pesan',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    messagesLoading.value = false
  }
}

// ── Delete ───────────────────────────────────────────────────
function confirmDelete(): void {
  deleteModalOpen.value = true
}

async function handleDelete(): Promise<void> {
  if (!selectedConversation.value) return
  deleteLoading.value = true

  try {
    await conversationService.remove(selectedConversation.value.id)
    toast.add({
      title: 'Berhasil',
      description: 'Conversation berhasil dihapus',
      icon: 'i-lucide-check-circle',
      color: 'success',
    })
    deleteModalOpen.value = false
    selectedConversation.value = null
    selectedId.value = null
    messages.value = []
    await fetchConversations()
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'Gagal menghapus conversation',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    deleteLoading.value = false
  }
}

// ── Helpers ──────────────────────────────────────────────────
function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function scrollToBottom(): void {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

// ── Watchers ─────────────────────────────────────────────────
watch(currentPage, () => {
  fetchConversations()
})

// ── Init ─────────────────────────────────────────────────────
onMounted(() => {
  fetchConversations()
})
</script>
