<!--
  Knowledge Detail Page

  Shows all knowledge base entries within a specific category.
  Supports CRUD and bulk import of entries.

  @see ~/services/KnowledgeService
  @see ~~/shared/types/knowledge
-->
<template>
  <div class="space-y-6">
    <!-- Breadcrumb & Back -->
    <div class="flex items-center gap-3">
      <UButton
        icon="i-lucide-arrow-left"
        variant="ghost"
        color="neutral"
        size="sm"
        to="/knowledge"
      />
      <UBreadcrumb :items="breadcrumbItems" />
    </div>

    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
          {{ category?.name ?? 'Loading...' }}
        </h1>
        <p v-if="category?.description" class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {{ category.description }}
        </p>
      </div>
      <div class="flex items-center gap-2">
        <UButton
          icon="i-lucide-upload"
          label="Bulk Import"
          variant="outline"
          @click="bulkModalOpen = true"
        />
        <UButton
          icon="i-lucide-plus"
          label="Tambah Entry"
          @click="openAddModal"
        />
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-3">
      <USkeleton v-for="i in 4" :key="i" class="h-20 w-full" />
    </div>

    <!-- Empty State -->
    <UCard v-else-if="entries.length === 0">
      <div class="flex flex-col items-center justify-center py-12 text-center">
        <UIcon name="i-lucide-file-text" class="size-12 text-gray-300 dark:text-gray-600" />
        <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Belum ada entries dalam kategori ini.
        </p>
        <div class="mt-4 flex items-center gap-2">
          <UButton
            icon="i-lucide-plus"
            label="Tambah Entry"
            @click="openAddModal"
          />
          <UButton
            icon="i-lucide-upload"
            label="Bulk Import"
            variant="outline"
            @click="bulkModalOpen = true"
          />
        </div>
      </div>
    </UCard>

    <!-- Entries List -->
    <div v-else class="space-y-2">
      <UCard v-for="entry in entries" :key="entry.id">
        <div class="flex items-start gap-4">
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-900 dark:text-white">
                {{ entry.title }}
              </span>
              <UBadge
                variant="subtle"
                :color="entry.entryType === 'faq' ? 'primary' : 'neutral'"
                size="xs"
              >
                {{ entry.entryType === 'faq' ? 'FAQ' : 'Document Chunk' }}
              </UBadge>
              <UBadge
                :color="entry.isActive ? 'success' : 'neutral'"
                variant="subtle"
                size="xs"
              >
                {{ entry.isActive ? 'Active' : 'Inactive' }}
              </UBadge>
            </div>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {{ entry.content }}
            </p>
          </div>

          <div class="flex items-center gap-1 shrink-0">
            <UButton
              icon="i-lucide-pencil"
              variant="ghost"
              color="neutral"
              size="xs"
              @click="openEditModal(entry)"
            />
            <UButton
              icon="i-lucide-trash-2"
              variant="ghost"
              color="error"
              size="xs"
              @click="confirmDelete(entry)"
            />
          </div>
        </div>
      </UCard>
    </div>

    <!-- Add/Edit Entry Modal -->
    <UModal v-model:open="formModalOpen">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ editingEntry ? 'Edit Entry' : 'Tambah Entry' }}
              </h3>
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="neutral"
                size="xs"
                @click="formModalOpen = false"
              />
            </div>
          </template>

          <UForm
            :schema="createKnowledgeBaseSchema"
            :state="formState"
            class="space-y-4"
            @submit="handleSubmit"
          >
            <UFormField label="Title" name="title">
              <UInput
                v-model="formState.title"
                placeholder="Judul entry"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Content" name="content">
              <UTextarea
                v-model="formState.content"
                placeholder="Isi konten knowledge base"
                class="w-full"
                :rows="8"
              />
            </UFormField>

            <UFormField label="Entry Type" name="entryType">
              <USelect
                v-model="formState.entryType"
                :items="entryTypeOptions"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Aktif" name="isActive">
              <USwitch v-model="formState.isActive" />
            </UFormField>

            <div class="flex justify-end gap-2 pt-2">
              <UButton
                label="Batal"
                variant="outline"
                color="neutral"
                @click="formModalOpen = false"
              />
              <UButton
                type="submit"
                :label="editingEntry ? 'Simpan' : 'Tambah'"
                :loading="submitLoading"
              />
            </div>
          </UForm>
        </UCard>
      </template>
    </UModal>

    <!-- Bulk Import Modal -->
    <UModal v-model:open="bulkModalOpen">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                Bulk Import Entries
              </h3>
              <UButton
                icon="i-lucide-x"
                variant="ghost"
                color="neutral"
                size="xs"
                @click="bulkModalOpen = false"
              />
            </div>
          </template>

          <div class="space-y-4">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              Paste JSON array berisi entries. Setiap entry harus memiliki
              <code class="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">title</code> dan
              <code class="text-xs bg-gray-100 dark:bg-gray-800 px-1 py-0.5 rounded">content</code>.
            </p>

            <UTextarea
              v-model="bulkJson"
              placeholder='[{"title": "...", "content": "...", "entryType": "faq"}]'
              class="w-full"
              :rows="10"
            />

            <div v-if="bulkError" class="flex items-start gap-2 rounded-md bg-red-50 dark:bg-red-950 p-3">
              <UIcon name="i-lucide-alert-circle" class="mt-0.5 size-4 text-red-600 dark:text-red-400" />
              <p class="text-sm text-red-700 dark:text-red-300">{{ bulkError }}</p>
            </div>

            <div class="flex justify-end gap-2">
              <UButton
                label="Batal"
                variant="outline"
                color="neutral"
                @click="bulkModalOpen = false"
              />
              <UButton
                label="Import"
                icon="i-lucide-upload"
                :loading="bulkLoading"
                @click="handleBulkImport"
              />
            </div>
          </div>
        </UCard>
      </template>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="deleteModalOpen">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Hapus Entry
            </h3>
          </template>

          <p class="text-sm text-gray-600 dark:text-gray-400">
            Yakin ingin menghapus entry
            <span class="font-medium text-gray-900 dark:text-white">{{ deletingEntry?.title }}</span>?
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
 * Knowledge Detail Page
 *
 * Displays entries within a specific knowledge category.
 * Supports CRUD and bulk import of entries.
 */
import { knowledgeService } from '~/services/KnowledgeService'
import { createKnowledgeBaseSchema } from '~~/shared/types/knowledge'
import type {
  KnowledgeCategoryResponse,
  KnowledgeBaseResponse,
  CreateKnowledgeBaseRequest,
  UpdateKnowledgeBaseRequest,
} from '~~/shared/types/knowledge'
import type { EntryType } from '~~/shared/types/enums'

definePageMeta({ layout: 'dashboard' })

const route = useRoute()
const toast = useToast()
const categoryId = computed(() => route.params.id as string)

// ── Data ─────────────────────────────────────────────────────
const category = ref<KnowledgeCategoryResponse | null>(null)
const entries = ref<KnowledgeBaseResponse[]>([])
const loading = ref(true)

// ── SEO ──────────────────────────────────────────────────────
useSeoMeta({ title: computed(() => `${category.value?.name ?? 'Category'} — Knowledge Base`) })

// ── Breadcrumb ───────────────────────────────────────────────
const breadcrumbItems = computed(() => [
  { label: 'Knowledge Base', to: '/knowledge' },
  { label: category.value?.name ?? '...' },
])

// ── Entry Type Options ───────────────────────────────────────
const entryTypeOptions = [
  { label: 'FAQ', value: 'faq' },
  { label: 'Document Chunk', value: 'document_chunk' },
]

// ── Form Modal State ─────────────────────────────────────────
const formModalOpen = ref(false)
const editingEntry = ref<KnowledgeBaseResponse | null>(null)
const submitLoading = ref(false)

const formState = reactive<{
  title: string
  content: string
  entryType: EntryType
  isActive: boolean
  sortOrder: number
}>({
  title: '',
  content: '',
  entryType: 'faq',
  isActive: true,
  sortOrder: 0,
})

// ── Bulk Import State ────────────────────────────────────────
const bulkModalOpen = ref(false)
const bulkJson = ref('')
const bulkLoading = ref(false)
const bulkError = ref('')

// ── Delete Modal State ───────────────────────────────────────
const deleteModalOpen = ref(false)
const deletingEntry = ref<KnowledgeBaseResponse | null>(null)
const deleteLoading = ref(false)

// ── Fetch Data ───────────────────────────────────────────────
async function fetchCategory(): Promise<void> {
  try {
    const response = await knowledgeService.getCategory(categoryId.value)
    category.value = response.data
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'Gagal memuat kategori',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
}

async function fetchEntries(): Promise<void> {
  loading.value = true
  try {
    const response = await knowledgeService.listEntries(categoryId.value)
    entries.value = response.data
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'Gagal memuat entries',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    loading.value = false
  }
}

// ── Modal Handlers ───────────────────────────────────────────
function openAddModal(): void {
  editingEntry.value = null
  formState.title = ''
  formState.content = ''
  formState.entryType = 'faq'
  formState.isActive = true
  formState.sortOrder = entries.value.length
  formModalOpen.value = true
}

function openEditModal(entry: KnowledgeBaseResponse): void {
  editingEntry.value = entry
  formState.title = entry.title
  formState.content = entry.content
  formState.entryType = entry.entryType
  formState.isActive = entry.isActive
  formState.sortOrder = entry.sortOrder
  formModalOpen.value = true
}

async function handleSubmit(): Promise<void> {
  submitLoading.value = true

  try {
    if (editingEntry.value) {
      const payload: UpdateKnowledgeBaseRequest = {
        title: formState.title,
        content: formState.content,
        entryType: formState.entryType,
        isActive: formState.isActive,
      }
      await knowledgeService.updateEntry(editingEntry.value.id, payload)
      toast.add({
        title: 'Berhasil',
        description: 'Entry berhasil diperbarui',
        icon: 'i-lucide-check-circle',
        color: 'success',
      })
    }
    else {
      const payload: CreateKnowledgeBaseRequest = {
        title: formState.title,
        content: formState.content,
        entryType: formState.entryType,
        isActive: formState.isActive,
        sortOrder: formState.sortOrder,
      }
      await knowledgeService.createEntry(categoryId.value, payload)
      toast.add({
        title: 'Berhasil',
        description: 'Entry berhasil ditambahkan',
        icon: 'i-lucide-check-circle',
        color: 'success',
      })
    }

    formModalOpen.value = false
    await fetchEntries()
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'Gagal menyimpan entry',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    submitLoading.value = false
  }
}

// ── Bulk Import ──────────────────────────────────────────────
async function handleBulkImport(): Promise<void> {
  bulkError.value = ''
  bulkLoading.value = true

  try {
    const parsed = JSON.parse(bulkJson.value) as CreateKnowledgeBaseRequest[]

    if (!Array.isArray(parsed)) {
      bulkError.value = 'Input harus berupa JSON array'
      return
    }

    for (const item of parsed) {
      if (!item.title || !item.content) {
        bulkError.value = 'Setiap entry harus memiliki "title" dan "content"'
        return
      }
    }

    await knowledgeService.bulkCreateEntries(categoryId.value, parsed)
    toast.add({
      title: 'Berhasil',
      description: `${parsed.length} entries berhasil diimport`,
      icon: 'i-lucide-check-circle',
      color: 'success',
    })
    bulkModalOpen.value = false
    bulkJson.value = ''
    await fetchEntries()
  }
  catch (err) {
    if (err instanceof SyntaxError) {
      bulkError.value = 'Format JSON tidak valid'
    }
    else {
      bulkError.value = 'Gagal mengimport entries'
    }
  }
  finally {
    bulkLoading.value = false
  }
}

// ── Delete ───────────────────────────────────────────────────
function confirmDelete(entry: KnowledgeBaseResponse): void {
  deletingEntry.value = entry
  deleteModalOpen.value = true
}

async function handleDelete(): Promise<void> {
  if (!deletingEntry.value) return
  deleteLoading.value = true

  try {
    await knowledgeService.removeEntry(deletingEntry.value.id)
    toast.add({
      title: 'Berhasil',
      description: 'Entry berhasil dihapus',
      icon: 'i-lucide-check-circle',
      color: 'success',
    })
    deleteModalOpen.value = false
    await fetchEntries()
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'Gagal menghapus entry',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    deleteLoading.value = false
  }
}

// ── Init ─────────────────────────────────────────────────────
onMounted(async () => {
  await Promise.all([fetchCategory(), fetchEntries()])
})
</script>
