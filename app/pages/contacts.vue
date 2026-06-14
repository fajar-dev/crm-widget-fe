<!--
  Contacts Page

  Paginated table of CRM contacts with CRUD operations.
  Add/Edit via USlideover with Zod-validated form.

  @see ~/services/ContactService
  @see ~~/shared/types/contact
-->
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
          Contacts
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Kelola data kontak pelanggan dan leads.
        </p>
      </div>
      <UButton
        icon="i-lucide-plus"
        label="Tambah Kontak"
        @click="openAddSlideover"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-3">
      <USkeleton class="h-10 w-full" />
      <USkeleton v-for="i in 5" :key="i" class="h-14 w-full" />
    </div>

    <!-- Table -->
    <UCard v-else>
      <UTable
        :data="contacts"
        :columns="columns"
        :loading="loading"
      >
        <template #fullName-cell="{ row }">
          <div>
            <span class="text-sm font-medium text-gray-900 dark:text-white">
              {{ row.original.fullName }}
            </span>
            <p v-if="row.original.jobTitle" class="text-xs text-gray-500 dark:text-gray-400">
              {{ row.original.jobTitle }}
            </p>
          </div>
        </template>

        <template #email-cell="{ row }">
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ row.original.email || '—' }}
          </span>
        </template>

        <template #phone-cell="{ row }">
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ row.original.phone || '—' }}
          </span>
        </template>

        <template #company-cell="{ row }">
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ row.original.company || '—' }}
          </span>
        </template>

        <template #status-cell="{ row }">
          <UBadge
            :color="statusColorMap[row.original.status] ?? 'neutral'"
            variant="subtle"
            size="xs"
          >
            {{ row.original.status }}
          </UBadge>
        </template>

        <template #source-cell="{ row }">
          <UBadge variant="subtle" color="neutral" size="xs">
            {{ row.original.source }}
          </UBadge>
        </template>

        <template #actions-cell="{ row }">
          <div class="flex items-center gap-1">
            <UButton
              icon="i-lucide-pencil"
              variant="ghost"
              color="neutral"
              size="xs"
              @click="openEditSlideover(row.original)"
            />
            <UButton
              icon="i-lucide-trash-2"
              variant="ghost"
              color="error"
              size="xs"
              @click="confirmDelete(row.original)"
            />
          </div>
        </template>
      </UTable>

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

    <!-- Add/Edit Slideover -->
    <USlideover v-model:open="slideoverOpen">
      <template #content>
        <div class="flex h-full flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 px-6 py-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ editingContact ? 'Edit Kontak' : 'Tambah Kontak' }}
            </h3>
            <UButton
              icon="i-lucide-x"
              variant="ghost"
              color="neutral"
              size="xs"
              @click="slideoverOpen = false"
            />
          </div>

          <!-- Form -->
          <div class="flex-1 overflow-y-auto px-6 py-4">
            <UForm
              :schema="createContactSchema"
              :state="formState"
              class="space-y-4"
              @submit="handleSubmit"
            >
              <div class="grid grid-cols-2 gap-4">
                <UFormField label="First Name" name="firstName">
                  <UInput
                    v-model="formState.firstName"
                    placeholder="John"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="Last Name" name="lastName">
                  <UInput
                    v-model="formState.lastName"
                    placeholder="Doe"
                    class="w-full"
                  />
                </UFormField>
              </div>

              <UFormField label="Email" name="email">
                <UInput
                  v-model="formState.email"
                  type="email"
                  placeholder="john@example.com"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Phone" name="phone">
                <UInput
                  v-model="formState.phone"
                  placeholder="+62812345678"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Company" name="company">
                <UInput
                  v-model="formState.company"
                  placeholder="PT Contoh"
                  class="w-full"
                />
              </UFormField>

              <UFormField label="Job Title" name="jobTitle">
                <UInput
                  v-model="formState.jobTitle"
                  placeholder="Manager"
                  class="w-full"
                />
              </UFormField>

              <div class="grid grid-cols-2 gap-4">
                <UFormField label="Status" name="status">
                  <USelect
                    v-model="formState.status"
                    :items="statusOptions"
                    class="w-full"
                  />
                </UFormField>

                <UFormField label="Source" name="source">
                  <USelect
                    v-model="formState.source"
                    :items="sourceOptions"
                    class="w-full"
                  />
                </UFormField>
              </div>

              <UFormField label="Address" name="address">
                <UTextarea
                  v-model="formState.address"
                  placeholder="Alamat lengkap"
                  class="w-full"
                  :rows="2"
                />
              </UFormField>

              <UFormField label="Notes" name="notes">
                <UTextarea
                  v-model="formState.notes"
                  placeholder="Catatan tambahan"
                  class="w-full"
                  :rows="3"
                />
              </UFormField>

              <div class="flex justify-end gap-2 pt-4">
                <UButton
                  label="Batal"
                  variant="outline"
                  color="neutral"
                  @click="slideoverOpen = false"
                />
                <UButton
                  type="submit"
                  :label="editingContact ? 'Simpan' : 'Tambah'"
                  :loading="submitLoading"
                />
              </div>
            </UForm>
          </div>
        </div>
      </template>
    </USlideover>

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="deleteModalOpen">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Hapus Kontak
            </h3>
          </template>

          <p class="text-sm text-gray-600 dark:text-gray-400">
            Yakin ingin menghapus kontak
            <span class="font-medium text-gray-900 dark:text-white">{{ deletingContact?.fullName }}</span>?
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
 * Contacts Page
 *
 * Paginated contacts table with slideover form for CRUD.
 * Status and source badges use color-coding for quick visual reference.
 */
import { contactService } from '~/services/ContactService'
import { createContactSchema } from '~~/shared/types/contact'
import type {
  ContactResponse,
  ContactStatus,
  ContactSource,
  CreateContactRequest,
  UpdateContactRequest,
} from '~~/shared/types/contact'
import type { PaginationMeta } from '~~/shared/types/api'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Contacts — CRM Widget' })

const toast = useToast()

// ── Table Columns ────────────────────────────────────────────
const columns = [
  { accessorKey: 'fullName', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'phone', header: 'Phone' },
  { accessorKey: 'company', header: 'Company' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'source', header: 'Source' },
  { accessorKey: 'actions', header: '' },
]

// ── Status Color Map ─────────────────────────────────────────
const statusColorMap: Record<ContactStatus, string> = {
  lead: 'info',
  prospect: 'warning',
  customer: 'success',
  inactive: 'neutral',
}

// ── Select Options ───────────────────────────────────────────
const statusOptions = [
  { label: 'Lead', value: 'lead' },
  { label: 'Prospect', value: 'prospect' },
  { label: 'Customer', value: 'customer' },
  { label: 'Inactive', value: 'inactive' },
]

const sourceOptions = [
  { label: 'Website', value: 'website' },
  { label: 'Referral', value: 'referral' },
  { label: 'Social Media', value: 'social_media' },
  { label: 'Cold Call', value: 'cold_call' },
  { label: 'Email', value: 'email' },
  { label: 'Other', value: 'other' },
]

// ── Data ─────────────────────────────────────────────────────
const contacts = ref<ContactResponse[]>([])
const meta = ref<PaginationMeta | null>(null)
const currentPage = ref(1)
const loading = ref(true)

// ── Slideover State ──────────────────────────────────────────
const slideoverOpen = ref(false)
const editingContact = ref<ContactResponse | null>(null)
const submitLoading = ref(false)

const formState = reactive<{
  firstName: string
  lastName: string
  email: string
  phone: string
  company: string
  jobTitle: string
  status: ContactStatus
  source: ContactSource
  notes: string
  address: string
}>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  company: '',
  jobTitle: '',
  status: 'lead',
  source: 'other',
  notes: '',
  address: '',
})

// ── Delete State ─────────────────────────────────────────────
const deleteModalOpen = ref(false)
const deletingContact = ref<ContactResponse | null>(null)
const deleteLoading = ref(false)

// ── Fetch Data ───────────────────────────────────────────────
async function fetchContacts(): Promise<void> {
  loading.value = true
  try {
    const response = await contactService.list({
      page: currentPage.value,
      perPage: 20,
    })
    contacts.value = response.data
    meta.value = response.meta
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'Gagal memuat contacts',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    loading.value = false
  }
}

// ── Slideover Handlers ───────────────────────────────────────
function openAddSlideover(): void {
  editingContact.value = null
  formState.firstName = ''
  formState.lastName = ''
  formState.email = ''
  formState.phone = ''
  formState.company = ''
  formState.jobTitle = ''
  formState.status = 'lead'
  formState.source = 'other'
  formState.notes = ''
  formState.address = ''
  slideoverOpen.value = true
}

function openEditSlideover(contact: ContactResponse): void {
  editingContact.value = contact
  formState.firstName = contact.firstName
  formState.lastName = contact.lastName
  formState.email = contact.email ?? ''
  formState.phone = contact.phone ?? ''
  formState.company = contact.company ?? ''
  formState.jobTitle = contact.jobTitle ?? ''
  formState.status = contact.status
  formState.source = contact.source
  formState.notes = contact.notes ?? ''
  formState.address = contact.address ?? ''
  slideoverOpen.value = true
}

async function handleSubmit(): Promise<void> {
  submitLoading.value = true

  try {
    if (editingContact.value) {
      const payload: UpdateContactRequest = {
        firstName: formState.firstName,
        lastName: formState.lastName,
        email: formState.email || undefined,
        phone: formState.phone || undefined,
        company: formState.company || undefined,
        jobTitle: formState.jobTitle || undefined,
        status: formState.status,
        source: formState.source,
        notes: formState.notes || undefined,
        address: formState.address || undefined,
      }
      await contactService.update(editingContact.value.id, payload)
      toast.add({
        title: 'Berhasil',
        description: 'Kontak berhasil diperbarui',
        icon: 'i-lucide-check-circle',
        color: 'success',
      })
    }
    else {
      const payload: CreateContactRequest = {
        firstName: formState.firstName,
        lastName: formState.lastName,
        email: formState.email || undefined,
        phone: formState.phone || undefined,
        company: formState.company || undefined,
        jobTitle: formState.jobTitle || undefined,
        status: formState.status,
        source: formState.source,
        notes: formState.notes || undefined,
        address: formState.address || undefined,
      }
      await contactService.create(payload)
      toast.add({
        title: 'Berhasil',
        description: 'Kontak berhasil ditambahkan',
        icon: 'i-lucide-check-circle',
        color: 'success',
      })
    }

    slideoverOpen.value = false
    await fetchContacts()
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'Gagal menyimpan kontak',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    submitLoading.value = false
  }
}

// ── Delete ───────────────────────────────────────────────────
function confirmDelete(contact: ContactResponse): void {
  deletingContact.value = contact
  deleteModalOpen.value = true
}

async function handleDelete(): Promise<void> {
  if (!deletingContact.value) return
  deleteLoading.value = true

  try {
    await contactService.remove(deletingContact.value.id)
    toast.add({
      title: 'Berhasil',
      description: 'Kontak berhasil dihapus',
      icon: 'i-lucide-check-circle',
      color: 'success',
    })
    deleteModalOpen.value = false
    await fetchContacts()
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'Gagal menghapus kontak',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    deleteLoading.value = false
  }
}

// ── Watchers ─────────────────────────────────────────────────
watch(currentPage, () => {
  fetchContacts()
})

// ── Init ─────────────────────────────────────────────────────
onMounted(() => {
  fetchContacts()
})
</script>
