# Coding Standards — CRM Widget Frontend

> Standar penulisan kode untuk project **CRM Widget Frontend**.
> Dokumen ini ditulis dalam Bahasa Indonesia dengan istilah teknis dalam Bahasa Inggris.

---

## 📋 Daftar Isi

- [Vue Component Standards](#-vue-component-standards)
- [TypeScript Standards](#-typescript-standards)
- [Composable Standards](#-composable-standards)
- [Service Class Standards](#-service-class-standards)
- [Store Standards (Pinia)](#-store-standards-pinia)
- [File Organization Rules](#-file-organization-rules)
- [Import Rules](#-import-rules)
- [Error Handling Pattern](#-error-handling-pattern)
- [Comment & Documentation Standards](#-comment--documentation-standards)

---

## 🧩 Vue Component Standards

### File Structure Order

Setiap Vue component **HARUS** mengikuti urutan berikut:

```
1. <template>
2. <script setup lang="ts">
3. (TIDAK ADA <style> kecuali benar-benar diperlukan)
```

> **Catatan:** `<style>` hanya diperbolehkan jika styling yang dibutuhkan **tidak bisa** dicapai
> dengan Tailwind utility classes atau NuxtUI component props. Ini sangat jarang terjadi.

### Script Setup Order

Di dalam `<script setup lang="ts">`, ikuti urutan berikut:

```
1. File header comment (JSDoc)
2. definePageMeta() — jika ini page component
3. useSeoMeta() — jika diperlukan SEO meta
4. Props (defineProps)
5. Emits (defineEmits)
6. Composables & Stores
7. Reactive state (ref, reactive)
8. Computed properties
9. Methods/Functions
10. Watchers (watch, watchEffect)
11. Lifecycle hooks (onMounted, onUnmounted, dll.)
```

### Component Naming

| Aturan | Contoh |
|--------|--------|
| PascalCase untuk filename | `ChatMessage.vue`, `DashboardSidebar.vue` |
| Prefix dengan domain | `DashboardSettingsWidgetForm.vue` |
| Deskriptif, hindari singkatan | `WidgetPreChatForm.vue` (bukan `WPCForm.vue`) |
| Multi-word selalu | `CommonLoadingState.vue` (bukan `Loading.vue`) |

### Props & Emits

Gunakan `defineProps<T>()` dan `defineEmits<T>()` dengan TypeScript:

```typescript
// ✅ Benar — TypeScript type-safe props
interface Props {
  /** Judul yang ditampilkan */
  title: string
  /** Deskripsi opsional */
  description?: string
  /** Status loading */
  loading?: boolean
  /** Daftar item yang ditampilkan */
  items: ChatMessage[]
}

const props = withDefaults(defineProps<Props>(), {
  description: '',
  loading: false,
})

// ✅ Benar — TypeScript type-safe emits
interface Emits {
  /** Dipanggil saat user submit form */
  (event: 'submit', payload: FormData): void
  /** Dipanggil saat user cancel */
  (event: 'cancel'): void
  /** Dipanggil saat item dipilih */
  (event: 'select', id: string): void
}

const emit = defineEmits<Emits>()
```

```typescript
// ❌ Salah — runtime declaration tanpa type safety
const props = defineProps({
  title: String,
  loading: Boolean,
})

const emit = defineEmits(['submit', 'cancel'])
```

### Template Rules

#### Wajib Gunakan NuxtUI Components

```vue
<!-- ✅ Benar — menggunakan NuxtUI -->
<UButton label="Save" color="primary" icon="i-lucide-save" />
<UInput v-model="email" placeholder="Email" type="email" />
<UCard>
  <template #header>
    <h3 class="text-lg font-semibold">Settings</h3>
  </template>
  <p>Card content</p>
</UCard>
<USelect v-model="selected" :items="options" />
<UTextarea v-model="message" placeholder="Type a message..." />
<UModal v-model:open="isOpen">
  <template #content>
    <p>Modal content</p>
  </template>
</UModal>
<UTable :data="rows" :columns="columns" />
```

```vue
<!-- ❌ Salah — menggunakan native HTML untuk komponen yang ada di NuxtUI -->
<button class="bg-blue-500 text-white px-4 py-2 rounded">Save</button>
<input v-model="email" type="email" class="border px-3 py-2 rounded" />
<div class="border rounded-lg shadow p-4">Card content</div>
<select v-model="selected">
  <option v-for="opt in options" :key="opt" :value="opt">{{ opt }}</option>
</select>
```

#### Wajib Gunakan Tailwind Utility Classes

```vue
<!-- ✅ Benar — Tailwind utility classes yang sudah ada -->
<div class="flex items-center gap-3 p-4">
  <div class="grid grid-cols-2 gap-4 mt-6">
    <p class="text-sm text-muted">Description text</p>
    <span class="font-semibold text-lg">Title</span>
  </div>
</div>
```

```vue
<!-- ❌ DILARANG — Hardcoded arbitrary values -->
<div class="flex items-center gap-[12px] p-[10px]">
  <div class="grid grid-cols-2 gap-[16px] mt-[24px]">
    <p class="text-[14px] text-[#666]">Description text</p>
    <span class="font-[600] text-[18px]">Title</span>
  </div>
</div>
```

#### Mapping Arbitrary Values ke Tailwind Classes

| ❌ Hardcoded | ✅ Tailwind Class | Keterangan |
|-------------|-------------------|------------|
| `p-[4px]` | `p-1` | 4px = 0.25rem |
| `p-[8px]` | `p-2` | 8px = 0.5rem |
| `p-[10px]` | `p-2.5` | 10px = 0.625rem |
| `p-[12px]` | `p-3` | 12px = 0.75rem |
| `p-[16px]` | `p-4` | 16px = 1rem |
| `mt-[5px]` | `mt-1` | Gunakan terdekat |
| `mt-[20px]` | `mt-5` | 20px = 1.25rem |
| `w-[200px]` | `w-52` | 208px ≈ 200px |
| `text-[14px]` | `text-sm` | 14px = 0.875rem |
| `text-[18px]` | `text-lg` | 18px = 1.125rem |
| `bg-[#fff]` | `bg-white` | Gunakan named colors |
| `bg-[#f5f5f5]` | `bg-neutral-100` | Gunakan color scale |
| `text-[#333]` | `text-neutral-700` | Gunakan color scale |
| `rounded-[8px]` | `rounded-lg` | 8px border radius |

#### Semantic Color Tokens

Gunakan color tokens dari NuxtUI/Tailwind:

```vue
<!-- ✅ Benar — semantic colors -->
<p class="text-primary">Primary text</p>
<p class="text-muted">Muted/secondary text</p>
<div class="bg-elevated">Elevated background</div>
<div class="border-default">Default border</div>

<!-- ✅ Benar — Tailwind color scale -->
<p class="text-neutral-500">Gray text</p>
<div class="bg-neutral-50">Light background</div>
```

### Contoh Component yang Benar ✅

```vue
<template>
  <div class="space-y-4">
    <!-- Header section -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-xl font-semibold">{{ title }}</h2>
        <p v-if="description" class="text-sm text-muted mt-1">
          {{ description }}
        </p>
      </div>
      <UButton
        label="Add Item"
        icon="i-lucide-plus"
        color="primary"
        @click="emit('add')"
      />
    </div>

    <!-- Loading state -->
    <CommonLoadingState v-if="loading" />

    <!-- Empty state -->
    <CommonEmptyState
      v-else-if="items.length === 0"
      title="No items found"
      description="Create your first item to get started."
      icon="i-lucide-inbox"
    />

    <!-- Data list -->
    <div v-else class="grid gap-3">
      <UCard v-for="item in items" :key="item.id">
        <div class="flex items-center justify-between">
          <div>
            <p class="font-medium">{{ item.name }}</p>
            <p class="text-sm text-muted">{{ item.description }}</p>
          </div>
          <div class="flex items-center gap-2">
            <UButton
              icon="i-lucide-pencil"
              variant="ghost"
              size="sm"
              @click="emit('edit', item.id)"
            />
            <UButton
              icon="i-lucide-trash-2"
              variant="ghost"
              color="error"
              size="sm"
              @click="emit('delete', item.id)"
            />
          </div>
        </div>
      </UCard>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * ItemList Component
 *
 * Menampilkan daftar item dengan loading, empty, dan error states.
 * Mendukung aksi add, edit, dan delete melalui emits.
 */

interface Item {
  id: string
  name: string
  description: string
}

interface Props {
  /** Judul section */
  title: string
  /** Deskripsi opsional */
  description?: string
  /** Daftar item */
  items: Item[]
  /** Status loading */
  loading?: boolean
}

interface Emits {
  (event: 'add'): void
  (event: 'edit', id: string): void
  (event: 'delete', id: string): void
}

withDefaults(defineProps<Props>(), {
  description: '',
  loading: false,
})

const emit = defineEmits<Emits>()
</script>
```

### Contoh Component yang SALAH ❌

```vue
<!-- ❌ SALAH — Jangan ikuti contoh ini! -->
<template>
  <!-- ❌ Hardcoded CSS arbitrary values -->
  <div style="padding: 20px;">

    <!-- ❌ Menggunakan native HTML bukan NuxtUI -->
    <button
      class="bg-[#4f46e5] text-[#fff] px-[16px] py-[8px] rounded-[6px]"
      @click="addItem"
    >
      Add Item
    </button>

    <!-- ❌ Tidak ada loading state -->
    <!-- ❌ Tidak ada empty state -->

    <!-- ❌ Menggunakan native HTML table -->
    <table class="w-[100%] mt-[20px]">
      <tr v-for="item in items" :key="item.id">
        <!-- ❌ Hardcoded colors dan sizes -->
        <td class="p-[10px] text-[14px] text-[#333]">
          {{ item.name }}
        </td>
      </tr>
    </table>
  </div>
</template>

<script setup lang="ts">
// ❌ Tidak ada JSDoc comment
// ❌ Tidak ada TypeScript types untuk props
const props = defineProps({
  items: Array,        // ❌ Tidak type-safe
})

// ❌ Menggunakan `any`
const addItem = () => {
  const data: any = { name: 'test' }  // ❌ NEVER use `any`
  console.log(data)
}
</script>

<!-- ❌ Menggunakan <style> dengan hardcoded CSS -->
<style scoped>
.container {
  padding: 20px;
  margin-top: 10px;
}
</style>
```

---

## 📘 TypeScript Standards

### Strict Mode

TypeScript strict mode sudah diaktifkan di `nuxt.config.ts`:

```typescript
// nuxt.config.ts
typescript: {
  strict: true,
}
```

Ini berarti:
- `strictNullChecks` aktif
- `noImplicitAny` aktif
- `strictFunctionTypes` aktif
- Dan semua opsi strict lainnya

### Interface vs Type

| Gunakan | Untuk | Contoh |
|---------|-------|--------|
| `interface` | Object shapes, extendable | Data models, props, API responses |
| `type` | Unions, intersections, aliases | Union types, mapped types, utility types |

```typescript
// ✅ interface — untuk object shapes
interface WidgetSettings {
  id: string
  primaryColor: string
  fontFamily: string
  welcomeMessage: string
  isEnabled: boolean
}

// ✅ interface — extends untuk inheritance
interface UpdateWidgetSettingsPayload extends Omit<WidgetSettings, 'id'> {
  // Semua field dari WidgetSettings kecuali id
}

// ✅ type — untuk unions
type FormFieldType = 'text' | 'email' | 'phone' | 'number' | 'textarea' | 'select'

// ✅ type — untuk intersections
type CreateFormFieldPayload = Omit<FormField, 'id' | 'createdAt' | 'updatedAt'>

// ✅ type — untuk aliases dan utility types
type ApiResult<T> = ApiResponse<T> | ApiErrorResponse

// ✅ type — untuk complex mapped types
type ReadonlyDeep<T> = {
  readonly [P in keyof T]: T[P] extends object ? ReadonlyDeep<T[P]> : T[P]
}
```

### NEVER Use `any`

```typescript
// ❌ DILARANG — any menghilangkan semua type safety
function processData(data: any) { ... }
const result: any = await fetchSomething()
const items = ref<any[]>([])

// ✅ Benar — gunakan unknown jika type tidak diketahui
function processData(data: unknown) {
  if (typeof data === 'string') {
    // TypeScript tahu data adalah string di sini
    return data.toUpperCase()
  }
}

// ✅ Benar — gunakan generic untuk flexible typing
function processData<T>(data: T): T { ... }

// ✅ Benar — gunakan Record untuk object dengan string keys
const metadata: Record<string, unknown> = {}

// ✅ Benar — gunakan type assertion setelah validasi
const apiData = data as Record<string, unknown>
if (typeof apiData.message === 'string') {
  showError(apiData.message)
}
```

### Enum vs Union Type

Prefer **union types** daripada TypeScript enums:

```typescript
// ✅ Preferred — union type (tree-shakeable, simpler)
type MessageRole = 'user' | 'assistant' | 'system'
type ConversationStatus = 'active' | 'ended'

// 🟡 Acceptable — const enum untuk kumpulan nilai yang benar-benar konstan
const enum HttpStatus {
  OK = 200,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

// ❌ Avoid — regular enum (adds runtime overhead)
enum MessageRoleEnum {
  User = 'user',
  Assistant = 'assistant',
  System = 'system',
}
```

### Zod untuk Runtime Validation

Gunakan Zod untuk validasi data dari external sources (API, form input):

```typescript
import { z } from 'zod'

// ✅ Define Zod schema
const widgetSettingsSchema = z.object({
  id: z.string().uuid(),
  primaryColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
  fontFamily: z.string().min(1),
  welcomeMessage: z.string().max(500),
  isEnabled: z.boolean(),
})

// ✅ Infer TypeScript type dari Zod schema
type WidgetSettings = z.infer<typeof widgetSettingsSchema>

// ✅ Validasi API response
function parseWidgetSettings(data: unknown): WidgetSettings {
  return widgetSettingsSchema.parse(data)
}

// ✅ Zod schema untuk API response wrapper
const apiResponseSchema = <T extends z.ZodType>(dataSchema: T) =>
  z.object({
    success: z.literal(true),
    statusCode: z.number(),
    message: z.string(),
    data: dataSchema,
  })

const widgetSettingsResponseSchema = apiResponseSchema(widgetSettingsSchema)
```

### Naming Conventions

| Item | Convention | Contoh |
|------|-----------|--------|
| Interfaces | PascalCase, deskriptif | `WidgetSettings`, `ChatMessage`, `ApiResponse<T>` |
| Types | PascalCase | `FormFieldType`, `ApiResult<T>`, `MessageRole` |
| No `I` prefix | — | ✅ `WidgetSettings`, ❌ ~~`IWidgetSettings`~~ |
| No `T` prefix (kecuali generics) | — | ✅ `WidgetSettings`, ❌ ~~`TWidgetSettings`~~ |
| Generics | Deskriptif | `TData`, `TResponse`, `TItem` |
| Variables | camelCase | `widgetSettings`, `chatMessages` |
| Constants | UPPER_SNAKE_CASE | `MAX_MESSAGE_LENGTH`, `API_TIMEOUT` |
| Functions | camelCase, verb prefix | `fetchSettings()`, `parseResponse()`, `formatDate()` |

### Contoh Interface Patterns

```typescript
/**
 * Base entity dengan timestamps — semua model dari API punya fields ini
 */
interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

/**
 * Chat message dari API
 */
interface ChatMessage extends BaseEntity {
  conversationId: string
  role: MessageRole
  content: string
}

/**
 * Payload untuk membuat message baru (tanpa server-generated fields)
 */
type CreateMessagePayload = Pick<ChatMessage, 'role' | 'content'>

/**
 * Generic API response wrapper
 */
interface ApiResponse<T> {
  success: true
  statusCode: number
  message: string
  data: T
}

/**
 * Paginated API response
 */
interface PaginatedApiResponse<T> extends ApiResponse<T[]> {
  meta: PaginationMeta
}
```

---

## 🔄 Composable Standards

### File Naming

Semua composable files mengikuti format `use<Name>.ts`:

```
composables/
├── useApi.ts            # API call utilities
├── useAuth.ts           # Authentication logic
├── useChat.ts           # Chat functionality
├── usePagination.ts     # Pagination helpers
└── useFormValidation.ts # Form validation helpers
```

### Structure & Rules

1. **Selalu return reactive refs dan functions**
2. **Gunakan `readonly()` untuk refs yang tidak boleh dimutasi dari luar**
3. **JSDoc comments pada semua public functions**
4. **Fokus pada satu concern** — jangan membuat composable yang terlalu besar

### Contoh Composable yang Benar ✅

```typescript
/**
 * useAuth Composable
 *
 * Menyediakan authentication logic termasuk login, logout,
 * dan akses ke auth state.
 *
 * @example
 *   const { user, isAuthenticated, login, logout } = useAuth()
 *   await login({ email: 'admin@example.com', password: 'secret' })
 */

import { AuthService } from '~/services'
import type { LoginPayload } from '~~/shared/types'

export function useAuth() {
  const authStore = useAuthStore()
  const router = useRouter()
  const { loading, error, execute } = useApi()

  /**
   * Login dengan email dan password.
   * Setelah berhasil, token disimpan ke store dan redirect ke dashboard.
   *
   * @param payload - Login credentials (email & password)
   * @throws ApiError jika credentials salah
   */
  async function login(payload: LoginPayload): Promise<void> {
    const result = await execute(() => AuthService.login(payload))
    if (result) {
      authStore.setToken(result.data.token)
      authStore.setUser(result.data.user)
      await router.push('/dashboard')
    }
  }

  /**
   * Logout user.
   * Menghapus token dari store dan redirect ke login page.
   */
  async function logout(): Promise<void> {
    authStore.clearAuth()
    await router.push('/login')
  }

  /**
   * Check apakah user sudah login.
   * Berguna untuk conditional rendering.
   */
  const isAuthenticated = computed(() => authStore.isAuthenticated)

  /**
   * Current user data (readonly).
   */
  const user = computed(() => authStore.user)

  return {
    // State (readonly)
    user,
    isAuthenticated,
    loading,
    error,
    // Actions
    login,
    logout,
  }
}
```

### Composable dengan Reactive Data ✅

```typescript
/**
 * usePagination Composable
 *
 * Menyediakan reactive pagination state dan helpers.
 *
 * @param initialPerPage - Jumlah item per page (default: 10)
 *
 * @example
 *   const { page, perPage, paginationParams, setMeta } = usePagination(15)
 *   const result = await service.getAll(paginationParams.value)
 *   setMeta(result.meta)
 */

import type { PaginationMeta, PaginationParams } from '~~/shared/types'

export function usePagination(initialPerPage = 10) {
  const page = ref(1)
  const perPage = ref(initialPerPage)
  const total = ref(0)
  const lastPage = ref(1)

  /** Query params untuk API call */
  const paginationParams = computed<PaginationParams>(() => ({
    page: page.value,
    perPage: perPage.value,
  }))

  /** Apakah ada halaman berikutnya */
  const hasNextPage = computed(() => page.value < lastPage.value)

  /** Apakah ada halaman sebelumnya */
  const hasPreviousPage = computed(() => page.value > 1)

  /**
   * Update pagination meta dari API response
   */
  function setMeta(meta: PaginationMeta): void {
    total.value = meta.total
    lastPage.value = meta.lastPage
    perPage.value = meta.perPage
  }

  /**
   * Go to specific page
   */
  function goToPage(targetPage: number): void {
    if (targetPage >= 1 && targetPage <= lastPage.value) {
      page.value = targetPage
    }
  }

  /**
   * Reset pagination ke halaman 1
   */
  function reset(): void {
    page.value = 1
    total.value = 0
    lastPage.value = 1
  }

  return {
    // State (readonly)
    page: readonly(page),
    perPage: readonly(perPage),
    total: readonly(total),
    lastPage: readonly(lastPage),
    // Computed
    paginationParams,
    hasNextPage,
    hasPreviousPage,
    // Actions
    setMeta,
    goToPage,
    reset,
  }
}
```

---

## 🌐 Service Class Standards

### Naming & Structure

| Aturan | Contoh |
|--------|--------|
| PascalCase + `Service` suffix | `AuthService`, `ChatService`, `WidgetSettingsService` |
| Satu file per service | `app/services/AuthService.ts` |
| Extends `BaseApiService` | `class AuthService extends BaseApiService` |
| Export singleton instance | `export default new AuthService()` |

### Contoh Service yang Benar ✅

```typescript
/**
 * Knowledge Service
 *
 * API service untuk Knowledge Base management.
 * Menangani CRUD operations untuk knowledge categories dan entries.
 *
 * @see docs/swagger.yml — /knowledge-categories, /knowledge-bases
 */

import { z } from 'zod'
import { BaseApiService } from './BaseApiService'
import type {
  ApiResponse,
  PaginatedApiResponse,
  PaginationParams,
} from '~~/shared/types'

/** Zod schema untuk knowledge category */
const knowledgeCategorySchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  description: z.string().nullable(),
  entryCount: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

/** TypeScript type inferred dari schema */
type KnowledgeCategory = z.infer<typeof knowledgeCategorySchema>

/** Payload untuk create/update category */
interface CreateCategoryPayload {
  name: string
  description?: string
}

class KnowledgeService extends BaseApiService {
  /**
   * Get authentication token dari auth store.
   * Override dari BaseApiService untuk dashboard auth.
   */
  protected override getAuthToken(): string | null {
    try {
      const authStore = useAuthStore()
      return authStore.token
    }
    catch {
      return null
    }
  }

  /**
   * Fetch all knowledge categories (paginated).
   *
   * @param params - Pagination dan search parameters
   * @returns Paginated list of knowledge categories
   */
  async getCategories(params?: PaginationParams): Promise<PaginatedApiResponse<KnowledgeCategory>> {
    return this.getPaginated<KnowledgeCategory>('/knowledge-categories', { params })
  }

  /**
   * Fetch a single knowledge category by ID.
   *
   * @param id - Category UUID
   * @returns Single knowledge category
   */
  async getCategory(id: string): Promise<ApiResponse<KnowledgeCategory>> {
    return this.get<KnowledgeCategory>(`/knowledge-categories/${id}`)
  }

  /**
   * Create a new knowledge category.
   *
   * @param payload - Category data
   * @returns Created knowledge category
   */
  async createCategory(payload: CreateCategoryPayload): Promise<ApiResponse<KnowledgeCategory>> {
    return this.post<KnowledgeCategory>('/knowledge-categories', payload)
  }

  /**
   * Update an existing knowledge category.
   *
   * @param id - Category UUID
   * @param payload - Updated category data
   * @returns Updated knowledge category
   */
  async updateCategory(id: string, payload: CreateCategoryPayload): Promise<ApiResponse<KnowledgeCategory>> {
    return this.put<KnowledgeCategory>(`/knowledge-categories/${id}`, payload)
  }

  /**
   * Delete a knowledge category.
   *
   * @param id - Category UUID
   * @returns Deletion confirmation
   */
  async deleteCategory(id: string): Promise<ApiResponse<null>> {
    return this.delete<null>(`/knowledge-categories/${id}`)
  }
}

export default new KnowledgeService()
```

### BaseApiService Methods

Semua service mewarisi method berikut dari `BaseApiService`:

| Method | Signature | Deskripsi |
|--------|-----------|-----------|
| `get<T>()` | `get<T>(url, config?): Promise<ApiResponse<T>>` | GET request |
| `getPaginated<T>()` | `getPaginated<T>(url, config?): Promise<PaginatedApiResponse<T>>` | GET paginated |
| `post<T>()` | `post<T>(url, data?, config?): Promise<ApiResponse<T>>` | POST request |
| `put<T>()` | `put<T>(url, data?, config?): Promise<ApiResponse<T>>` | PUT request |
| `delete<T>()` | `delete<T>(url, config?): Promise<ApiResponse<T>>` | DELETE request |

### Barrel Export

Semua services di-export melalui `app/services/index.ts`:

```typescript
/**
 * Services — Barrel Export
 *
 * Re-exports semua API service instances.
 * Usage: import { AuthService, KnowledgeService } from '~/services'
 */
export { default as AuthService } from './AuthService'
export { default as KnowledgeService } from './KnowledgeService'
export { default as WidgetSettingsService } from './WidgetSettingsService'
// ... dan seterusnya
```

---

## 🏪 Store Standards (Pinia)

### File Naming

```
stores/
├── useAppStore.ts            # Global app state
├── useAuthStore.ts           # Authentication state
├── useChatStore.ts           # Chat widget state
├── useWidgetSettingsStore.ts # Widget settings cache
└── useConversationStore.ts   # Conversation state
```

### Wajib Composition API Style

**SELALU** gunakan Composition API style (setup function), **BUKAN** Options API:

```typescript
// ✅ Benar — Composition API style
export const useExampleStore = defineStore('example', () => {
  // state, getters, actions di sini
})

// ❌ Salah — Options API style
export const useExampleStore = defineStore('example', {
  state: () => ({ ... }),
  getters: { ... },
  actions: { ... },
})
```

### Store Structure Order

```
1. JSDoc file header comment
2. State (ref, reactive)
3. Getters (computed)
4. Actions (functions)
5. Return statement (grouped by category)
```

### Contoh Store yang Benar ✅

```typescript
/**
 * Auth Store
 *
 * Manages authentication state including JWT token and user data.
 * Token disimpan di memory (ref) — untuk persistence, gunakan plugin
 * atau localStorage wrapper.
 *
 * @example
 *   const authStore = useAuthStore()
 *   authStore.setToken('jwt-token-here')
 *   console.log(authStore.isAuthenticated) // true
 */

import type { User } from '~~/shared/types'

export const useAuthStore = defineStore('auth', () => {
  // ============================================
  // State
  // ============================================

  /** JWT authentication token */
  const token = ref<string | null>(null)

  /** Current authenticated user data */
  const user = ref<User | null>(null)

  // ============================================
  // Getters
  // ============================================

  /** Whether the user is authenticated */
  const isAuthenticated = computed(() => !!token.value)

  /** User's display name, fallback to email */
  const displayName = computed(() => {
    if (!user.value) return ''
    return user.value.name || user.value.email
  })

  // ============================================
  // Actions
  // ============================================

  /**
   * Set authentication token
   *
   * @param newToken - JWT token dari API response
   */
  function setToken(newToken: string): void {
    token.value = newToken
  }

  /**
   * Set authenticated user data
   *
   * @param newUser - User data dari API response
   */
  function setUser(newUser: User): void {
    user.value = newUser
  }

  /**
   * Clear all authentication data (logout)
   */
  function clearAuth(): void {
    token.value = null
    user.value = null
  }

  // ============================================
  // Return
  // ============================================

  return {
    // State
    token: readonly(token),
    user: readonly(user),
    // Getters
    isAuthenticated,
    displayName,
    // Actions
    setToken,
    setUser,
    clearAuth,
  }
})
```

### State Mutability Rules

- **Internal mutation** — state di-mutasi hanya melalui actions (functions)
- **External readonly** — expose state sebagai `readonly()` di return statement
- **Exception** — jika state perlu di-mutasi langsung dari component (misal form binding), boleh expose tanpa `readonly()`

```typescript
// ✅ State yang tidak boleh dimutasi dari luar
return {
  token: readonly(token),        // Hanya bisa diubah via setToken()
  user: readonly(user),          // Hanya bisa diubah via setUser()
}

// ✅ State yang boleh dimutasi langsung (untuk v-model binding)
return {
  searchQuery,                   // Bisa langsung v-model dari component
  selectedFilter,                // Bisa langsung diubah dari component
}
```

---

## 📁 File Organization Rules

### Prinsip Umum

1. **Satu component per file** — jangan gabungkan multiple components dalam satu file
2. **Group by feature/domain** — bukan by type
3. **Barrel exports** untuk services dan types
4. **Utils harus pure functions** — tanpa side effects
5. **Composables fokus pada satu concern**

### Component Organization

```
components/
├── common/                     # Shared across all features
│   ├── CommonLoadingState.vue  # Loading spinner/skeleton
│   ├── CommonEmptyState.vue    # Empty data placeholder
│   ├── CommonErrorState.vue    # Error display with retry
│   └── CommonConfirmDialog.vue # Confirmation modal
│
├── dashboard/                  # Dashboard-specific
│   ├── DashboardSidebar.vue
│   ├── DashboardNavbar.vue
│   ├── settings/               # Sub-feature grouping
│   │   ├── DashboardSettingsWidgetForm.vue
│   │   └── DashboardSettingsChatbotForm.vue
│   ├── knowledge/
│   │   ├── DashboardKnowledgeCategoryList.vue
│   │   └── DashboardKnowledgeEntryTable.vue
│   └── conversations/
│       ├── DashboardConversationsTable.vue
│       └── DashboardConversationsDetail.vue
│
└── widget/                     # Widget-specific
    ├── WidgetChatWindow.vue
    ├── WidgetMessageBubble.vue
    ├── WidgetPreChatForm.vue
    └── WidgetTypingIndicator.vue
```

### Type Organization

```
shared/types/
├── api.ts              # ApiResponse, PaginationMeta, dll.
├── enums.ts            # FormFieldType, MessageRole, dll.
├── auth.ts             # User, LoginPayload, AuthData
├── widget-settings.ts  # WidgetSettings, UpdateWidgetSettingsPayload
├── chatbot-settings.ts # ChatbotSettings
├── form-field.ts       # FormField
├── knowledge.ts        # KnowledgeCategory, KnowledgeBase
├── conversation.ts     # Conversation, Message
├── session.ts          # ChatSession
└── index.ts            # Barrel export semua types
```

---

## 📦 Import Rules

### Auto-Imported (JANGAN Manual Import)

Nuxt auto-imports hal-hal berikut — **JANGAN** import secara manual:

```typescript
// ❌ JANGAN lakukan ini — sudah auto-imported
import { ref, computed, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { defineStore, storeToRefs } from 'pinia'
import { useRuntimeConfig } from '#app'

// ✅ Langsung gunakan tanpa import
const count = ref(0)
const double = computed(() => count.value * 2)
const router = useRouter()
const config = useRuntimeConfig()
```

Yang auto-imported oleh Nuxt:
- **Vue APIs**: `ref`, `reactive`, `computed`, `watch`, `watchEffect`, `onMounted`, `onUnmounted`, dll.
- **Vue Router**: `useRouter`, `useRoute`, `navigateTo`, `definePageMeta`
- **Nuxt**: `useRuntimeConfig`, `useAppConfig`, `useSeoMeta`, `useToast`, `useState`
- **Components**: Semua file di `app/components/` (otomatis tersedia di template)
- **Composables**: Semua file di `app/composables/` (otomatis tersedia)
- **Utils**: Semua file di `app/utils/` (otomatis tersedia)
- **Pinia**: `defineStore`, `storeToRefs` (dikonfigurasi di `nuxt.config.ts`)

### Explicit Imports (HARUS Manual Import)

```typescript
// ✅ Services — harus explicit import
import { AuthService, KnowledgeService } from '~/services'
import { ApiError } from '~/services/ApiError'

// ✅ External libraries — harus explicit import
import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios'
import { z } from 'zod'

// ✅ Types dari shared — harus explicit import
import type { ApiResponse, PaginatedApiResponse } from '~~/shared/types'
import type { ChatMessage, User } from '~~/shared/types'
```

### Path Aliases

| Alias | Resolves To | Digunakan Untuk |
|-------|-------------|-----------------|
| `~` atau `~/` | `app/` | Imports dari dalam app directory |
| `~~` atau `~~/` | Root project | Imports dari shared, root configs |
| `~~/shared/types` | `shared/types/` | Shared type definitions |

```typescript
// ✅ Contoh penggunaan alias
import { AuthService } from '~/services'          // → app/services
import { ApiError } from '~/services/ApiError'     // → app/services/ApiError
import type { User } from '~~/shared/types'        // → shared/types
import type { ApiResponse } from '~~/shared/types' // → shared/types
```

---

## ⚠️ Error Handling Pattern

### Prinsip Error Handling

1. **Service layer** — throw `ApiError` (otomatis via interceptors)
2. **Store/Composable layer** — catch error, simpan ke reactive state
3. **Component layer** — render error UI berdasarkan state

### Menggunakan `useApi()` Composable

Pattern yang direkomendasikan untuk semua API calls:

```typescript
// Di composable atau component
const { loading, error, execute } = useApi({
  showErrorToast: true,      // Otomatis tampilkan toast saat error
  showSuccessToast: true,    // Otomatis tampilkan toast saat sukses
  successMessage: 'Data berhasil disimpan',
})

// Panggil API
const result = await execute(() => KnowledgeService.getCategories())
if (result) {
  // Handle success — result sudah typed
  categories.value = result.data
}
```

### Manual Try-Catch Pattern

Untuk kasus yang membutuhkan handling lebih spesifik:

```typescript
import { ApiError } from '~/services/ApiError'

async function submitForm(): Promise<void> {
  loading.value = true
  error.value = null

  try {
    const result = await KnowledgeService.createCategory(payload)
    categories.value.push(result.data)

    toast.add({
      title: 'Success',
      description: 'Category created successfully',
      icon: 'i-lucide-check-circle',
      color: 'success',
    })
  }
  catch (err) {
    if (err instanceof ApiError) {
      error.value = err.message

      // Handle validation errors (422)
      if (err.isValidationError && err.errors) {
        fieldErrors.value = err.errors
      }

      // Handle auth errors (401) — sudah di-handle di interceptor
      // Handle not found (404)
      if (err.isNotFoundError) {
        await navigateTo('/dashboard')
      }
    }
    else {
      error.value = 'An unexpected error occurred'
    }
  }
  finally {
    loading.value = false
  }
}
```

### Component Error States

Setiap component yang fetch data **WAJIB** handle 3 state:

```vue
<template>
  <!-- 1. Loading State -->
  <CommonLoadingState v-if="loading" />

  <!-- 2. Error State -->
  <CommonErrorState
    v-else-if="error"
    :message="error"
    @retry="fetchData"
  />

  <!-- 3. Empty State -->
  <CommonEmptyState
    v-else-if="items.length === 0"
    title="No data found"
    description="Start by creating your first item."
    icon="i-lucide-inbox"
  />

  <!-- 4. Data State -->
  <div v-else>
    <!-- Render data -->
  </div>
</template>
```

### Toast Notifications

Gunakan `useToast()` untuk notifikasi user-facing:

```typescript
const toast = useToast()

// ✅ Success toast
toast.add({
  title: 'Success',
  description: 'Settings saved successfully',
  icon: 'i-lucide-check-circle',
  color: 'success',
})

// ✅ Error toast
toast.add({
  title: 'Error',
  description: 'Failed to save settings',
  icon: 'i-lucide-alert-circle',
  color: 'error',
})

// ✅ Warning toast
toast.add({
  title: 'Warning',
  description: 'Session will expire in 5 minutes',
  icon: 'i-lucide-alert-triangle',
  color: 'warning',
})
```

---

## 📖 Comment & Documentation Standards

### File Header Comment (Wajib)

Setiap file **HARUS** memiliki JSDoc header comment yang menjelaskan:

```typescript
/**
 * Auth Service
 *
 * API service for authentication operations.
 * Handles login, register, logout, and token refresh.
 *
 * @see docs/swagger.yml — /auth endpoints
 */
```

```vue
<script setup lang="ts">
/**
 * Dashboard Widget Settings Page
 *
 * Halaman konfigurasi widget settings di dashboard admin.
 * Menampilkan form untuk mengatur tampilan widget chat.
 *
 * @route /dashboard/widget-settings
 * @layout dashboard
 * @middleware auth
 */
</script>
```

### Public Function JSDoc (Wajib)

Setiap public function **HARUS** memiliki JSDoc dengan `@param` dan `@returns`:

```typescript
/**
 * Format date string to localized Indonesian format.
 *
 * @param date - ISO date string or Date object
 * @returns Formatted date string (e.g., "14 Juni 2026")
 *
 * @example
 *   formatDate('2026-06-14T10:30:00Z')
 *   // → "14 Juni 2026"
 */
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date))
}
```

### Inline Comments

Gunakan inline comments untuk logic yang **tidak langsung jelas**:

```typescript
// ✅ Benar — menjelaskan WHY, bukan WHAT
// Delay 100ms to ensure DOM is updated before scrolling
await nextTick()
setTimeout(() => scrollToBottom(), 100)

// Backend returns dates in UTC, convert to local timezone for display
const localDate = new Date(utcDateString + 'Z')

// ❌ Salah — hanya menjelaskan WHAT (sudah jelas dari kode)
// Set loading to true
loading.value = true

// Push item to array
items.value.push(newItem)
```

### Template Comments

Gunakan HTML comments di template untuk section yang tidak obvious:

```vue
<template>
  <div class="space-y-6">
    <!-- Page header with title and action buttons -->
    <div class="flex items-center justify-between">
      ...
    </div>

    <!-- Filter bar — only visible when there are items -->
    <div v-if="hasItems" class="flex gap-3">
      ...
    </div>

    <!-- Main content area with loading/error/empty/data states -->
    <CommonLoadingState v-if="loading" />
    ...
  </div>
</template>
```

### Comment Style Guide

| Jenis | Format | Contoh |
|-------|--------|--------|
| File header | `/** ... */` (JSDoc) | Deskripsi file, @see, @example |
| Public function | `/** ... */` (JSDoc) | @param, @returns, @throws, @example |
| Inline | `// ...` | Penjelasan singkat satu baris |
| Section divider | `// ====` | Memisahkan state, getters, actions di store |
| TODO/FIXME | `// TODO:` / `// FIXME:` | Task yang perlu dikerjakan nanti |
| Template | `<!-- ... -->` | Section labels di template |

---

## 📚 Referensi

- [Vue Style Guide](https://vuejs.org/style-guide/)
- [NuxtUI Components](https://ui.nuxt.com/components)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [Zod Documentation](https://zod.dev/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [ARCHITECTURE.md](../ARCHITECTURE.md) — Arsitektur project
- [CONTRIBUTING.md](../CONTRIBUTING.md) — Panduan kontribusi
