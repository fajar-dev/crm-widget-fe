<!--
  ChatInput Component

  Text input with send button for composing chat messages.
  Includes character counter (max 5000), enter-to-send,
  and disabled/loading state handling.

  @props modelValue - Current input value (v-model)
  @props disabled   - Whether input is disabled
  @props loading    - Whether a message is being sent
  @emits send             - Fired when user submits a message
  @emits update:modelValue - v-model update
-->
<template>
  <div class="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2">
    <!-- Character counter -->
    <div class="flex justify-end mb-1">
      <span
        class="text-xs"
        :class="charCount > 4500
          ? 'text-red-500'
          : 'text-gray-400 dark:text-gray-500'"
      >
        {{ charCount }}/5000
      </span>
    </div>

    <!-- Input row -->
    <div class="flex items-end gap-2">
      <UTextarea
        :model-value="modelValue"
        placeholder="Ketik pesan..."
        :disabled="disabled || loading"
        :rows="1"
        autoresize
        :maxrows="4"
        size="sm"
        class="flex-1"
        @update:model-value="onInput"
        @keydown.enter.exact.prevent="onSend"
      />
      <UButton
        icon="i-lucide-send"
        size="sm"
        :disabled="disabled || loading || !canSend"
        :loading="loading"
        aria-label="Kirim pesan"
        @click="onSend"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * ChatInput — message input with send button and character limit
 *
 * @see ~/composables/useWidget.ts for message sending logic
 */

const props = defineProps<{
  /** Current text value for v-model binding */
  modelValue: string
  /** Disable input when widget is not in active chat state */
  disabled?: boolean
  /** Show loading spinner on send button */
  loading?: boolean
}>()

const emit = defineEmits<{
  /** Emitted when user submits the message */
  (e: 'send'): void
  /** v-model update */
  (e: 'update:modelValue', value: string): void
}>()

/** Current character count */
const charCount = computed(() => props.modelValue.length)

/** Whether the message can be sent */
const canSend = computed(() =>
  props.modelValue.trim().length > 0 && charCount.value <= 5000,
)

/** Handle input updates, enforce max length */
function onInput(value: string | number): void {
  const strValue = String(value)
  if (strValue.length <= 5000) {
    emit('update:modelValue', strValue)
  }
}

/** Handle send action */
function onSend(): void {
  if (canSend.value && !props.disabled && !props.loading) {
    emit('send')
  }
}
</script>
