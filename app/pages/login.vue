<!--
  Login Page

  Authenticates users via email/password. Uses Zod schema validation,
  Pinia auth store, and toast notifications for feedback.

  @see shared/types/auth.ts — loginSchema
-->
<template>
  <div>
    <UCard>
      <template #header>
        <div class="text-center">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Login</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Masuk ke dashboard</p>
        </div>
      </template>

      <UForm :schema="loginSchema" :state="form" @submit="onSubmit">
        <div class="space-y-4">
          <UFormField label="Email" name="email">
            <UInput v-model="form.email" type="email" placeholder="email@example.com" icon="i-lucide-mail" class="w-full" />
          </UFormField>
          <UFormField label="Password" name="password">
            <UInput v-model="form.password" type="password" placeholder="Minimal 8 karakter" icon="i-lucide-lock" class="w-full" />
          </UFormField>
          <UButton type="submit" block :loading="authStore.isLoading" icon="i-lucide-log-in">
            Login
          </UButton>
        </div>
      </UForm>

      <template #footer>
        <p class="text-center text-sm text-gray-500">
          Belum punya akun? <NuxtLink to="/register" class="text-primary font-medium">Register</NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
/**
 * Login Page Script
 *
 * Handles form state, submission, and navigation on success.
 */
import { loginSchema } from '~~/shared/types/auth'

definePageMeta({ layout: 'auth' })
useSeoMeta({ title: 'Login — CRM Widget' })

const authStore = useAuthStore()
const toast = useToast()

const form = reactive({
  email: '',
  password: '',
})

async function onSubmit() {
  const result = await authStore.login(form)
  if (result === 'has_tenant') {
    toast.add({ title: 'Login berhasil', color: 'success', icon: 'i-lucide-check' })
    navigateTo('/chatbot/widget')
  } else if (result === 'no_tenant') {
    toast.add({ title: 'Login berhasil', description: 'Pilih atau buat workspace terlebih dahulu', color: 'success', icon: 'i-lucide-check' })
    navigateTo('/tenant/select')
  } else {
    toast.add({ title: 'Login gagal', description: 'Email atau password salah', color: 'error', icon: 'i-lucide-x' })
  }
}
</script>
