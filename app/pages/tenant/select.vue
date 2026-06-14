<!--
  Tenant Select Page

  Onboarding page shown when user has no tenant or needs to switch.
  Options: select existing tenant, create new, or join with code.

  @see ~/services/TenantService
  @see ~~/shared/types/tenant
-->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 px-4">
    <div class="w-full max-w-lg">
      <!-- Brand -->
      <div class="text-center mb-8">
        <div class="flex items-center justify-center gap-2 mb-2">
          <UIcon name="i-lucide-bot" class="text-primary text-3xl" />
          <h1 class="text-2xl font-bold text-gray-900 dark:text-white">CRM Widget</h1>
        </div>
        <p class="text-sm text-gray-500 dark:text-gray-400">
          Pilih atau buat workspace untuk memulai
        </p>
      </div>

      <!-- Existing Tenants -->
      <UCard v-if="tenants.length > 0" class="mb-4">
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon name="i-lucide-building" class="text-gray-500" />
            <h2 class="font-semibold text-gray-900 dark:text-white">Workspace Anda</h2>
          </div>
        </template>

        <div class="space-y-2">
          <div
            v-for="tenant in tenants"
            :key="tenant.id"
            class="flex items-center justify-between rounded-lg border border-gray-200 dark:border-gray-700 p-3 cursor-pointer transition-colors hover:bg-gray-50 dark:hover:bg-gray-800"
            @click="selectTenant(tenant)"
          >
            <div>
              <p class="font-medium text-gray-900 dark:text-white">{{ tenant.name }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ tenant.company }}</p>
            </div>
            <UIcon name="i-lucide-chevron-right" class="text-gray-400" />
          </div>
        </div>
      </UCard>

      <!-- Create or Join -->
      <div class="grid grid-cols-2 gap-4 mb-4">
        <UCard
          class="cursor-pointer transition-colors hover:border-primary"
          @click="activeTab = 'create'"
        >
          <div class="text-center py-2">
            <UIcon name="i-lucide-plus-circle" class="text-primary text-2xl mb-2" />
            <p class="text-sm font-medium text-gray-900 dark:text-white">Buat Workspace</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Buat workspace baru</p>
          </div>
        </UCard>

        <UCard
          class="cursor-pointer transition-colors hover:border-primary"
          @click="activeTab = 'join'"
        >
          <div class="text-center py-2">
            <UIcon name="i-lucide-log-in" class="text-primary text-2xl mb-2" />
            <p class="text-sm font-medium text-gray-900 dark:text-white">Gabung</p>
            <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">Gabung dengan kode</p>
          </div>
        </UCard>
      </div>

      <!-- Create Tenant Form -->
      <UCard v-if="activeTab === 'create'">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-gray-900 dark:text-white">Buat Workspace Baru</h3>
            <UButton
              icon="i-lucide-x"
              variant="ghost"
              color="neutral"
              size="xs"
              @click="activeTab = null"
            />
          </div>
        </template>

        <UForm :schema="createTenantSchema" :state="createForm" @submit="handleCreate">
          <div class="space-y-4">
            <UFormField label="Nama Workspace" name="name">
              <UInput
                v-model="createForm.name"
                placeholder="Nama workspace"
                icon="i-lucide-building"
                class="w-full"
                @update:model-value="autoGenerateSlug"
              />
            </UFormField>

            <UFormField label="Perusahaan" name="company">
              <UInput
                v-model="createForm.company"
                placeholder="Nama perusahaan"
                icon="i-lucide-briefcase"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Slug (URL)" name="slug">
              <UInput
                v-model="createForm.slug"
                placeholder="nama-workspace"
                icon="i-lucide-link"
                class="w-full"
              />
            </UFormField>

            <UButton
              type="submit"
              block
              :loading="createLoading"
              icon="i-lucide-plus"
            >
              Buat Workspace
            </UButton>
          </div>
        </UForm>
      </UCard>

      <!-- Join Tenant Form -->
      <UCard v-if="activeTab === 'join'">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="font-semibold text-gray-900 dark:text-white">Gabung dengan Kode</h3>
            <UButton
              icon="i-lucide-x"
              variant="ghost"
              color="neutral"
              size="xs"
              @click="activeTab = null"
            />
          </div>
        </template>

        <UForm :schema="joinTenantSchema" :state="joinForm" @submit="handleJoin">
          <div class="space-y-4">
            <UFormField label="Kode Undangan" name="code">
              <UInput
                v-model="joinForm.code"
                placeholder="Masukkan kode undangan"
                icon="i-lucide-key"
                class="w-full"
              />
            </UFormField>

            <UButton
              type="submit"
              block
              :loading="joinLoading"
              icon="i-lucide-log-in"
            >
              Gabung
            </UButton>
          </div>
        </UForm>
      </UCard>

      <!-- Logout -->
      <div class="text-center mt-6">
        <UButton
          variant="link"
          color="neutral"
          size="sm"
          icon="i-lucide-log-out"
          @click="authStore.logout()"
        >
          Logout
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Tenant Select Page
 *
 * Shown after login when user has no active tenant.
 * Allows creating a new tenant, joining by code, or selecting existing.
 */
import { tenantService } from '~/services/TenantService'
import { createTenantSchema, joinTenantSchema } from '~~/shared/types/tenant'
import type { TenantResponse } from '~~/shared/types/tenant'

definePageMeta({ layout: 'default' })
useSeoMeta({ title: 'Pilih Workspace — CRM Widget' })

const authStore = useAuthStore()
const tenantStore = useTenantStore()
const toast = useToast()

const tenants = ref<TenantResponse[]>([])
const activeTab = ref<'create' | 'join' | null>(null)
const createLoading = ref(false)
const joinLoading = ref(false)

const createForm = reactive({
  name: '',
  company: '',
  slug: '',
})

const joinForm = reactive({
  code: '',
})

/** Auto-generate slug from name */
function autoGenerateSlug(): void {
  createForm.slug = createForm.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

/** Select existing tenant */
async function selectTenant(tenant: TenantResponse): Promise<void> {
  tenantStore.setCurrentTenant(tenant)
  toast.add({
    title: 'Workspace dipilih',
    description: tenant.name,
    icon: 'i-lucide-check-circle',
    color: 'success',
  })
  navigateTo('/chatbot/widget')
}

/** Create new tenant */
async function handleCreate(): Promise<void> {
  createLoading.value = true
  try {
    const response = await tenantService.createTenant(createForm)
    tenantStore.setCurrentTenant(response.data)
    toast.add({
      title: 'Workspace dibuat',
      description: response.data.name,
      icon: 'i-lucide-check-circle',
      color: 'success',
    })
    navigateTo('/chatbot/widget')
  }
  catch {
    toast.add({
      title: 'Gagal membuat workspace',
      description: 'Periksa data dan coba lagi',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    createLoading.value = false
  }
}

/** Join tenant with code */
async function handleJoin(): Promise<void> {
  joinLoading.value = true
  try {
    const response = await tenantService.joinTenant(joinForm)
    tenantStore.setCurrentTenant(response.data)
    toast.add({
      title: 'Berhasil bergabung',
      description: response.data.name,
      icon: 'i-lucide-check-circle',
      color: 'success',
    })
    navigateTo('/chatbot/widget')
  }
  catch {
    toast.add({
      title: 'Gagal bergabung',
      description: 'Kode tidak valid atau sudah kedaluwarsa',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    joinLoading.value = false
  }
}

/** Fetch user's tenants on mount */
onMounted(async () => {
  try {
    const response = await tenantService.listTenants()
    tenants.value = response.data as TenantResponse[]
  }
  catch {
    // User may not have any tenants yet — that's OK
  }
})
</script>
