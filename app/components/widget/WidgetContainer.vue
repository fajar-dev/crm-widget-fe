<!--
  WidgetContainer Component

  Main embeddable chat widget container that orchestrates all widget sub-components.
  Uses the useWidget composable to manage state transitions:

  - CLOSED: Only floating action button visible
  - LOADING_CONFIG: Loading spinner overlay
  - SHOW_FORM: Pre-chat form rendered from config
  - CREATING_SESSION: Loading state during session creation
  - CHAT_ACTIVE: Message list with input
  - CHAT_ENDED: End-of-conversation actions
  - SESSION_EXPIRED: Expired session overlay with restart option
  - SHOW_DISABLED: Widget disabled/offline state

  @props tenantSlug - Required tenant slug identifier
-->
<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-3">
    <!-- Chat Panel -->
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-4 scale-95"
      enter-to-class="opacity-100 translate-y-0 scale-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100 translate-y-0 scale-100"
      leave-to-class="opacity-0 translate-y-4 scale-95"
    >
      <div
        v-if="isOpen"
        class="w-80 sm:w-96 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-xl overflow-hidden flex flex-col"
        style="max-height: min(600px, calc(100vh - 120px));"
      >
        <!-- Header -->
        <WidgetChatHeader
          v-if="config"
          :tenant-name="config.tenant.name"
          :icon-path="config.tenant.logoPath"
          :on-close="closeWidget"
        />
        <div
          v-else
          class="flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700"
        >
          <span class="text-sm font-semibold text-gray-900 dark:text-white">Chat</span>
          <UButton
            icon="i-lucide-x"
            variant="ghost"
            color="neutral"
            size="sm"
            @click="closeWidget"
          />
        </div>

        <!-- Body -->
        <div class="flex-1 overflow-hidden flex flex-col">
          <!-- LOADING_CONFIG state -->
          <div
            v-if="state === 'LOADING_CONFIG' || state === 'CREATING_SESSION'"
            class="flex-1 flex items-center justify-center p-8"
          >
            <div class="text-center space-y-3">
              <UIcon name="i-lucide-loader" class="size-8 text-primary animate-spin mx-auto" />
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ state === 'LOADING_CONFIG' ? 'Memuat...' : 'Membuat sesi...' }}
              </p>
            </div>
          </div>

          <!-- SHOW_FORM state -->
          <WidgetPreChatForm
            v-else-if="state === 'SHOW_FORM'"
            :form-fields="config?.formFields ?? []"
            :welcome-message="config?.widget.welcomeMessage"
            @submit="submitForm"
          />

          <!-- CHAT_ACTIVE state -->
          <template v-else-if="state === 'CHAT_ACTIVE'">
            <!-- Messages list -->
            <div
              ref="messagesContainer"
              class="flex-1 overflow-y-auto py-3 space-y-1"
            >
              <WidgetChatMessage
                v-for="(msg, index) in messages"
                :key="index"
                :role="msg.role"
                :content="msg.content"
                :sources="msg.sources"
              />
              <WidgetTypingIndicator v-if="isTyping" />
            </div>

            <!-- End conversation button -->
            <div class="px-3 pb-1">
              <UButton
                label="Akhiri Percakapan"
                icon="i-lucide-phone-off"
                variant="ghost"
                color="neutral"
                size="xs"
                block
                @click="endConversation"
              />
            </div>

            <!-- Chat input -->
            <WidgetChatInput
              v-model="inputMessage"
              :disabled="!canSend"
              :loading="isSending"
              @send="handleSend"
            />
          </template>

          <!-- CHAT_ENDED state -->
          <div
            v-else-if="state === 'CHAT_ENDED'"
            class="flex-1 flex items-center justify-center p-8"
          >
            <div class="text-center space-y-4">
              <UIcon name="i-lucide-check-circle" class="size-12 text-green-500 mx-auto" />
              <div class="space-y-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  Percakapan selesai
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Terima kasih telah menghubungi kami
                </p>
              </div>
              <div class="flex flex-col gap-2">
                <UButton
                  label="Mulai Chat Baru"
                  icon="i-lucide-message-circle"
                  size="sm"
                  block
                  @click="startNewChat"
                />
                <UButton
                  label="Tutup"
                  variant="outline"
                  color="neutral"
                  size="sm"
                  block
                  @click="closeWidget"
                />
              </div>
            </div>
          </div>

          <!-- SESSION_EXPIRED state -->
          <div
            v-else-if="state === 'SESSION_EXPIRED'"
            class="flex-1 flex items-center justify-center p-8"
          >
            <div class="text-center space-y-4">
              <UIcon name="i-lucide-clock" class="size-12 text-amber-500 mx-auto" />
              <div class="space-y-1">
                <p class="text-sm font-medium text-gray-900 dark:text-white">
                  Sesi telah berakhir
                </p>
                <p class="text-xs text-gray-500 dark:text-gray-400">
                  Sesi Anda telah kedaluwarsa. Silakan mulai chat baru.
                </p>
              </div>
              <UButton
                label="Mulai Ulang"
                icon="i-lucide-refresh-cw"
                size="sm"
                block
                @click="startNewChat"
              />
            </div>
          </div>

          <!-- SHOW_DISABLED state -->
          <div
            v-else-if="state === 'SHOW_DISABLED'"
            class="flex-1 flex items-center justify-center p-8"
          >
            <div class="text-center space-y-3">
              <UIcon name="i-lucide-wifi-off" class="size-10 text-gray-400 mx-auto" />
              <p class="text-sm text-gray-500 dark:text-gray-400">
                Widget sedang tidak aktif
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Floating Action Button -->
    <UButton
      :icon="isOpen ? 'i-lucide-x' : 'i-lucide-message-circle'"
      size="xl"
      class="rounded-full shadow-lg size-14"
      aria-label="Toggle chat widget"
      @click="toggleWidget"
    />
  </div>
</template>

<script setup lang="ts">
/**
 * WidgetContainer — main chat widget orchestrator
 *
 * Manages all widget states and delegates rendering to
 * sub-components. Uses useWidget composable for state management.
 *
 * @see ~/composables/useWidget.ts
 */

const props = defineProps<{
  /** Tenant slug for widget configuration and API calls */
  tenantSlug: string
}>()

const {
  state,
  config,
  messages,
  isTyping,
  isSending,
  isOpen,
  canSend,
  openWidget,
  closeWidget,
  submitForm,
  sendMessage,
  endConversation,
  startNewChat,
} = useWidget(props.tenantSlug)

/** Current input message text */
const inputMessage = ref('')

/** Reference to messages container for auto-scroll */
const messagesContainer = ref<HTMLElement | null>(null)

/** Toggle widget open/close */
function toggleWidget(): void {
  if (isOpen.value) {
    closeWidget()
  }
  else {
    openWidget()
  }
}

/** Handle sending a message */
async function handleSend(): Promise<void> {
  const message = inputMessage.value.trim()
  if (!message) return

  inputMessage.value = ''
  await sendMessage(message)
}

/** Auto-scroll to bottom when new messages arrive */
watch(
  () => messages.value.length,
  async () => {
    await nextTick()
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  },
)

/** Also scroll when typing indicator appears */
watch(isTyping, async (typing) => {
  if (typing) {
    await nextTick()
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  }
})
</script>
