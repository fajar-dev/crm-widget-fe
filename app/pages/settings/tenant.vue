<!--
  Tenant Settings Page

  Admin page for managing tenant configuration and members.
  Displays current tenant info, edit modal, invite-code regeneration,
  and member management table.

  Layout: dashboard
  Route: /settings/tenant
-->
<template>
  <div class="space-y-6">
    <!-- Page header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-xl font-semibold text-gray-900 dark:text-white">
          Pengaturan Tenant
        </h1>
        <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">
          Kelola informasi tenant dan anggota tim
        </p>
      </div>
    </div>

    <!-- Tenant Info Card -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">
            Informasi Tenant
          </h2>
          <UButton
            label="Edit"
            icon="i-lucide-pencil"
            variant="outline"
            size="sm"
            @click="editModalOpen = true"
          />
        </div>
      </template>

      <div v-if="tenant" class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div class="space-y-1">
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Nama
          </p>
          <p class="text-sm text-gray-900 dark:text-white">
            {{ tenant.name }}
          </p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Perusahaan
          </p>
          <p class="text-sm text-gray-900 dark:text-white">
            {{ tenant.company }}
          </p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Slug
          </p>
          <p class="text-sm text-gray-900 dark:text-white font-mono">
            {{ tenant.slug }}
          </p>
        </div>
        <div class="space-y-1">
          <p class="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">
            Kode Undangan
          </p>
          <div class="flex items-center gap-2">
            <p class="text-sm text-gray-900 dark:text-white font-mono">
              {{ tenant.code }}
            </p>
            <UButton
              icon="i-lucide-refresh-cw"
              variant="ghost"
              color="neutral"
              size="xs"
              :loading="regenerateLoading"
              aria-label="Regenerasi kode"
              @click="handleRegenerateCode"
            />
          </div>
        </div>
      </div>

      <!-- Loading skeleton -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div v-for="i in 4" :key="i" class="space-y-2">
          <div class="h-3 w-20 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          <div class="h-4 w-32 bg-gray-100 dark:bg-gray-800 rounded animate-pulse" />
        </div>
      </div>
    </UCard>

    <!-- Members Section -->
    <UCard>
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-base font-semibold text-gray-900 dark:text-white">
            Anggota Tim
          </h2>
          <UButton
            label="Undang Anggota"
            icon="i-lucide-user-plus"
            size="sm"
            @click="inviteModalOpen = true"
          />
        </div>
      </template>

      <UTable
        :data="members"
        :columns="memberColumns"
        :loading="membersLoading"
      >
        <template #user-cell="{ row }">
          <div class="flex items-center gap-2">
            <UAvatar :text="getUserInitials(row.user)" size="xs" />
            <div>
              <p class="text-sm font-medium text-gray-900 dark:text-white">
                {{ row.user.firstName }} {{ row.user.lastName }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400">
                {{ row.user.email }}
              </p>
            </div>
          </div>
        </template>

        <template #role-cell="{ row }">
          <UBadge
            :label="formatRole(row.role)"
            :color="getRoleBadgeColor(row.role)"
            variant="subtle"
            size="sm"
          />
        </template>

        <template #actions-cell="{ row }">
          <div class="flex items-center gap-1">
            <UDropdownMenu :items="getMemberActions(row)">
              <UButton
                icon="i-lucide-ellipsis"
                variant="ghost"
                color="neutral"
                size="xs"
              />
            </UDropdownMenu>
          </div>
        </template>
      </UTable>
    </UCard>

    <!-- Edit Tenant Modal -->
    <UModal v-model:open="editModalOpen">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">
                Edit Tenant
              </h3>
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="editModalOpen = false"
              />
            </div>
          </template>

          <form class="space-y-4" @submit.prevent="handleUpdateTenant">
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Nama</label>
              <UInput
                v-model="editForm.name"
                placeholder="Nama tenant"
              />
              <p v-if="editErrors.name" class="text-xs text-red-500">{{ editErrors.name }}</p>
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Perusahaan</label>
              <UInput
                v-model="editForm.company"
                placeholder="Nama perusahaan"
              />
              <p v-if="editErrors.company" class="text-xs text-red-500">{{ editErrors.company }}</p>
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Slug</label>
              <UInput
                v-model="editForm.slug"
                placeholder="tenant-slug"
              />
              <p v-if="editErrors.slug" class="text-xs text-red-500">{{ editErrors.slug }}</p>
            </div>

            <div class="flex justify-end gap-2 pt-2">
              <UButton
                label="Batal"
                variant="outline"
                color="neutral"
                @click="editModalOpen = false"
              />
              <UButton
                type="submit"
                label="Simpan"
                :loading="updateLoading"
              />
            </div>
          </form>
        </UCard>
      </template>
    </UModal>

    <!-- Invite Member Modal -->
    <UModal v-model:open="inviteModalOpen">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">
                Undang Anggota
              </h3>
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="inviteModalOpen = false"
              />
            </div>
          </template>

          <form class="space-y-4" @submit.prevent="handleInviteMember">
            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
              <UInput
                v-model="inviteForm.email"
                type="email"
                placeholder="email@example.com"
              />
              <p v-if="inviteErrors.email" class="text-xs text-red-500">{{ inviteErrors.email }}</p>
            </div>

            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
              <USelect
                v-model="inviteForm.role"
                :items="roleOptions"
              />
            </div>

            <div class="flex justify-end gap-2 pt-2">
              <UButton
                label="Batal"
                variant="outline"
                color="neutral"
                @click="inviteModalOpen = false"
              />
              <UButton
                type="submit"
                label="Kirim Undangan"
                icon="i-lucide-send"
                :loading="inviteLoading"
              />
            </div>
          </form>
        </UCard>
      </template>
    </UModal>

    <!-- Change Role Modal -->
    <UModal v-model:open="changeRoleModalOpen">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-base font-semibold text-gray-900 dark:text-white">
                Ubah Role
              </h3>
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="neutral"
                size="sm"
                @click="changeRoleModalOpen = false"
              />
            </div>
          </template>

          <form class="space-y-4" @submit.prevent="handleChangeRole">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Ubah role untuk
              <span class="font-medium text-gray-900 dark:text-white">
                {{ selectedMember?.user.firstName }} {{ selectedMember?.user.lastName }}
              </span>
            </p>

            <div class="space-y-1">
              <label class="text-sm font-medium text-gray-700 dark:text-gray-300">Role Baru</label>
              <USelect
                v-model="newRole"
                :items="roleOptions"
              />
            </div>

            <div class="flex justify-end gap-2 pt-2">
              <UButton
                label="Batal"
                variant="outline"
                color="neutral"
                @click="changeRoleModalOpen = false"
              />
              <UButton
                type="submit"
                label="Simpan"
                :loading="changeRoleLoading"
              />
            </div>
          </form>
        </UCard>
      </template>
    </UModal>
  </div>
</template>

<script setup lang="ts">
/**
 * Tenant Settings Page — /settings/tenant
 *
 * Manages tenant info, invite code, and team members.
 * Uses TenantService for all API operations.
 */

import { z } from 'zod'
import { tenantService } from '~/services/TenantService'
import type { TenantResponse, MemberResponse, UpdateTenantRequest } from '~~/shared/types/tenant'
import type { UserRole, UserResponse } from '~~/shared/types/auth'
import type { Column } from '#ui/types'

definePageMeta({
  layout: 'dashboard',
})

useSeoMeta({
  title: 'Pengaturan Tenant — CRM Widget',
})

const toast = useToast()
const tenantStore = useTenantStore()

// ── State ─────────────────────────────────────────────────────
const tenant = ref<TenantResponse | null>(null)
const members = ref<MemberResponse[]>([])
const membersLoading = ref(false)
const regenerateLoading = ref(false)
const updateLoading = ref(false)
const inviteLoading = ref(false)
const changeRoleLoading = ref(false)

// ── Modal State ───────────────────────────────────────────────
const editModalOpen = ref(false)
const inviteModalOpen = ref(false)
const changeRoleModalOpen = ref(false)
const selectedMember = ref<MemberResponse | null>(null)
const newRole = ref<string>('member')

// ── Edit Form ─────────────────────────────────────────────────
const editForm = reactive({
  name: '',
  company: '',
  slug: '',
})
const editErrors = reactive<Record<string, string>>({
  name: '',
  company: '',
  slug: '',
})

// ── Invite Form ───────────────────────────────────────────────
const inviteForm = reactive({
  email: '',
  role: 'member',
})
const inviteErrors = reactive<Record<string, string>>({
  email: '',
})

// ── Table Columns ─────────────────────────────────────────────
const memberColumns: Column[] = [
  { accessorKey: 'user', header: 'Anggota' },
  { accessorKey: 'role', header: 'Role' },
  { accessorKey: 'actions', header: '' },
]

// ── Role Options ──────────────────────────────────────────────
const roleOptions = [
  { label: 'Super Admin', value: 'super_admin' },
  { label: 'Admin', value: 'admin' },
  { label: 'Manager', value: 'manager' },
  { label: 'Member', value: 'member' },
]

// ── Zod Schemas ───────────────────────────────────────────────
const editSchema = z.object({
  name: z.string().min(1, 'Nama wajib diisi').max(200),
  company: z.string().min(1, 'Perusahaan wajib diisi').max(200),
  slug: z.string().min(2, 'Slug minimal 2 karakter').max(100)
    .regex(/^[a-z0-9-]+$/, 'Hanya huruf kecil, angka, dan dash'),
})

const inviteSchema = z.object({
  email: z.string().email('Email tidak valid'),
  role: z.enum(['super_admin', 'admin', 'manager', 'member']),
})

// ── Helpers ───────────────────────────────────────────────────

/** Get user initials for avatar */
function getUserInitials(user: UserResponse): string {
  return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
}

/** Format role for display */
function formatRole(role: UserRole): string {
  const map: Record<UserRole, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    manager: 'Manager',
    member: 'Member',
  }
  return map[role] ?? role
}

/** Get badge color for role */
function getRoleBadgeColor(role: UserRole): string {
  const map: Record<UserRole, string> = {
    super_admin: 'error',
    admin: 'warning',
    manager: 'info',
    member: 'neutral',
  }
  return map[role] ?? 'neutral'
}

/** Get member dropdown actions */
function getMemberActions(member: MemberResponse) {
  return [[
    {
      label: 'Ubah Role',
      icon: 'i-lucide-shield',
      onSelect: () => openChangeRoleModal(member),
    },
    {
      label: 'Hapus',
      icon: 'i-lucide-trash-2',
      onSelect: () => handleRemoveMember(member),
    },
  ]]
}

// ── Data Fetching ─────────────────────────────────────────────

/** Load tenant details */
async function fetchTenant(): Promise<void> {
  const tenantId = tenantStore.currentTenantId
  if (!tenantId) return

  try {
    const response = await tenantService.getTenant(tenantId)
    tenant.value = response.data
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'Gagal memuat data tenant',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
}

/** Load tenant members */
async function fetchMembers(): Promise<void> {
  const tenantId = tenantStore.currentTenantId
  if (!tenantId) return

  membersLoading.value = true
  try {
    const response = await tenantService.getMembers(tenantId)
    members.value = response.data as MemberResponse[]
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'Gagal memuat data anggota',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    membersLoading.value = false
  }
}

// ── Actions ───────────────────────────────────────────────────

/** Regenerate invite code */
async function handleRegenerateCode(): Promise<void> {
  const tenantId = tenantStore.currentTenantId
  if (!tenantId) return

  regenerateLoading.value = true
  try {
    const response = await tenantService.regenerateCode(tenantId)
    tenant.value = response.data
    tenantStore.setCurrentTenant(response.data)
    toast.add({
      title: 'Berhasil',
      description: 'Kode undangan berhasil diperbarui',
      icon: 'i-lucide-check-circle',
      color: 'success',
    })
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'Gagal regenerasi kode undangan',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    regenerateLoading.value = false
  }
}

/** Update tenant info */
async function handleUpdateTenant(): Promise<void> {
  // Clear errors
  editErrors.name = ''
  editErrors.company = ''
  editErrors.slug = ''

  const result = editSchema.safeParse(editForm)
  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0]
      if (typeof field === 'string' && field in editErrors) {
        editErrors[field] = issue.message
      }
    }
    return
  }

  const tenantId = tenantStore.currentTenantId
  if (!tenantId) return

  updateLoading.value = true
  try {
    const payload: UpdateTenantRequest = result.data
    const response = await tenantService.updateTenant(tenantId, payload)
    tenant.value = response.data
    tenantStore.setCurrentTenant(response.data)
    editModalOpen.value = false
    toast.add({
      title: 'Berhasil',
      description: 'Tenant berhasil diperbarui',
      icon: 'i-lucide-check-circle',
      color: 'success',
    })
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'Gagal memperbarui tenant',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    updateLoading.value = false
  }
}

/** Invite a new member */
async function handleInviteMember(): Promise<void> {
  inviteErrors.email = ''

  const result = inviteSchema.safeParse(inviteForm)
  if (!result.success) {
    for (const issue of result.error.issues) {
      const field = issue.path[0]
      if (field === 'email') {
        inviteErrors.email = issue.message
      }
    }
    return
  }

  const tenantId = tenantStore.currentTenantId
  if (!tenantId) return

  inviteLoading.value = true
  try {
    await tenantService.inviteMember(tenantId, {
      email: result.data.email,
      role: result.data.role as UserRole,
    })
    inviteModalOpen.value = false
    inviteForm.email = ''
    inviteForm.role = 'member'
    await fetchMembers()
    toast.add({
      title: 'Berhasil',
      description: 'Undangan berhasil dikirim',
      icon: 'i-lucide-check-circle',
      color: 'success',
    })
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'Gagal mengirim undangan',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    inviteLoading.value = false
  }
}

/** Open change role modal for a member */
function openChangeRoleModal(member: MemberResponse): void {
  selectedMember.value = member
  newRole.value = member.role
  changeRoleModalOpen.value = true
}

/** Change a member's role */
async function handleChangeRole(): Promise<void> {
  const tenantId = tenantStore.currentTenantId
  if (!tenantId || !selectedMember.value) return

  changeRoleLoading.value = true
  try {
    await tenantService.updateMemberRole(
      tenantId,
      selectedMember.value.userId,
      { role: newRole.value as UserRole },
    )
    changeRoleModalOpen.value = false
    await fetchMembers()
    toast.add({
      title: 'Berhasil',
      description: 'Role berhasil diubah',
      icon: 'i-lucide-check-circle',
      color: 'success',
    })
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'Gagal mengubah role',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    changeRoleLoading.value = false
  }
}

/** Remove a member from the tenant */
async function handleRemoveMember(member: MemberResponse): Promise<void> {
  const tenantId = tenantStore.currentTenantId
  if (!tenantId) return

  try {
    await tenantService.removeMember(tenantId, member.userId)
    await fetchMembers()
    toast.add({
      title: 'Berhasil',
      description: 'Anggota berhasil dihapus',
      icon: 'i-lucide-check-circle',
      color: 'success',
    })
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'Gagal menghapus anggota',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
}

// ── Init ──────────────────────────────────────────────────────

/** Populate edit form when tenant data loads */
watch(tenant, (val) => {
  if (val) {
    editForm.name = val.name
    editForm.company = val.company
    editForm.slug = val.slug
  }
})

/** Populate edit form when modal opens */
watch(editModalOpen, (open) => {
  if (open && tenant.value) {
    editForm.name = tenant.value.name
    editForm.company = tenant.value.company
    editForm.slug = tenant.value.slug
    editErrors.name = ''
    editErrors.company = ''
    editErrors.slug = ''
  }
})

onMounted(async () => {
  await Promise.all([fetchTenant(), fetchMembers()])
})
</script>
