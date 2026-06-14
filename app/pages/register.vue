<!--
  Register Page

  Creates a new user account. Uses Zod schema validation with
  password confirmation, Pinia auth store, and toast notifications.

  @see shared/types/auth.ts — registerSchema
-->
<template>
  <div>
    <UCard>
      <template #header>
        <div class="text-center">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Register</h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">Buat akun baru</p>
        </div>
      </template>

      <UForm :schema="registerSchema" :state="form" @submit="onSubmit">
        <div class="space-y-4">
          <div class="grid grid-cols-2 gap-4">
            <UFormField label="First Name" name="firstName">
              <UInput v-model="form.firstName" placeholder="John" icon="i-lucide-user" class="w-full" />
            </UFormField>
            <UFormField label="Last Name" name="lastName">
              <UInput v-model="form.lastName" placeholder="Doe" icon="i-lucide-user" class="w-full" />
            </UFormField>
          </div>
          <UFormField label="Email" name="email">
            <UInput v-model="form.email" type="email" placeholder="email@example.com" icon="i-lucide-mail" class="w-full" />
          </UFormField>
          <UFormField label="Password" name="password">
            <UInput v-model="form.password" type="password" placeholder="Minimal 8 karakter" icon="i-lucide-lock" class="w-full" />
          </UFormField>
          <UFormField label="Konfirmasi Password" name="confirmPassword">
            <UInput v-model="form.confirmPassword" type="password" placeholder="Ulangi password" icon="i-lucide-lock" class="w-full" />
          </UFormField>
          <UButton type="submit" block :loading="authStore.isLoading" icon="i-lucide-user-plus">
            Register
          </UButton>
        </div>
      </UForm>

      <template #footer>
        <p class="text-center text-sm text-gray-500">
          Sudah punya akun? <NuxtLink to="/login" class="text-primary font-medium">Login</NuxtLink>
        </p>
      </template>
    </UCard>
  </div>
</template>

<script setup lang="ts">
/**
 * Register Page Script
 *
 * Handles registration form with password confirmation.
 * On success, redirects to login page.
 */
import { registerSchema } from '~~/shared/types/auth'

definePageMeta({ layout: 'auth' })
useSeoMeta({ title: 'Register — CRM Widget' })

const authStore = useAuthStore()
const toast = useToast()

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
})

async function onSubmit() {
  const { confirmPassword: _, ...payload } = form
  const success = await authStore.register(payload)
  if (success) {
    toast.add({ title: 'Registrasi berhasil', description: 'Silakan login dengan akun Anda', color: 'success', icon: 'i-lucide-check' })
    navigateTo('/login')
  } else {
    toast.add({ title: 'Registrasi gagal', description: 'Terjadi kesalahan, coba lagi', color: 'error', icon: 'i-lucide-x' })
  }
}
</script>
