<!--
  ChatMessage Component

  Renders a single message bubble with role-based styling:
  - user: right-aligned with primary background
  - assistant: left-aligned with gray background, renders markdown
  - system: centered with muted style

  Sources are shown as a collapsible section beneath assistant messages.

  @props role    - Message role ('user' | 'assistant' | 'system')
  @props content - Message text content
  @props sources - Optional array of knowledge base sources
-->
<template>
  <!-- System message -->
  <div v-if="role === 'system'" class="flex justify-center px-4 py-1">
    <p class="text-xs text-gray-500 dark:text-gray-400 italic text-center max-w-xs">
      {{ content }}
    </p>
  </div>

  <!-- User message -->
  <div v-else-if="role === 'user'" class="flex justify-end px-4 py-1">
    <div class="max-w-xs rounded-2xl rounded-tr-sm bg-primary px-4 py-2 text-white">
      <p class="text-sm whitespace-pre-wrap break-words">{{ content }}</p>
    </div>
  </div>

  <!-- Assistant message -->
  <div v-else class="flex justify-start px-4 py-1">
    <div class="max-w-xs">
      <div class="rounded-2xl rounded-tl-sm bg-gray-100 dark:bg-gray-800 px-4 py-2">
        <div
          class="text-sm text-gray-900 dark:text-gray-100 whitespace-pre-wrap break-words prose prose-sm dark:prose-invert max-w-none"
          v-html="renderedContent"
        />
      </div>

      <!-- Sources accordion -->
      <div v-if="sources && sources.length > 0" class="mt-1">
        <UButton
          :icon="showSources ? 'i-lucide-chevron-up' : 'i-lucide-chevron-down'"
          :label="`${sources.length} sumber`"
          variant="ghost"
          color="neutral"
          size="xs"
          @click="showSources = !showSources"
        />
        <div
          v-if="showSources"
          class="mt-1 space-y-1"
        >
          <div
            v-for="source in sources"
            :key="source.id"
            class="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2"
          >
            <p class="text-xs font-medium text-gray-700 dark:text-gray-300">
              {{ source.title }}
            </p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">
              {{ source.content }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * ChatMessage — single message bubble component
 *
 * Supports user, assistant, and system message roles
 * with role-based visual styling and optional source references.
 */

import type { ChatSource } from '~~/shared/types/chat'

const props = defineProps<{
  /** Message role determines alignment and styling */
  role: 'user' | 'assistant' | 'system'
  /** Text content of the message */
  content: string
  /** Optional knowledge base sources (assistant messages only) */
  sources?: ChatSource[]
}>()

const showSources = ref(false)

/**
 * Simple markdown rendering for assistant messages.
 * Converts **bold**, *italic*, `code`, and newlines.
 */
const renderedContent = computed(() => {
  if (props.role !== 'assistant') return props.content

  let html = props.content
    // Escape HTML entities
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // Inline code
    .replace(/`(.*?)`/g, '<code class="px-1 py-0.5 rounded bg-gray-200 dark:bg-gray-700 text-xs">$1</code>')
    // Line breaks
    .replace(/\n/g, '<br>')

  return html
})
</script>
