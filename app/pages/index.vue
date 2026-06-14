<!--
  Index Page

  Landing page / entry point of the application.
  Will be replaced with proper routing to dashboard or widget.

  @see https://nuxt.com/docs/guide/directory-structure/pages
-->
<template>
  <div class="flex min-h-screen items-center justify-center">
    <UCard class="w-full max-w-lg">
      <template #header>
        <div class="flex items-center gap-3">
          <UIcon
            name="i-lucide-message-circle"
            class="size-8 text-primary"
          />
          <div>
            <h1 class="text-2xl font-bold">
              CRM Widget
            </h1>
            <p class="text-sm text-muted">
              Chatbot Management System
            </p>
          </div>
        </div>
      </template>

      <div class="space-y-4">
        <p class="text-sm text-muted">
          Project berhasil di-setup. Pilih halaman untuk memulai:
        </p>

        <div class="flex flex-col gap-2">
          <UButton
            icon="i-lucide-layout-dashboard"
            label="Admin Dashboard"
            to="/dashboard"
            variant="solid"
            block
          />
          <UButton
            icon="i-lucide-message-square"
            label="Chat Widget Preview"
            to="/widget"
            variant="outline"
            block
          />
        </div>
      </div>

      <template #footer>
        <div class="flex items-center justify-between text-xs text-muted">
          <span>v0.1.0</span>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-check-circle"
              class="size-4 text-success"
            />
            <span>Setup Complete</span>
          </div>
        </div>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
/**
 * Index page — entry point of the CRM Widget Frontend
 *
 * Provides navigation to:
 * - Admin Dashboard (/dashboard)
 * - Chat Widget Preview (/widget)
 */
definePageMeta({
  layout: 'default',
})

useSeoMeta({
  title: 'CRM Widget — Chatbot Management System',
  description: 'CRM Chatbot Management System — Admin Dashboard & Embeddable Chat Widget',
})
</script>
