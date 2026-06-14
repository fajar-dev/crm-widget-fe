<!--
  Knowledge Categories Page

  Lists all knowledge base categories with CRUD operations.
  Clicking a row navigates to the category detail page.

  @see ~/services/KnowledgeService
  @see ~~/shared/types/knowledge
-->
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
          Knowledge Base
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Kelola kategori dan knowledge base untuk chatbot AI.
        </p>
      </div>
      <UButton
        icon="i-lucide-plus"
        label="Tambah Kategori"
        @click="openAddModal"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <USkeleton v-for="i in 6" :key="i" class="h-40 w-full" />
    </div>

    <!-- Empty State -->
    <UCard v-else-if="categories.length === 0">
      <div class="flex flex-col items-center justify-center py-12 text-center">
        <UIcon name="i-lucide-book-open" class="size-12 text-gray-300 dark:text-gray-600" />
        <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Belum ada kategori knowledge base.
        </p>
        <UButton
          icon="i-lucide-plus"
          label="Tambah Kategori"
          class="mt-4"
          @click="openAddModal"
        />
      </div>
    </UCard>

    <!-- Categories Grid -->
    <div v-else class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <UCard
        v-for="category in categories"
        :key="category.id"
        class="cursor-pointer transition-shadow hover:shadow-md"
        @click="navigateToCategory(category.id)"
      >
        <div class="space-y-3">
          <div class="flex items-start justify-between">
            <h3 class="font-medium text-gray-900 dark:text-white">
              {{ category.name }}
            </h3>
            <div class="flex items-center gap-1" @click.stop>
              <UButton
                icon="i-lucide-pencil"
                variant="ghost"
                color="neutral"
                size="xs"
                @click="openEditModal(category)"
              />
              <UButton
                icon="i-lucide-trash-2"
                variant="ghost"
                color="error"
                size="xs"
                @click="confirmDelete(category)"
              />
            </div>
          </div>

          <p class="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {{ category.description || 'Tidak ada deskripsi' }}
          </p>

          <div class="flex items-center gap-2">
            <UBadge variant="subtle" color="primary" size="xs">
              {{ category.knowledgeBaseCount }} entri
            </UBadge>
            <UBadge
              :color="category.isActive ? 'success' : 'neutral'"
              variant="subtle"
              size="xs"
            >
              {{ category.isActive ? 'Active' : 'Inactive' }}
            </UBadge>
            <span class="ml-auto text-xs text-gray-400 dark:text-gray-500">
              #{{ category.sortOrder }}
            </span>
          </div>
        </div>
      </UCard>
    </div>

    <!-- Add/Edit Modal -->
    <UModal v-model:open="formModalOpen">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ editingCategory ? 'Edit Kategori' : 'Tambah Kategori' }}
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
            :schema="createCategorySchema"
            :state="formState"
            class="space-y-4"
            @submit="handleSubmit"
          >
            <UFormField label="Nama Kategori" name="name">
              <UInput
                v-model="formState.name"
                placeholder="e.g. FAQ Umum"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Deskripsi" name="description">
              <UTextarea
                v-model="formState.description"
                placeholder="Deskripsi singkat kategori"
                class="w-full"
                :rows="3"
              />
            </UFormField>

            <UFormField label="Sort Order" name="sortOrder">
              <UInput
                v-model.number="formState.sortOrder"
                type="number"
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
                :label="editingCategory ? 'Simpan' : 'Tambah'"
                :loading="submitLoading"
              />
            </div>
          </UForm>
        </UCard>
      </template>
    </UModal>

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="deleteModalOpen">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Hapus Kategori
            </h3>
          </template>

          <div class="space-y-3">
            <p class="text-sm text-gray-600 dark:text-gray-400">
              Yakin ingin menghapus kategori
              <span class="font-medium text-gray-900 dark:text-white">{{ deletingCategory?.name }}</span>?
            </p>
            <div class="flex items-start gap-2 rounded-md bg-amber-50 dark:bg-amber-950 p-3">
              <UIcon name="i-lucide-alert-triangle" class="mt-0.5 size-4 text-amber-600 dark:text-amber-400" />
              <p class="text-sm text-amber-700 dark:text-amber-300">
                Semua knowledge base entries dalam kategori ini juga akan dihapus.
                Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>
          </div>

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
 * Knowledge Categories Page
 *
 * Lists all knowledge base categories in a grid layout.
 * Supports CRUD with cascade delete warning.
 */
import { knowledgeService } from '~/services/KnowledgeService'
import { createCategorySchema } from '~~/shared/types/knowledge'
import type {
  KnowledgeCategoryResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from '~~/shared/types/knowledge'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Knowledge Base — CRM Widget' })

const toast = useToast()
const router = useRouter()

// ── Data ─────────────────────────────────────────────────────
const categories = ref<KnowledgeCategoryResponse[]>([])
const loading = ref(true)

// ── Form Modal State ─────────────────────────────────────────
const formModalOpen = ref(false)
const editingCategory = ref<KnowledgeCategoryResponse | null>(null)
const submitLoading = ref(false)

const formState = reactive<{
  name: string
  description: string
  sortOrder: number
  isActive: boolean
}>({
  name: '',
  description: '',
  sortOrder: 0,
  isActive: true,
})

// ── Delete Modal State ───────────────────────────────────────
const deleteModalOpen = ref(false)
const deletingCategory = ref<KnowledgeCategoryResponse | null>(null)
const deleteLoading = ref(false)

// ── Fetch Data ───────────────────────────────────────────────
async function fetchCategories(): Promise<void> {
  loading.value = true
  try {
    const response = await knowledgeService.listCategories()
    categories.value = response.data
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'Gagal memuat kategori',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    loading.value = false
  }
}

// ── Navigation ───────────────────────────────────────────────
function navigateToCategory(id: string): void {
  router.push(`/knowledge/${id}`)
}

// ── Modal Handlers ───────────────────────────────────────────
function openAddModal(): void {
  editingCategory.value = null
  formState.name = ''
  formState.description = ''
  formState.sortOrder = categories.value.length
  formState.isActive = true
  formModalOpen.value = true
}

function openEditModal(category: KnowledgeCategoryResponse): void {
  editingCategory.value = category
  formState.name = category.name
  formState.description = category.description ?? ''
  formState.sortOrder = category.sortOrder
  formState.isActive = category.isActive
  formModalOpen.value = true
}

async function handleSubmit(): Promise<void> {
  submitLoading.value = true

  try {
    if (editingCategory.value) {
      const payload: UpdateCategoryRequest = {
        name: formState.name,
        description: formState.description || undefined,
        sortOrder: formState.sortOrder,
        isActive: formState.isActive,
      }
      await knowledgeService.updateCategory(editingCategory.value.id, payload)
      toast.add({
        title: 'Berhasil',
        description: 'Kategori berhasil diperbarui',
        icon: 'i-lucide-check-circle',
        color: 'success',
      })
    }
    else {
      const payload: CreateCategoryRequest = {
        name: formState.name,
        description: formState.description || undefined,
        sortOrder: formState.sortOrder,
        isActive: formState.isActive,
      }
      await knowledgeService.createCategory(payload)
      toast.add({
        title: 'Berhasil',
        description: 'Kategori berhasil ditambahkan',
        icon: 'i-lucide-check-circle',
        color: 'success',
      })
    }

    formModalOpen.value = false
    await fetchCategories()
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'Gagal menyimpan kategori',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    submitLoading.value = false
  }
}

// ── Delete ───────────────────────────────────────────────────
function confirmDelete(category: KnowledgeCategoryResponse): void {
  deletingCategory.value = category
  deleteModalOpen.value = true
}

async function handleDelete(): Promise<void> {
  if (!deletingCategory.value) return
  deleteLoading.value = true

  try {
    await knowledgeService.removeCategory(deletingCategory.value.id)
    toast.add({
      title: 'Berhasil',
      description: 'Kategori berhasil dihapus',
      icon: 'i-lucide-check-circle',
      color: 'success',
    })
    deleteModalOpen.value = false
    await fetchCategories()
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'Gagal menghapus kategori',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    deleteLoading.value = false
  }
}

// ── Init ─────────────────────────────────────────────────────
onMounted(() => {
  fetchCategories()
})
</script>
