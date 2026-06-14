<!--
  Form Fields Page

  CRUD management for pre-chat form fields.
  Supports add, edit, delete, and reorder operations.

  @see ~/services/FormFieldService
  @see ~~/shared/types/form-field
-->
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
          Form Fields
        </h1>
        <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Kelola field pada form pre-chat yang dilihat pengunjung.
        </p>
      </div>
      <UButton
        icon="i-lucide-plus"
        label="Tambah Field"
        @click="openAddModal"
      />
    </div>

    <!-- Loading State -->
    <div v-if="listLoading" class="space-y-3">
      <USkeleton v-for="i in 4" :key="i" class="h-16 w-full" />
    </div>

    <!-- Empty State -->
    <UCard v-else-if="fields.length === 0">
      <div class="flex flex-col items-center justify-center py-12 text-center">
        <UIcon name="i-lucide-list-checks" class="size-12 text-gray-300 dark:text-gray-600" />
        <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
          Belum ada form field. Tambahkan field pertama.
        </p>
        <UButton
          icon="i-lucide-plus"
          label="Tambah Field"
          class="mt-4"
          @click="openAddModal"
        />
      </div>
    </UCard>

    <!-- Fields List -->
    <div v-else class="space-y-2">
      <UCard
        v-for="(field, index) in fields"
        :key="field.id"
      >
        <div class="flex items-center gap-4">
          <!-- Reorder Buttons -->
          <div class="flex flex-col gap-0.5">
            <UButton
              icon="i-lucide-chevron-up"
              variant="ghost"
              color="neutral"
              size="xs"
              :disabled="index === 0"
              @click="moveField(index, 'up')"
            />
            <UButton
              icon="i-lucide-chevron-down"
              variant="ghost"
              color="neutral"
              size="xs"
              :disabled="index === fields.length - 1"
              @click="moveField(index, 'down')"
            />
          </div>

          <!-- Field Info -->
          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <span class="font-medium text-gray-900 dark:text-white">
                {{ field.label }}
              </span>
              <UBadge variant="subtle" color="neutral" size="xs">
                {{ field.fieldType }}
              </UBadge>
              <UBadge v-if="field.isRequired" variant="subtle" color="warning" size="xs">
                Required
              </UBadge>
            </div>
            <p class="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
              {{ field.fieldName }}
              <span v-if="field.placeholder" class="text-gray-400 dark:text-gray-500">
                — {{ field.placeholder }}
              </span>
            </p>
          </div>

          <!-- Status -->
          <UBadge
            :color="field.isActive ? 'success' : 'neutral'"
            variant="subtle"
            size="xs"
          >
            {{ field.isActive ? 'Active' : 'Inactive' }}
          </UBadge>

          <!-- Actions -->
          <div class="flex items-center gap-1">
            <UButton
              icon="i-lucide-pencil"
              variant="ghost"
              color="neutral"
              size="xs"
              @click="openEditModal(field)"
            />
            <UButton
              icon="i-lucide-trash-2"
              variant="ghost"
              color="error"
              size="xs"
              @click="confirmDelete(field)"
            />
          </div>
        </div>
      </UCard>

      <!-- Save Order Button -->
      <div v-if="orderChanged" class="flex justify-end pt-2">
        <UButton
          icon="i-lucide-save"
          label="Simpan Urutan"
          :loading="reorderLoading"
          @click="saveOrder"
        />
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <UModal v-model:open="formModalOpen">
      <template #content>
        <UCard>
          <template #header>
            <div class="flex items-center justify-between">
              <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                {{ editingField ? 'Edit Field' : 'Tambah Field' }}
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
            :schema="createFormFieldSchema"
            :state="formState"
            class="space-y-4"
            @submit="handleSubmit"
          >
            <UFormField label="Field Name" name="fieldName">
              <UInput
                v-model="formState.fieldName"
                placeholder="e.g. full_name"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Label" name="label">
              <UInput
                v-model="formState.label"
                placeholder="e.g. Nama Lengkap"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Field Type" name="fieldType">
              <USelect
                v-model="formState.fieldType"
                :items="fieldTypeOptions"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Placeholder" name="placeholder">
              <UInput
                v-model="formState.placeholder"
                placeholder="Placeholder text (optional)"
                class="w-full"
              />
            </UFormField>

            <UFormField label="Wajib Diisi" name="isRequired">
              <USwitch v-model="formState.isRequired" />
            </UFormField>

            <!-- Options Editor (select only) -->
            <div v-if="formState.fieldType === 'select'" class="space-y-3">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Options
                </span>
                <UButton
                  icon="i-lucide-plus"
                  label="Add Option"
                  variant="outline"
                  size="xs"
                  @click="addOption"
                />
              </div>
              <div
                v-for="(opt, idx) in optionsList"
                :key="idx"
                class="flex items-center gap-2"
              >
                <UInput
                  v-model="opt.key"
                  placeholder="Key"
                  class="flex-1"
                  size="sm"
                />
                <UInput
                  v-model="opt.value"
                  placeholder="Label"
                  class="flex-1"
                  size="sm"
                />
                <UButton
                  icon="i-lucide-x"
                  variant="ghost"
                  color="error"
                  size="xs"
                  @click="removeOption(idx)"
                />
              </div>
            </div>

            <div class="flex justify-end gap-2 pt-2">
              <UButton
                label="Batal"
                variant="outline"
                color="neutral"
                @click="formModalOpen = false"
              />
              <UButton
                type="submit"
                :label="editingField ? 'Simpan' : 'Tambah'"
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
              Hapus Field
            </h3>
          </template>

          <p class="text-sm text-gray-600 dark:text-gray-400">
            Yakin ingin menghapus field
            <span class="font-medium text-gray-900 dark:text-white">{{ deletingField?.label }}</span>?
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
 * Form Fields Management Page
 *
 * Full CRUD with reorder support for pre-chat form fields.
 * Uses FormFieldService for API calls and Zod for form validation.
 */
import { formFieldService } from '~/services/FormFieldService'
import { createFormFieldSchema } from '~~/shared/types/form-field'
import type {
  FormFieldResponse,
  CreateFormFieldRequest,
  UpdateFormFieldRequest,
} from '~~/shared/types/form-field'
import type { FormFieldType } from '~~/shared/types/enums'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Form Fields — CRM Widget' })

const toast = useToast()

// ── Data ─────────────────────────────────────────────────────
const fields = ref<FormFieldResponse[]>([])
const listLoading = ref(true)
const orderChanged = ref(false)

// ── Field Type Options ───────────────────────────────────────
const fieldTypeOptions = [
  { label: 'Text', value: 'text' },
  { label: 'Email', value: 'email' },
  { label: 'Phone', value: 'phone' },
  { label: 'Number', value: 'number' },
  { label: 'Textarea', value: 'textarea' },
  { label: 'Select', value: 'select' },
]

// ── Form Modal State ─────────────────────────────────────────
const formModalOpen = ref(false)
const editingField = ref<FormFieldResponse | null>(null)
const submitLoading = ref(false)

interface OptionItem {
  key: string
  value: string
}

const optionsList = ref<OptionItem[]>([])

const formState = reactive<{
  fieldName: string
  label: string
  fieldType: FormFieldType
  placeholder: string
  isRequired: boolean
  sortOrder: number
}>({
  fieldName: '',
  label: '',
  fieldType: 'text',
  placeholder: '',
  isRequired: true,
  sortOrder: 0,
})

// ── Delete Modal State ───────────────────────────────────────
const deleteModalOpen = ref(false)
const deletingField = ref<FormFieldResponse | null>(null)
const deleteLoading = ref(false)

// ── Reorder State ────────────────────────────────────────────
const reorderLoading = ref(false)

// ── Fetch Data ───────────────────────────────────────────────
async function fetchFields(): Promise<void> {
  listLoading.value = true
  try {
    const response = await formFieldService.list()
    fields.value = response.data.sort((a, b) => a.sortOrder - b.sortOrder)
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'Gagal memuat form fields',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    listLoading.value = false
  }
}

// ── Modal Handlers ───────────────────────────────────────────
function openAddModal(): void {
  editingField.value = null
  formState.fieldName = ''
  formState.label = ''
  formState.fieldType = 'text'
  formState.placeholder = ''
  formState.isRequired = true
  formState.sortOrder = fields.value.length
  optionsList.value = []
  formModalOpen.value = true
}

function openEditModal(field: FormFieldResponse): void {
  editingField.value = field
  formState.fieldName = field.fieldName
  formState.label = field.label
  formState.fieldType = field.fieldType
  formState.placeholder = field.placeholder ?? ''
  formState.isRequired = field.isRequired
  formState.sortOrder = field.sortOrder

  if (field.options) {
    optionsList.value = Object.entries(field.options).map(([key, value]) => ({
      key,
      value,
    }))
  }
  else {
    optionsList.value = []
  }

  formModalOpen.value = true
}

function addOption(): void {
  optionsList.value.push({ key: '', value: '' })
}

function removeOption(idx: number): void {
  optionsList.value.splice(idx, 1)
}

async function handleSubmit(): Promise<void> {
  submitLoading.value = true

  const options: Record<string, string> = {}
  if (formState.fieldType === 'select') {
    for (const opt of optionsList.value) {
      if (opt.key.trim()) {
        options[opt.key.trim()] = opt.value.trim()
      }
    }
  }

  try {
    if (editingField.value) {
      const payload: UpdateFormFieldRequest = {
        fieldName: formState.fieldName,
        label: formState.label,
        fieldType: formState.fieldType,
        placeholder: formState.placeholder || undefined,
        isRequired: formState.isRequired,
        options: formState.fieldType === 'select' ? options : undefined,
      }
      await formFieldService.update(editingField.value.id, payload)
      toast.add({
        title: 'Berhasil',
        description: 'Field berhasil diperbarui',
        icon: 'i-lucide-check-circle',
        color: 'success',
      })
    }
    else {
      const payload: CreateFormFieldRequest = {
        fieldName: formState.fieldName,
        label: formState.label,
        fieldType: formState.fieldType,
        placeholder: formState.placeholder || undefined,
        isRequired: formState.isRequired,
        sortOrder: formState.sortOrder,
        options: formState.fieldType === 'select' ? options : undefined,
      }
      await formFieldService.create(payload)
      toast.add({
        title: 'Berhasil',
        description: 'Field berhasil ditambahkan',
        icon: 'i-lucide-check-circle',
        color: 'success',
      })
    }

    formModalOpen.value = false
    await fetchFields()
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'Gagal menyimpan field',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    submitLoading.value = false
  }
}

// ── Delete ───────────────────────────────────────────────────
function confirmDelete(field: FormFieldResponse): void {
  deletingField.value = field
  deleteModalOpen.value = true
}

async function handleDelete(): Promise<void> {
  if (!deletingField.value) return
  deleteLoading.value = true

  try {
    await formFieldService.remove(deletingField.value.id)
    toast.add({
      title: 'Berhasil',
      description: 'Field berhasil dihapus',
      icon: 'i-lucide-check-circle',
      color: 'success',
    })
    deleteModalOpen.value = false
    await fetchFields()
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'Gagal menghapus field',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    deleteLoading.value = false
  }
}

// ── Reorder ──────────────────────────────────────────────────
function moveField(index: number, direction: 'up' | 'down'): void {
  const newIndex = direction === 'up' ? index - 1 : index + 1
  if (newIndex < 0 || newIndex >= fields.value.length) return

  const temp = fields.value[index]
  fields.value[index] = fields.value[newIndex]
  fields.value[newIndex] = temp
  orderChanged.value = true
}

async function saveOrder(): Promise<void> {
  reorderLoading.value = true
  try {
    const items = fields.value.map((f, i) => ({
      id: f.id,
      sortOrder: i,
    }))
    await formFieldService.reorder(items)
    orderChanged.value = false
    toast.add({
      title: 'Berhasil',
      description: 'Urutan field berhasil disimpan',
      icon: 'i-lucide-check-circle',
      color: 'success',
    })
    await fetchFields()
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'Gagal menyimpan urutan',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    reorderLoading.value = false
  }
}

// ── Init ─────────────────────────────────────────────────────
onMounted(() => {
  fetchFields()
})
</script>
