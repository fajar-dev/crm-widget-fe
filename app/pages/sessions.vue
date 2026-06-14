<!--
  Sessions Page

  Paginated table of chatbot visitor sessions.
  Shows session values (name, email), IP, expiry, and activity timestamps.

  @see ~/services/SessionService
  @see ~~/shared/types/session
-->
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div>
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
        Sessions
      </h1>
      <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
        Lihat semua session pengunjung chatbot.
      </p>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-3">
      <USkeleton class="h-10 w-full" />
      <USkeleton v-for="i in 5" :key="i" class="h-14 w-full" />
    </div>

    <!-- Table -->
    <UCard v-else>
      <UTable
        :data="sessions"
        :columns="columns"
        :loading="loading"
      >
        <template #name-cell="{ row }">
          <span class="text-sm font-medium text-gray-900 dark:text-white">
            {{ getSessionName(row.original) }}
          </span>
        </template>

        <template #email-cell="{ row }">
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ row.original.values?.email || '—' }}
          </span>
        </template>

        <template #ipAddress-cell="{ row }">
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ row.original.ipAddress || '—' }}
          </span>
        </template>

        <template #expiresAt-cell="{ row }">
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ formatDate(row.original.expiresAt) }}
          </span>
        </template>

        <template #lastActivityAt-cell="{ row }">
          <span class="text-sm text-gray-600 dark:text-gray-400">
            {{ formatDate(row.original.lastActivityAt) }}
          </span>
        </template>

        <template #actions-cell="{ row }">
          <UButton
            icon="i-lucide-trash-2"
            variant="ghost"
            color="error"
            size="xs"
            @click="confirmDelete(row.original)"
          />
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

    <!-- Delete Confirmation Modal -->
    <UModal v-model:open="deleteModalOpen">
      <template #content>
        <UCard>
          <template #header>
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              Hapus Session
            </h3>
          </template>

          <p class="text-sm text-gray-600 dark:text-gray-400">
            Yakin ingin menghapus session
            <span class="font-medium text-gray-900 dark:text-white">
              {{ deletingSession ? getSessionName(deletingSession) : '' }}
            </span>?
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
 * Sessions Page
 *
 * Paginated UTable showing visitor sessions.
 * Supports deletion with confirmation modal.
 */
import { sessionService } from '~/services/SessionService'
import type { SessionResponse } from '~~/shared/types/session'
import type { PaginationMeta } from '~~/shared/types/api'

definePageMeta({ layout: 'dashboard' })
useSeoMeta({ title: 'Sessions — CRM Widget' })

const toast = useToast()

// ── Table Columns ────────────────────────────────────────────
const columns = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'ipAddress', header: 'IP Address' },
  { accessorKey: 'expiresAt', header: 'Expires At' },
  { accessorKey: 'lastActivityAt', header: 'Last Activity' },
  { accessorKey: 'actions', header: '' },
]

// ── Data ─────────────────────────────────────────────────────
const sessions = ref<SessionResponse[]>([])
const meta = ref<PaginationMeta | null>(null)
const currentPage = ref(1)
const loading = ref(true)

// ── Delete State ─────────────────────────────────────────────
const deleteModalOpen = ref(false)
const deletingSession = ref<SessionResponse | null>(null)
const deleteLoading = ref(false)

// ── Fetch Data ───────────────────────────────────────────────
async function fetchSessions(): Promise<void> {
  loading.value = true
  try {
    const response = await sessionService.list({
      page: currentPage.value,
      perPage: 20,
      sortBy: 'lastActivityAt',
      sortOrder: 'DESC',
    })
    sessions.value = response.data
    meta.value = response.meta
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'Gagal memuat sessions',
      icon: 'i-lucide-alert-circle',
      color: 'error',
    })
  }
  finally {
    loading.value = false
  }
}

// ── Helpers ──────────────────────────────────────────────────
function getSessionName(session: SessionResponse): string {
  const values = session.values ?? {}
  if (values.name) return values.name
  if (values.firstName) {
    return values.lastName ? `${values.firstName} ${values.lastName}` : values.firstName
  }
  return 'Anonymous'
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

// ── Delete ───────────────────────────────────────────────────
function confirmDelete(session: SessionResponse): void {
  deletingSession.value = session
  deleteModalOpen.value = true
}

async function handleDelete(): Promise<void> {
  if (!deletingSession.value) return
  deleteLoading.value = true

  try {
    await sessionService.remove(deletingSession.value.id)
    toast.add({
      title: 'Berhasil',
      description: 'Session berhasil dihapus',
      icon: 'i-lucide-check-circle',
      color: 'success',
    })
    deleteModalOpen.value = false
    await fetchSessions()
  }
  catch {
    toast.add({
      title: 'Error',
      description: 'Gagal menghapus session',
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
  fetchSessions()
})

// ── Init ─────────────────────────────────────────────────────
onMounted(() => {
  fetchSessions()
})
</script>
