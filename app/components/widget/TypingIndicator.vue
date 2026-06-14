<!--
  TypingIndicator Component

  Animated dots indicating the bot is typing a response.
  Displays three dots with staggered bounce animation inside
  an assistant-style message bubble.
-->
<template>
  <div class="flex items-start gap-2 px-4 py-1">
    <div class="rounded-2xl rounded-tl-sm bg-gray-100 dark:bg-gray-800 px-4 py-3">
      <div class="flex items-center gap-1">
        <span
          v-for="dot in 3"
          :key="dot"
          class="inline-block size-2 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"
          :style="{ animationDelay: `${(dot - 1) * 150}ms`, animationDuration: '0.8s' }"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * TypingIndicator — animated dots for bot typing state
 *
 * No props needed. Renders three bouncing dots with
 * staggered animation delays.
 */
</script>
