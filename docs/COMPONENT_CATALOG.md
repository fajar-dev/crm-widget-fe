# 📦 Component Catalog — NuxtUI Cheat Sheet

> **DOKUMEN PALING PENTING** untuk menjaga konsistensi UI.
> Semua AI agent dan developer WAJIB merujuk ke dokumen ini saat membuat atau memodifikasi komponen.

---

## ⚠️ Aturan Utama

1. **WAJIB** gunakan NuxtUI components — JANGAN PERNAH pakai native HTML elements untuk UI
2. **DILARANG KERAS** hardcode CSS values — HANYA gunakan Tailwind utility classes standar
3. **WAJIB** gunakan icon format `i-lucide-<name>` dari `@iconify-json/lucide`
4. **WAJIB** gunakan Zod schema untuk form validation
5. Semua components auto-imported — JANGAN manual import

---

## 📑 Daftar Isi

- [Layout & Container](#-layout--container)
- [Navigation](#-navigation)
- [Forms & Input](#-forms--input)
- [Buttons & Actions](#-buttons--actions)
- [Data Display](#-data-display)
- [Feedback](#-feedback)
- [Overlay](#-overlay)
- [Icons](#-icons)
- [Color System](#-color-system)
- [Form Validation dengan Zod](#-form-validation-dengan-zod)
- [Common Patterns](#-common-patterns)
- [DILARANG — Common Mistakes](#-dilarang--common-mistakes)

---

## 📐 Layout & Container

### UApp

**Root wrapper** — WAJIB membungkus seluruh aplikasi.

**Kapan digunakan:** Sekali saja di `app.vue`. Menyediakan context untuk toasts, overlays, color-mode, dan tooltip provider.

```vue
<!-- app/app.vue -->
<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
```

| Fitur yang disediakan | Composable |
|---|---|
| Toast notifications | `useToast()` |
| Overlay/Modal system | `useOverlay()` |
| Color mode (dark/light) | `useColorMode()` |
| Tooltip provider | Otomatis |

> **⚠️ PENTING:** Tanpa `UApp`, `useToast()` dan `useOverlay()` TIDAK akan bekerja.

---

### UCard

**Content container** dengan header/body/footer slots.

**Kapan digunakan:** Settings panels, info boxes, form containers, detail views, widget panels.

```vue
<!-- Basic Card -->
<UCard>
  <template #header>
    <h3 class="text-lg font-semibold">Judul Card</h3>
  </template>

  <p>Konten utama card di sini.</p>

  <template #footer>
    <div class="flex justify-end gap-2">
      <UButton variant="ghost" label="Batal" />
      <UButton label="Simpan" />
    </div>
  </template>
</UCard>
```

**Props umum:**

| Prop | Type | Default | Keterangan |
|---|---|---|---|
| `variant` | `'outline' \| 'soft' \| 'subtle'` | — | Visual variant |
| `color` | `string` | — | Color theme |

**Slots:**

| Slot | Keterangan |
|---|---|
| `header` | Area header card |
| `default` | Body/konten utama |
| `footer` | Area footer card |

**✅ DO:**
```vue
<UCard>
  <template #header>
    <div class="flex items-center justify-between">
      <h3 class="text-lg font-semibold">Settings</h3>
      <UBadge label="Active" color="success" />
    </div>
  </template>
  <p>Card content</p>
</UCard>
```

**❌ DON'T:**
```vue
<!-- JANGAN: Bikin card manual dengan div + border -->
<div class="border rounded-lg p-[20px] shadow-md">
  <h3>Settings</h3>
  <p>Card content</p>
</div>
```

---

### UContainer

**Page-level container** dengan max-width.

**Kapan digunakan:** Wrapper konten halaman agar centered dengan max-width yang konsisten.

```vue
<UContainer>
  <h1 class="text-2xl font-bold">Halaman Dashboard</h1>
  <p>Konten halaman di sini...</p>
</UContainer>
```

**Props umum:**

| Prop | Type | Keterangan |
|---|---|---|
| `as` | `string` | HTML element (default: `div`) |

---

### UDashboardPanel

**Dashboard panel** layout component.

**Kapan digunakan:** Membuat panel-panel pada layout dashboard (sidebar, main content, detail panel).

```vue
<template>
  <div class="flex h-screen">
    <UDashboardPanel collapsible>
      <!-- Sidebar content -->
      <UNavigationMenu :items="menuItems" />
    </UDashboardPanel>

    <UDashboardPanel grow>
      <!-- Main content -->
      <NuxtPage />
    </UDashboardPanel>
  </div>
</template>
```

**Props umum:**

| Prop | Type | Keterangan |
|---|---|---|
| `collapsible` | `boolean` | Bisa di-collapse |
| `grow` | `boolean` | Mengisi sisa ruang |
| `resizable` | `boolean` | Bisa di-resize user |

---

## 🧭 Navigation

### UNavigationMenu

**Main navigation** menu untuk sidebar/topbar.

**Kapan digunakan:** Sidebar navigation dashboard, top navigation bar.

```vue
<script setup lang="ts">
const items = [
  {
    label: 'Dashboard',
    icon: 'i-lucide-layout-dashboard',
    to: '/dashboard',
  },
  {
    label: 'Conversations',
    icon: 'i-lucide-message-square',
    to: '/dashboard/conversations',
  },
  {
    label: 'Settings',
    icon: 'i-lucide-settings',
    children: [
      {
        label: 'Widget',
        icon: 'i-lucide-palette',
        to: '/dashboard/widget-settings',
      },
      {
        label: 'Chatbot',
        icon: 'i-lucide-bot',
        to: '/dashboard/chatbot-settings',
      },
    ],
  },
]
</script>

<template>
  <UNavigationMenu :items="items" orientation="vertical" />
</template>
```

**Props umum:**

| Prop | Type | Keterangan |
|---|---|---|
| `items` | `NavigationMenuItem[]` | Array menu items |
| `orientation` | `'horizontal' \| 'vertical'` | Arah menu |

---

### UBreadcrumb

**Breadcrumb navigation** — menunjukkan posisi di hierarchy halaman.

**Kapan digunakan:** Setiap halaman dashboard yang punya parent page.

```vue
<script setup lang="ts">
const breadcrumbItems = [
  { label: 'Dashboard', icon: 'i-lucide-home', to: '/dashboard' },
  { label: 'Knowledge Base', to: '/dashboard/knowledge' },
  { label: 'Category Detail' },
]
</script>

<template>
  <UBreadcrumb :items="breadcrumbItems" />
</template>
```

---

### UTabs

**Tab navigation** dalam satu halaman.

**Kapan digunakan:** Memisahkan konten dalam satu halaman menjadi beberapa tab (misalnya General / Advanced / Preview).

```vue
<script setup lang="ts">
const tabs = [
  { label: 'General', icon: 'i-lucide-settings', value: 'general' },
  { label: 'Appearance', icon: 'i-lucide-palette', value: 'appearance' },
  { label: 'Advanced', icon: 'i-lucide-code', value: 'advanced' },
]
</script>

<template>
  <UTabs :items="tabs" class="w-full">
    <template #general>
      <p>General settings content</p>
    </template>
    <template #appearance>
      <p>Appearance settings content</p>
    </template>
    <template #advanced>
      <p>Advanced settings content</p>
    </template>
  </UTabs>
</template>
```

**Props umum:**

| Prop | Type | Keterangan |
|---|---|---|
| `items` | `TabItem[]` | Array tab items |
| `defaultValue` | `string` | Tab aktif default |
| `variant` | `'pill' \| 'link'` | Visual variant |
| `orientation` | `'horizontal' \| 'vertical'` | Arah tab |

---

### UPagination

**Paginated data navigation** — navigasi antar halaman data.

**Kapan digunakan:** Tabel data atau list yang menggunakan server-side pagination.

```vue
<script setup lang="ts">
const currentPage = ref(1)
const totalItems = ref(150)
const itemsPerPage = ref(10)
</script>

<template>
  <UPagination
    v-model="currentPage"
    :total="totalItems"
    :items-per-page="itemsPerPage"
  />
</template>
```

**Props umum:**

| Prop | Type | Keterangan |
|---|---|---|
| `modelValue` | `number` | Halaman aktif (v-model) |
| `total` | `number` | Total items |
| `itemsPerPage` | `number` | Items per halaman |
| `showEdges` | `boolean` | Tampilkan first/last buttons |

---

## 📝 Forms & Input

### UForm

**Form wrapper** dengan integrasi Zod validation.

**Kapan digunakan:** SELALU gunakan untuk form apapun. Integrasi langsung dengan Zod schema untuk validasi otomatis.

```vue
<script setup lang="ts">
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Nama wajib diisi'),
  email: z.string().email('Format email tidak valid'),
})

type FormData = z.infer<typeof schema>

const state = reactive<FormData>({
  name: '',
  email: '',
})

async function onSubmit() {
  // state sudah tervalidasi di sini
  console.log('Valid data:', state)
}
</script>

<template>
  <UForm :schema="schema" :state="state" @submit="onSubmit">
    <UFormField label="Nama" name="name">
      <UInput v-model="state.name" placeholder="Masukkan nama" />
    </UFormField>

    <UFormField label="Email" name="email">
      <UInput v-model="state.email" type="email" placeholder="user@example.com" />
    </UFormField>

    <UButton type="submit" label="Simpan" />
  </UForm>
</template>
```

**Props umum:**

| Prop | Type | Keterangan |
|---|---|---|
| `schema` | `ZodSchema` | Zod validation schema |
| `state` | `object` | Reactive form state |
| `validate-on` | `string[]` | Kapan validasi ('blur', 'change', 'submit') |

> **⚠️ PENTING:** `name` di `UFormField` HARUS sama dengan key di Zod schema agar error messages tampil otomatis.

---

### UFormField

**Form field wrapper** dengan label dan error display.

**Kapan digunakan:** Membungkus setiap input field di dalam `<UForm>`. Menampilkan label dan error message otomatis.

```vue
<UFormField label="Username" name="username" description="Minimal 3 karakter" required>
  <UInput v-model="state.username" placeholder="john_doe" />
</UFormField>
```

**Props umum:**

| Prop | Type | Keterangan |
|---|---|---|
| `label` | `string` | Label field |
| `name` | `string` | Nama field (match Zod schema key) |
| `description` | `string` | Help text di bawah input |
| `required` | `boolean` | Tampilkan indikator required (*) |
| `hint` | `string` | Hint text di kanan label |

---

### UInput

**Text input** — pengganti native `<input>`.

**Kapan digunakan:** SELALU gunakan ini, BUKAN `<input type="text">` atau `<input>`.

```vue
<!-- Basic -->
<UInput v-model="value" placeholder="Masukkan teks" />

<!-- Dengan icon -->
<UInput v-model="search" icon="i-lucide-search" placeholder="Cari..." />

<!-- Dengan trailing icon -->
<UInput v-model="password" type="password" trailing-icon="i-lucide-eye" />

<!-- Disabled -->
<UInput v-model="readonlyValue" disabled />

<!-- Sizes -->
<UInput v-model="value" size="sm" />
<UInput v-model="value" size="md" />
<UInput v-model="value" size="lg" />
```

**Props umum:**

| Prop | Type | Keterangan |
|---|---|---|
| `modelValue` | `string \| number` | Value (v-model) |
| `type` | `string` | Input type: text, email, password, url |
| `placeholder` | `string` | Placeholder text |
| `icon` | `string` | Leading icon |
| `trailing-icon` | `string` | Trailing icon |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | Ukuran |
| `color` | `string` | Color theme |
| `variant` | `string` | Visual variant |
| `disabled` | `boolean` | Disabled state |
| `loading` | `boolean` | Loading state |

---

### UTextarea

**Multiline text** — pengganti native `<textarea>`.

```vue
<UTextarea
  v-model="description"
  placeholder="Masukkan deskripsi..."
  :rows="4"
  autoresize
/>
```

**Props umum:**

| Prop | Type | Keterangan |
|---|---|---|
| `modelValue` | `string` | Value (v-model) |
| `rows` | `number` | Jumlah baris default |
| `autoresize` | `boolean` | Auto resize sesuai konten |
| `maxrows` | `number` | Maksimum baris (dengan autoresize) |

---

### USelect

**Dropdown select** — pengganti native `<select>`.

**Kapan digunakan:** Pilihan sederhana dari daftar opsi.

```vue
<script setup lang="ts">
const selectedColor = ref('')
const colorOptions = [
  { label: 'Merah', value: 'red' },
  { label: 'Biru', value: 'blue' },
  { label: 'Hijau', value: 'green' },
]
</script>

<template>
  <USelect
    v-model="selectedColor"
    :items="colorOptions"
    placeholder="Pilih warna"
  />
</template>
```

**Props umum:**

| Prop | Type | Keterangan |
|---|---|---|
| `modelValue` | `any` | Value (v-model) |
| `items` | `SelectItem[]` | Array pilihan |
| `placeholder` | `string` | Placeholder |
| `value-key` | `string` | Key untuk value (default: `'value'`) |
| `label-key` | `string` | Key untuk label (default: `'label'`) |

---

### USelectMenu

**Searchable select** — versi lebih canggih dari USelect.

**Kapan digunakan:** Daftar pilihan yang banyak dan perlu fitur pencarian, multi-select, atau async loading.

```vue
<script setup lang="ts">
const selectedUsers = ref([])
const users = ref([
  { id: 1, name: 'John Doe', avatar: '/avatars/john.png' },
  { id: 2, name: 'Jane Smith', avatar: '/avatars/jane.png' },
])
</script>

<template>
  <USelectMenu
    v-model="selectedUsers"
    :items="users"
    placeholder="Pilih user"
    searchable
    multiple
    value-key="id"
    label-key="name"
  />
</template>
```

**Props tambahan vs USelect:**

| Prop | Type | Keterangan |
|---|---|---|
| `searchable` | `boolean` | Aktifkan pencarian |
| `multiple` | `boolean` | Multi-select |
| `search-placeholder` | `string` | Placeholder di search box |

---

### UCheckbox

**Checkbox** — pengganti native `<input type="checkbox">`.

```vue
<UCheckbox v-model="agreed" label="Saya setuju dengan syarat dan ketentuan" />
```

**Props umum:**

| Prop | Type | Keterangan |
|---|---|---|
| `modelValue` | `boolean` | Value (v-model) |
| `label` | `string` | Label text |
| `description` | `string` | Description text |
| `disabled` | `boolean` | Disabled state |

---

### URadioGroup

**Radio buttons** — untuk memilih satu dari beberapa opsi.

```vue
<script setup lang="ts">
const selectedPlan = ref('basic')
const plans = [
  { label: 'Basic', value: 'basic', description: 'Untuk pemula' },
  { label: 'Pro', value: 'pro', description: 'Untuk bisnis' },
  { label: 'Enterprise', value: 'enterprise', description: 'Untuk korporat' },
]
</script>

<template>
  <URadioGroup v-model="selectedPlan" :items="plans" />
</template>
```

---

### USwitch

**Toggle switch** — untuk on/off settings.

```vue
<USwitch v-model="isEnabled" label="Aktifkan fitur chatbot" />
```

**Props umum:**

| Prop | Type | Keterangan |
|---|---|---|
| `modelValue` | `boolean` | Value (v-model) |
| `label` | `string` | Label text |
| `disabled` | `boolean` | Disabled state |
| `loading` | `boolean` | Loading state |

---

### UInputNumber

**Number input** — dengan tombol increment/decrement.

```vue
<UInputNumber
  v-model="quantity"
  :min="1"
  :max="100"
  :step="1"
  placeholder="Jumlah"
/>
```

**Props umum:**

| Prop | Type | Keterangan |
|---|---|---|
| `modelValue` | `number` | Value (v-model) |
| `min` | `number` | Nilai minimum |
| `max` | `number` | Nilai maksimum |
| `step` | `number` | Step increment/decrement |

---

## 🔘 Buttons & Actions

### UButton

**Primary action button** — pengganti native `<button>`.

**Kapan digunakan:** SELALU gunakan ini, BUKAN `<button>`. Untuk semua tombol aksi.

```vue
<!-- Variants -->
<UButton label="Primary" />
<UButton label="Outline" variant="outline" />
<UButton label="Soft" variant="soft" />
<UButton label="Subtle" variant="subtle" />
<UButton label="Ghost" variant="ghost" />
<UButton label="Link" variant="link" />

<!-- Colors -->
<UButton label="Success" color="success" />
<UButton label="Warning" color="warning" />
<UButton label="Error" color="error" />
<UButton label="Neutral" color="neutral" />

<!-- Sizes -->
<UButton label="Extra Small" size="xs" />
<UButton label="Small" size="sm" />
<UButton label="Medium" size="md" />
<UButton label="Large" size="lg" />
<UButton label="Extra Large" size="xl" />

<!-- Dengan icon -->
<UButton icon="i-lucide-plus" label="Tambah Data" />
<UButton icon="i-lucide-trash-2" label="Hapus" color="error" variant="soft" />
<UButton icon="i-lucide-download" label="Export" variant="outline" />

<!-- Icon only (square) -->
<UButton icon="i-lucide-pencil" variant="ghost" />

<!-- Loading state -->
<UButton label="Menyimpan..." loading />

<!-- Disabled -->
<UButton label="Tidak aktif" disabled />

<!-- As link -->
<UButton label="Lihat Detail" to="/dashboard/detail" variant="link" />
```

**Props umum:**

| Prop | Type | Keterangan |
|---|---|---|
| `label` | `string` | Button text |
| `icon` | `string` | Leading icon |
| `trailing-icon` | `string` | Trailing icon |
| `variant` | `'solid' \| 'outline' \| 'soft' \| 'subtle' \| 'ghost' \| 'link'` | Visual variant |
| `color` | `'primary' \| 'secondary' \| 'success' \| 'info' \| 'warning' \| 'error' \| 'neutral'` | Color theme |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | Ukuran |
| `loading` | `boolean` | Loading state |
| `disabled` | `boolean` | Disabled state |
| `to` | `string` | Router link (render sebagai `<NuxtLink>`) |
| `block` | `boolean` | Full width |

**✅ DO:**
```vue
<UButton icon="i-lucide-save" label="Simpan" />
<UButton icon="i-lucide-trash-2" label="Hapus" color="error" variant="soft" />
```

**❌ DON'T:**
```vue
<button class="bg-blue-500 text-white px-4 py-2 rounded">Simpan</button>
<button class="bg-red-500 text-white px-[12px] py-[6px] rounded-lg">Hapus</button>
```

---

### UButtonGroup

**Group of related buttons** — mengelompokkan tombol terkait.

**Kapan digunakan:** Toolbar actions, view toggle (list/grid), related actions.

```vue
<UButtonGroup>
  <UButton icon="i-lucide-list" variant="soft" />
  <UButton icon="i-lucide-grid-3x3" variant="soft" />
  <UButton icon="i-lucide-kanban" variant="soft" />
</UButtonGroup>
```

---

### UDropdownMenu

**Dropdown menu** dengan action items.

**Kapan digunakan:** Action menu pada tabel rows, user menu, konteks menu.

```vue
<script setup lang="ts">
const items = [
  {
    label: 'Edit',
    icon: 'i-lucide-pencil',
    onSelect() { /* handle edit */ },
  },
  {
    label: 'Duplicate',
    icon: 'i-lucide-copy',
    onSelect() { /* handle duplicate */ },
  },
  {
    type: 'separator' as const,
  },
  {
    label: 'Hapus',
    icon: 'i-lucide-trash-2',
    color: 'error' as const,
    onSelect() { /* handle delete */ },
  },
]
</script>

<template>
  <UDropdownMenu :items="items">
    <UButton icon="i-lucide-ellipsis" variant="ghost" />
  </UDropdownMenu>
</template>
```

**Item properties:**

| Prop | Type | Keterangan |
|---|---|---|
| `label` | `string` | Label text |
| `icon` | `string` | Icon |
| `color` | `string` | Color (misal `'error'` untuk delete) |
| `disabled` | `boolean` | Disabled state |
| `onSelect` | `() => void` | Handler saat dipilih |
| `type` | `'separator'` | Separator line |

---

## 📊 Data Display

### UTable

**Data table** dengan sorting dan selection.

**Kapan digunakan:** Menampilkan data tabular — lists, data grids, records.

```vue
<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

interface User {
  id: number
  name: string
  email: string
  status: 'active' | 'inactive'
}

const users = ref<User[]>([
  { id: 1, name: 'John Doe', email: 'john@example.com', status: 'active' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', status: 'inactive' },
])

const columns: TableColumn<User>[] = [
  { accessorKey: 'name', header: 'Nama' },
  { accessorKey: 'email', header: 'Email' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'actions', header: '' },
]
</script>

<template>
  <UTable :data="users" :columns="columns">
    <template #status-cell="{ row }">
      <UBadge
        :label="row.original.status"
        :color="row.original.status === 'active' ? 'success' : 'neutral'"
        variant="soft"
      />
    </template>

    <template #actions-cell="{ row }">
      <UDropdownMenu :items="getActions(row.original)">
        <UButton icon="i-lucide-ellipsis" variant="ghost" size="sm" />
      </UDropdownMenu>
    </template>
  </UTable>
</template>
```

**Props umum:**

| Prop | Type | Keterangan |
|---|---|---|
| `data` | `T[]` | Array data |
| `columns` | `TableColumn<T>[]` | Definisi kolom |
| `loading` | `boolean` | Loading state |

**Column definition:**

| Prop | Keterangan |
|---|---|
| `accessorKey` | Key dari data object |
| `header` | Label header kolom |
| `cell` | Custom render function |

**Template slot pattern:** `#<accessorKey>-cell` untuk custom cell rendering.

**✅ DO:**
```vue
<UTable :data="items" :columns="columns" />
```

**❌ DON'T:**
```vue
<table class="w-full border-collapse">
  <thead><tr><th class="border p-[10px]">Nama</th></tr></thead>
  <tbody><tr v-for="item in items"><td class="border p-[10px]">{{ item.name }}</td></tr></tbody>
</table>
```

---

### UBadge

**Status badge/tag** — menampilkan status atau label singkat.

```vue
<!-- Variants & Colors -->
<UBadge label="Active" color="success" variant="soft" />
<UBadge label="Pending" color="warning" variant="soft" />
<UBadge label="Error" color="error" variant="soft" />
<UBadge label="Draft" color="neutral" variant="soft" />

<!-- Dengan icon -->
<UBadge label="Online" color="success" icon="i-lucide-check" />

<!-- Sizes -->
<UBadge label="Small" size="sm" />
<UBadge label="Medium" size="md" />
<UBadge label="Large" size="lg" />
```

**Props umum:**

| Prop | Type | Keterangan |
|---|---|---|
| `label` | `string` | Badge text |
| `color` | `string` | Color theme |
| `variant` | `'solid' \| 'outline' \| 'soft' \| 'subtle'` | Visual variant |
| `size` | `'sm' \| 'md' \| 'lg'` | Ukuran |
| `icon` | `string` | Icon |

---

### UAvatar

**User avatar** — menampilkan gambar profil user.

```vue
<!-- Dengan gambar -->
<UAvatar src="/avatars/john.png" alt="John Doe" />

<!-- Dengan inisial (tanpa gambar) -->
<UAvatar text="JD" />

<!-- Dengan icon -->
<UAvatar icon="i-lucide-user" />

<!-- Sizes -->
<UAvatar src="/avatar.png" size="xs" />
<UAvatar src="/avatar.png" size="sm" />
<UAvatar src="/avatar.png" size="md" />
<UAvatar src="/avatar.png" size="lg" />
<UAvatar src="/avatar.png" size="xl" />
```

**Props umum:**

| Prop | Type | Keterangan |
|---|---|---|
| `src` | `string` | URL gambar |
| `alt` | `string` | Alt text |
| `text` | `string` | Inisial (fallback) |
| `icon` | `string` | Icon (fallback) |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | Ukuran |

---

### UAvatarGroup

**Multiple avatars** — menampilkan grup avatar.

```vue
<UAvatarGroup :max="3">
  <UAvatar src="/avatars/1.png" alt="User 1" />
  <UAvatar src="/avatars/2.png" alt="User 2" />
  <UAvatar src="/avatars/3.png" alt="User 3" />
  <UAvatar src="/avatars/4.png" alt="User 4" />
  <UAvatar src="/avatars/5.png" alt="User 5" />
</UAvatarGroup>
```

---

### UAccordion

**Collapsible content sections** — konten yang bisa di-expand/collapse.

**Kapan digunakan:** FAQ, settings groups, konten panjang yang perlu dikelompokkan.

```vue
<script setup lang="ts">
const items = [
  {
    label: 'Apa itu CRM Widget?',
    icon: 'i-lucide-info',
    content: 'CRM Widget adalah chatbot yang bisa di-embed ke website Anda.',
  },
  {
    label: 'Bagaimana cara install?',
    icon: 'i-lucide-download',
    content: 'Cukup copy-paste kode embed ke website Anda.',
  },
]
</script>

<template>
  <UAccordion :items="items" />
</template>
```

---

### UProgress

**Progress bar** — indikator progres.

```vue
<!-- Basic -->
<UProgress :model-value="65" />

<!-- Dengan warna -->
<UProgress :model-value="100" color="success" />
<UProgress :model-value="30" color="warning" />

<!-- Indeterminate (loading) -->
<UProgress />
```

**Props umum:**

| Prop | Type | Keterangan |
|---|---|---|
| `modelValue` | `number` | Persentase (0-100) |
| `max` | `number` | Nilai maksimum |
| `color` | `string` | Color theme |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg'` | Ukuran |

---

### USkeleton

**Loading skeleton** placeholder.

**Kapan digunakan:** Placeholder saat data sedang dimuat. JANGAN gunakan spinner biasa, gunakan skeleton untuk UX yang lebih baik.

```vue
<!-- Single line -->
<USkeleton class="h-4 w-full" />

<!-- Card skeleton -->
<div class="space-y-4">
  <USkeleton class="h-8 w-48" />
  <USkeleton class="h-4 w-full" />
  <USkeleton class="h-4 w-3/4" />
  <USkeleton class="h-4 w-1/2" />
</div>

<!-- Avatar + text skeleton -->
<div class="flex items-center gap-3">
  <USkeleton class="size-10 rounded-full" />
  <div class="space-y-2 flex-1">
    <USkeleton class="h-4 w-32" />
    <USkeleton class="h-3 w-48" />
  </div>
</div>
```

---

## 💬 Feedback

### UAlert

**Inline alert message** — pesan informasi, peringatan, error, atau sukses.

**Kapan digunakan:** Menampilkan pesan penting di dalam halaman (bukan toast).

```vue
<!-- Info -->
<UAlert
  title="Informasi"
  description="Widget Anda sudah aktif dan bisa diakses."
  icon="i-lucide-info"
  color="info"
/>

<!-- Warning -->
<UAlert
  title="Perhatian"
  description="API key Anda akan expired dalam 7 hari."
  icon="i-lucide-alert-circle"
  color="warning"
/>

<!-- Error -->
<UAlert
  title="Error"
  description="Gagal memuat data. Silakan coba lagi."
  icon="i-lucide-x-circle"
  color="error"
/>

<!-- Success -->
<UAlert
  title="Berhasil"
  description="Settings berhasil disimpan."
  icon="i-lucide-check-circle"
  color="success"
/>

<!-- Dengan actions -->
<UAlert
  title="Update tersedia"
  description="Versi baru widget tersedia."
  icon="i-lucide-info"
  color="info"
  :actions="[
    { label: 'Update', color: 'info', variant: 'solid', onClick: () => handleUpdate() },
    { label: 'Nanti', variant: 'outline', onClick: () => dismiss() },
  ]"
/>
```

**Props umum:**

| Prop | Type | Keterangan |
|---|---|---|
| `title` | `string` | Judul alert |
| `description` | `string` | Deskripsi/pesan |
| `icon` | `string` | Icon |
| `color` | `'primary' \| 'success' \| 'info' \| 'warning' \| 'error'` | Color theme |
| `variant` | `'solid' \| 'outline' \| 'soft' \| 'subtle'` | Visual variant |
| `closable` | `boolean` | Bisa ditutup |
| `actions` | `ButtonProps[]` | Action buttons |

---

### useToast()

**Toast notifications** — notifikasi sementara yang muncul di pojok layar.

**Kapan digunakan:** Feedback setelah aksi berhasil/gagal. Bersifat sementara, menghilang otomatis.

> **PENTING:** Ini adalah composable, BUKAN component. Membutuhkan `<UApp>` sebagai wrapper.

```vue
<script setup lang="ts">
const toast = useToast()

function showSuccessToast() {
  toast.add({
    title: 'Berhasil!',
    description: 'Data berhasil disimpan.',
    icon: 'i-lucide-check-circle',
    color: 'success',
  })
}

function showErrorToast() {
  toast.add({
    title: 'Gagal!',
    description: 'Terjadi kesalahan saat menyimpan data.',
    icon: 'i-lucide-alert-circle',
    color: 'error',
  })
}

function showWarningToast() {
  toast.add({
    title: 'Perhatian',
    description: 'Perubahan belum disimpan.',
    icon: 'i-lucide-alert-triangle',
    color: 'warning',
  })
}

function showToastWithAction() {
  toast.add({
    title: 'Item dihapus',
    description: 'Data berhasil dihapus.',
    icon: 'i-lucide-trash-2',
    color: 'success',
    actions: [{
      label: 'Undo',
      onClick: () => { /* undo logic */ },
    }],
  })
}
</script>
```

**Toast options:**

| Option | Type | Keterangan |
|---|---|---|
| `title` | `string` | Judul toast |
| `description` | `string` | Pesan detail |
| `icon` | `string` | Icon |
| `color` | `string` | Color theme |
| `duration` | `number` | Durasi tampil (ms) |
| `actions` | `Action[]` | Action buttons |

---

## 🪟 Overlay

### UModal

**Modal dialog** — dialog overlay di tengah layar.

**Kapan digunakan:** Confirmation dialogs, form modals, detail views yang butuh fokus.

```vue
<script setup lang="ts">
const isOpen = ref(false)
</script>

<template>
  <UButton label="Buka Modal" @click="isOpen = true" />

  <UModal v-model:open="isOpen" title="Konfirmasi Hapus" description="Apakah Anda yakin ingin menghapus item ini?">
    <template #body>
      <p>Tindakan ini tidak bisa dibatalkan.</p>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton label="Batal" variant="ghost" @click="isOpen = false" />
        <UButton label="Hapus" color="error" @click="handleDelete" />
      </div>
    </template>
  </UModal>
</template>
```

**Props umum:**

| Prop | Type | Keterangan |
|---|---|---|
| `open` | `boolean` | Status terbuka (v-model:open) |
| `title` | `string` | Judul modal |
| `description` | `string` | Deskripsi |
| `fullscreen` | `boolean` | Mode fullscreen |
| `prevent-close` | `boolean` | Cegah close saat klik overlay |

**Slots:**

| Slot | Keterangan |
|---|---|
| `header` | Area header |
| `body` | Konten utama |
| `footer` | Footer (actions) |
| `default` | Custom trigger |

**✅ DO:**
```vue
<UModal v-model:open="isOpen" title="Edit User">
  <template #body>
    <UForm :schema="schema" :state="state" @submit="onSubmit">
      <!-- form fields -->
    </UForm>
  </template>
</UModal>
```

**❌ DON'T:**
```vue
<dialog open class="fixed inset-0 bg-black/50 p-[20px]">
  <div class="bg-white rounded-lg p-[24px] w-[500px]">
    <h2>Edit User</h2>
  </div>
</dialog>
```

---

### USlideover

**Slide-over panel** — panel yang muncul dari sisi layar.

**Kapan digunakan:** Detail views, forms yang tidak perlu modal penuh, settings panel.

```vue
<script setup lang="ts">
const isOpen = ref(false)
</script>

<template>
  <UButton label="Lihat Detail" @click="isOpen = true" />

  <USlideover v-model:open="isOpen" title="Detail Conversation">
    <template #body>
      <!-- Detail content -->
      <div class="space-y-4">
        <div>
          <p class="text-sm font-medium text-gray-500">Customer</p>
          <p class="text-base">John Doe</p>
        </div>
      </div>
    </template>
  </USlideover>
</template>
```

**Props umum:**

| Prop | Type | Keterangan |
|---|---|---|
| `open` | `boolean` | Status terbuka (v-model:open) |
| `title` | `string` | Judul |
| `description` | `string` | Deskripsi |
| `side` | `'left' \| 'right'` | Dari sisi mana muncul |

---

### UPopover

**Popover content** — konten yang muncul saat klik elemen.

```vue
<UPopover>
  <UButton label="Pilih Warna" variant="outline" />

  <template #content>
    <div class="p-4 space-y-2">
      <p class="text-sm font-medium">Pilih warna primary:</p>
      <!-- Color picker content -->
    </div>
  </template>
</UPopover>
```

---

### UTooltip

**Hover tooltip** — teks bantuan saat hover.

```vue
<UTooltip text="Klik untuk mengedit data">
  <UButton icon="i-lucide-pencil" variant="ghost" />
</UTooltip>
```

**Props umum:**

| Prop | Type | Keterangan |
|---|---|---|
| `text` | `string` | Tooltip text |

---

### UDrawer

**Mobile-friendly bottom drawer** — drawer dari bawah untuk mobile.

**Kapan digunakan:** Mobile menus, filter panels pada layar kecil.

```vue
<script setup lang="ts">
const isOpen = ref(false)
</script>

<template>
  <UButton label="Filter" @click="isOpen = true" class="lg:hidden" />

  <UDrawer v-model:open="isOpen" title="Filter Data">
    <template #body>
      <div class="space-y-4 p-4">
        <UFormField label="Status">
          <USelect v-model="filterStatus" :items="statusOptions" />
        </UFormField>
        <UButton label="Terapkan" block @click="applyFilters" />
      </div>
    </template>
  </UDrawer>
</template>
```

---

## 🎨 Icons

### UIcon

**Icon display** — menampilkan ikon dari Lucide icon set.

**Format:** `i-lucide-<nama-icon>`

```vue
<!-- Standalone -->
<UIcon name="i-lucide-home" class="size-5" />

<!-- Dengan warna dan ukuran -->
<UIcon name="i-lucide-check" class="size-6 text-success" />
<UIcon name="i-lucide-alert-circle" class="size-4 text-warning" />
```

### Daftar Icon Umum

#### Navigation
| Icon | Name | Penggunaan |
|---|---|---|
| 🏠 | `i-lucide-home` | Home, beranda |
| ← | `i-lucide-arrow-left` | Kembali |
| → | `i-lucide-arrow-right` | Maju, next |
| ☰ | `i-lucide-menu` | Menu hamburger |
| ‹ | `i-lucide-chevron-left` | Navigasi kiri |
| › | `i-lucide-chevron-right` | Navigasi kanan |

#### Actions
| Icon | Name | Penggunaan |
|---|---|---|
| ＋ | `i-lucide-plus` | Tambah baru |
| ✏️ | `i-lucide-pencil` | Edit |
| 🗑 | `i-lucide-trash-2` | Hapus |
| 💾 | `i-lucide-save` | Simpan |
| ⬇ | `i-lucide-download` | Download |
| ⬆ | `i-lucide-upload` | Upload |

#### Status
| Icon | Name | Penggunaan |
|---|---|---|
| ✓ | `i-lucide-check` | Sukses, selesai |
| ✕ | `i-lucide-x` | Close, gagal |
| ⚠ | `i-lucide-alert-circle` | Warning, error |
| ℹ | `i-lucide-info` | Informasi |
| ⟳ | `i-lucide-loader` | Loading (animasi putar) |

#### Communication
| Icon | Name | Penggunaan |
|---|---|---|
| 💬 | `i-lucide-message-circle` | Chat bubble |
| 📝 | `i-lucide-message-square` | Pesan, conversation |
| ➤ | `i-lucide-send` | Kirim pesan |

#### User
| Icon | Name | Penggunaan |
|---|---|---|
| 👤 | `i-lucide-user` | User, profil |
| 👥 | `i-lucide-users` | Banyak user, tim |
| 🔑 | `i-lucide-log-in` | Login |
| 🚪 | `i-lucide-log-out` | Logout |

#### Dashboard
| Icon | Name | Penggunaan |
|---|---|---|
| 📊 | `i-lucide-layout-dashboard` | Dashboard home |
| ⚙ | `i-lucide-settings` | Settings, konfigurasi |
| 📈 | `i-lucide-bar-chart-3` | Statistik, chart |
| 🗃 | `i-lucide-database` | Database, data |

#### Files
| Icon | Name | Penggunaan |
|---|---|---|
| 📄 | `i-lucide-file` | File generic |
| 📃 | `i-lucide-file-text` | File teks |
| 📁 | `i-lucide-folder` | Folder |
| 📋 | `i-lucide-copy` | Copy, duplicate |

#### Other
| Icon | Name | Penggunaan |
|---|---|---|
| 🔍 | `i-lucide-search` | Pencarian |
| 👁 | `i-lucide-eye` | Lihat, preview |
| 🙈 | `i-lucide-eye-off` | Sembunyikan |
| ☀ | `i-lucide-sun` | Light mode |
| 🌙 | `i-lucide-moon` | Dark mode |
| 🔄 | `i-lucide-refresh-cw` | Refresh, reload |
| ↗ | `i-lucide-external-link` | Link external |

> **Catatan:** Semua icon menggunakan package `@iconify-json/lucide`. Default icons sudah di-override di `app.config.ts`.

---

## 🎨 Color System

### Warna Tersedia

| Color | Penggunaan | Contoh |
|---|---|---|
| `primary` | Aksi utama, branding | Button utama, link aktif |
| `secondary` | Aksi sekunder | Button sekunder |
| `success` | Sukses, berhasil | Badge aktif, toast berhasil |
| `info` | Informasi | Alert info, badge info |
| `warning` | Peringatan | Alert warning, badge pending |
| `error` | Error, bahaya | Tombol hapus, toast error |
| `neutral` | Netral, default | Badge draft, text muted |

### Variants

| Variant | Deskripsi | Visual |
|---|---|---|
| `solid` | Background penuh, teks kontras | Warna background solid |
| `outline` | Border saja, teks berwarna | Transparan dengan border |
| `soft` | Background ringan, teks berwarna | Background sangat tipis |
| `subtle` | Lebih ringan dari soft | Background sangat-sangat tipis |
| `ghost` | Tanpa background, warna saat hover | Transparan, hover berwarna |
| `link` | Seperti text link | Underline, tanpa padding |

### Sizes

| Size | Keterangan |
|---|---|
| `xs` | Extra small — compact UI |
| `sm` | Small — form elements, secondary actions |
| `md` | Medium — default, most common |
| `lg` | Large — primary CTA, hero sections |
| `xl` | Extra large — sangat prominent |

### Contoh Penggunaan Color + Variant

```vue
<!-- Primary actions -->
<UButton label="Simpan" color="primary" variant="solid" />
<UButton label="Batal" color="primary" variant="outline" />

<!-- Destructive actions -->
<UButton label="Hapus" color="error" variant="solid" />
<UButton label="Hapus" color="error" variant="soft" />

<!-- Status badges -->
<UBadge label="Active" color="success" variant="soft" />
<UBadge label="Pending" color="warning" variant="soft" />
<UBadge label="Inactive" color="neutral" variant="soft" />
<UBadge label="Error" color="error" variant="soft" />

<!-- Alerts -->
<UAlert title="Info" color="info" variant="subtle" />
<UAlert title="Warning" color="warning" variant="subtle" />
<UAlert title="Error" color="error" variant="subtle" />
<UAlert title="Success" color="success" variant="subtle" />
```

---

## ✅ Form Validation dengan Zod

### Contoh Lengkap: Form + Zod Schema + Validation

```vue
<script setup lang="ts">
import { z } from 'zod'

// 1. Definisikan Zod schema
const schema = z.object({
  name: z.string().min(1, 'Nama wajib diisi').max(100, 'Nama maksimal 100 karakter'),
  email: z.string().email('Format email tidak valid'),
  role: z.enum(['admin', 'operator'], { message: 'Pilih role yang valid' }),
  phone: z.string().regex(/^(\+62|62|0)8[1-9][0-9]{6,9}$/, 'Format nomor telepon tidak valid').optional(),
  isActive: z.boolean().default(true),
  bio: z.string().max(500, 'Bio maksimal 500 karakter').optional(),
})

// 2. Buat type dari schema
type FormData = z.infer<typeof schema>

// 3. Buat reactive state
const state = reactive<FormData>({
  name: '',
  email: '',
  role: 'operator',
  phone: '',
  isActive: true,
  bio: '',
})

// 4. Loading state
const { loading, execute } = useApi({ showSuccessToast: true, successMessage: 'Data berhasil disimpan' })

// 5. Submit handler — hanya dipanggil jika validasi lolos
async function onSubmit() {
  await execute(async () => {
    // state di sini sudah tervalidasi oleh Zod
    return await userService.create(state)
  })
}
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold">Tambah User Baru</h3>
    </template>

    <!-- UForm otomatis validasi dengan Zod schema -->
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Nama Lengkap" name="name" required>
        <UInput v-model="state.name" placeholder="Masukkan nama lengkap" icon="i-lucide-user" />
      </UFormField>

      <UFormField label="Email" name="email" required>
        <UInput v-model="state.email" type="email" placeholder="user@example.com" icon="i-lucide-mail" />
      </UFormField>

      <UFormField label="Role" name="role" required>
        <USelect
          v-model="state.role"
          :items="[
            { label: 'Admin', value: 'admin' },
            { label: 'Operator', value: 'operator' },
          ]"
          placeholder="Pilih role"
        />
      </UFormField>

      <UFormField label="Nomor Telepon" name="phone" hint="Opsional">
        <UInput v-model="state.phone" placeholder="+628123456789" icon="i-lucide-phone" />
      </UFormField>

      <UFormField label="Bio" name="bio" hint="Opsional" description="Maksimal 500 karakter">
        <UTextarea v-model="state.bio" placeholder="Ceritakan tentang diri Anda..." :rows="3" autoresize />
      </UFormField>

      <UFormField name="isActive">
        <USwitch v-model="state.isActive" label="User aktif" />
      </UFormField>

      <!-- Submit button -->
      <div class="flex justify-end gap-2 pt-4">
        <UButton label="Reset" variant="ghost" type="reset" />
        <UButton label="Simpan" type="submit" icon="i-lucide-save" :loading="loading" />
      </div>
    </UForm>
  </UCard>
</template>
```

### Cara Kerja Validasi

1. **`<UForm :schema="schema">`** — mendaftarkan Zod schema
2. **`<UFormField name="email">`** — `name` HARUS sama dengan key di Zod schema
3. Saat user submit atau blur (tergantung `validate-on`), Zod otomatis validasi
4. Jika ada error, `<UFormField>` otomatis menampilkan pesan error di bawah input
5. Event `@submit` HANYA dipanggil jika semua validasi lolos

### Custom Validation Messages

```typescript
const schema = z.object({
  password: z.string()
    .min(8, 'Password minimal 8 karakter')
    .regex(/[A-Z]/, 'Harus mengandung huruf besar')
    .regex(/[0-9]/, 'Harus mengandung angka'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Password tidak cocok',
  path: ['confirmPassword'],
})
```

---

## 🧩 Common Patterns

### Data Table with Actions Pattern

Pattern standar untuk menampilkan data tabel dengan action menu per baris.

```vue
<script setup lang="ts">
import type { TableColumn } from '@nuxt/ui'

interface Conversation {
  id: number
  customerName: string
  lastMessage: string
  status: 'active' | 'ended'
  createdAt: string
}

const columns: TableColumn<Conversation>[] = [
  { accessorKey: 'customerName', header: 'Customer' },
  { accessorKey: 'lastMessage', header: 'Pesan Terakhir' },
  { accessorKey: 'status', header: 'Status' },
  { accessorKey: 'createdAt', header: 'Tanggal' },
  { accessorKey: 'actions', header: '' },
]

function getActions(item: Conversation) {
  return [
    {
      label: 'Lihat Detail',
      icon: 'i-lucide-eye',
      onSelect: () => navigateTo(`/dashboard/conversations/${item.id}`),
    },
    {
      label: 'Tandai Selesai',
      icon: 'i-lucide-check-circle',
      disabled: item.status === 'ended',
      onSelect: () => markAsEnded(item.id),
    },
    { type: 'separator' as const },
    {
      label: 'Hapus',
      icon: 'i-lucide-trash-2',
      color: 'error' as const,
      onSelect: () => confirmDelete(item.id),
    },
  ]
}
</script>

<template>
  <UTable :data="conversations" :columns="columns">
    <template #status-cell="{ row }">
      <UBadge
        :label="row.original.status === 'active' ? 'Aktif' : 'Selesai'"
        :color="row.original.status === 'active' ? 'success' : 'neutral'"
        variant="soft"
      />
    </template>

    <template #createdAt-cell="{ row }">
      {{ formatDate(row.original.createdAt) }}
    </template>

    <template #actions-cell="{ row }">
      <UDropdownMenu :items="getActions(row.original)">
        <UButton icon="i-lucide-ellipsis" variant="ghost" size="sm" />
      </UDropdownMenu>
    </template>
  </UTable>
</template>
```

---

### Confirmation Modal Pattern

Pattern standar untuk dialog konfirmasi menggunakan `useOverlay()`.

**Cara 1: Inline Modal (Sederhana)**

```vue
<script setup lang="ts">
const showDeleteModal = ref(false)
const itemToDelete = ref<number | null>(null)

function confirmDelete(id: number) {
  itemToDelete.value = id
  showDeleteModal.value = true
}

async function handleDelete() {
  if (!itemToDelete.value) return
  await execute(() => service.delete(itemToDelete.value!))
  showDeleteModal.value = false
  itemToDelete.value = null
}
</script>

<template>
  <UModal v-model:open="showDeleteModal" title="Konfirmasi Hapus" description="Tindakan ini tidak bisa dibatalkan.">
    <template #body>
      <p class="text-sm text-gray-600">
        Apakah Anda yakin ingin menghapus item ini? Semua data terkait juga akan dihapus.
      </p>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton label="Batal" variant="ghost" @click="showDeleteModal = false" />
        <UButton label="Hapus" color="error" icon="i-lucide-trash-2" :loading="loading" @click="handleDelete" />
      </div>
    </template>
  </UModal>
</template>
```

**Cara 2: Reusable Overlay Component (Lebih Canggih)**

```vue
<!-- components/common/CommonConfirmDialog.vue -->
<script setup lang="ts">
interface Props {
  title?: string
  description?: string
  confirmLabel?: string
  confirmColor?: string
  confirmIcon?: string
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Konfirmasi',
  description: 'Apakah Anda yakin?',
  confirmLabel: 'Konfirmasi',
  confirmColor: 'error',
  confirmIcon: 'i-lucide-check',
})

const emit = defineEmits<{
  close: [confirmed: boolean]
}>()
</script>

<template>
  <UCard>
    <template #header>
      <h3 class="text-lg font-semibold">{{ props.title }}</h3>
    </template>

    <p class="text-sm text-gray-600">{{ props.description }}</p>

    <template #footer>
      <div class="flex justify-end gap-2">
        <UButton label="Batal" variant="ghost" @click="emit('close', false)" />
        <UButton
          :label="props.confirmLabel"
          :color="props.confirmColor"
          :icon="props.confirmIcon"
          @click="emit('close', true)"
        />
      </div>
    </template>
  </UCard>
</template>
```

```vue
<!-- Usage dengan useOverlay() -->
<script setup lang="ts">
const overlay = useOverlay()

async function confirmDelete(id: number) {
  const confirmed = await overlay.create(CommonConfirmDialog, {
    props: {
      title: 'Hapus Data',
      description: 'Data yang dihapus tidak bisa dikembalikan.',
      confirmLabel: 'Hapus',
      confirmColor: 'error',
      confirmIcon: 'i-lucide-trash-2',
    },
  }).open()

  if (confirmed) {
    await execute(() => service.delete(id))
  }
}
</script>
```

---

### Loading State Pattern

Pattern standar untuk menampilkan skeleton saat loading.

```vue
<template>
  <!-- Loading: tampilkan skeleton -->
  <div v-if="loading" class="space-y-4">
    <USkeleton class="h-8 w-48" />
    <USkeleton class="h-4 w-full" />
    <USkeleton class="h-4 w-3/4" />
    <USkeleton class="h-32 w-full" />
  </div>

  <!-- Error: tampilkan pesan error -->
  <UAlert
    v-else-if="error"
    title="Gagal Memuat Data"
    :description="error.message"
    icon="i-lucide-alert-circle"
    color="error"
    :actions="[{ label: 'Coba Lagi', icon: 'i-lucide-refresh-cw', onClick: retry }]"
  />

  <!-- Data ready: tampilkan konten -->
  <div v-else>
    <!-- Konten normal -->
  </div>
</template>
```

---

### Empty State Pattern

Pattern standar saat data kosong.

```vue
<template>
  <div v-if="items.length === 0" class="flex flex-col items-center justify-center py-12 text-center">
    <UIcon name="i-lucide-inbox" class="size-12 text-gray-400 mb-4" />
    <h3 class="text-lg font-semibold text-gray-700">Belum Ada Data</h3>
    <p class="text-sm text-gray-500 mt-1 max-w-sm">
      Mulai dengan membuat item pertama Anda.
    </p>
    <UButton
      label="Tambah Data"
      icon="i-lucide-plus"
      class="mt-4"
      @click="handleCreate"
    />
  </div>
</template>
```

---

### Search + Filter Pattern

Pattern standar untuk search bar dengan filter.

```vue
<script setup lang="ts">
const search = ref('')
const statusFilter = ref('')
const debouncedSearch = useDebounceFn(() => fetchData(), 300)

watch(search, () => debouncedSearch())
watch(statusFilter, () => fetchData())
</script>

<template>
  <div class="flex items-center gap-3">
    <UInput
      v-model="search"
      icon="i-lucide-search"
      placeholder="Cari..."
      class="flex-1"
    />
    <USelect
      v-model="statusFilter"
      :items="[
        { label: 'Semua', value: '' },
        { label: 'Aktif', value: 'active' },
        { label: 'Selesai', value: 'ended' },
      ]"
      placeholder="Filter status"
      class="w-40"
    />
    <UButton icon="i-lucide-plus" label="Tambah" @click="handleCreate" />
  </div>
</template>
```

---

### Page Header Pattern

Pattern standar untuk header halaman dashboard.

```vue
<template>
  <div class="space-y-6">
    <!-- Page Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold">Knowledge Base</h1>
        <p class="text-sm text-gray-500 mt-1">
          Kelola kategori dan data knowledge base chatbot Anda.
        </p>
      </div>
      <UButton icon="i-lucide-plus" label="Tambah Kategori" @click="handleCreate" />
    </div>

    <!-- Content -->
    <UCard>
      <!-- ... -->
    </UCard>
  </div>
</template>
```

---

## ❌ DILARANG — Common Mistakes

### Native HTML → NuxtUI Replacement

| ❌ DILARANG (native) | ✅ WAJIB (NuxtUI) |
|---|---|
| `<button>` | `<UButton>` |
| `<input>` | `<UInput>` |
| `<input type="checkbox">` | `<UCheckbox>` |
| `<select>` | `<USelect>` atau `<USelectMenu>` |
| `<textarea>` | `<UTextarea>` |
| `<table>` | `<UTable>` |
| `<dialog>` | `<UModal>` |
| `<form>` | `<UForm>` |
| `<progress>` | `<UProgress>` |
| `<details><summary>` | `<UAccordion>` |

### Hardcoded CSS → Tailwind Standard Classes

| ❌ DILARANG (hardcoded) | ✅ WAJIB (Tailwind standar) | Alasan |
|---|---|---|
| `class="p-[10px]"` | `class="p-2.5"` atau `class="p-3"` | Gunakan spacing scale |
| `class="mt-[5px]"` | `class="mt-1"` | 1 = 4px, cukup dekat |
| `class="w-[200px]"` | `class="w-52"` (208px) atau `class="w-48"` (192px) | Gunakan width scale |
| `class="h-[300px]"` | `class="h-72"` (288px) atau `class="h-80"` (320px) | Gunakan height scale |
| `class="text-[14px]"` | `class="text-sm"` (14px) | Gunakan type scale |
| `class="text-[18px]"` | `class="text-lg"` (18px) | Gunakan type scale |
| `class="text-[24px]"` | `class="text-2xl"` (24px) | Gunakan type scale |
| `class="bg-[#6366f1]"` | `class="bg-primary"` | Gunakan color tokens |
| `class="bg-[#ef4444]"` | `class="bg-red-500"` atau `bg-error` | Gunakan color palette |
| `class="rounded-[8px]"` | `class="rounded-lg"` (8px) | Gunakan radius scale |
| `class="gap-[12px]"` | `class="gap-3"` (12px) | Gunakan spacing scale |
| `style="color: red"` | `class="text-error"` | JANGAN gunakan inline style |
| `style="font-size: 16px"` | `class="text-base"` | JANGAN gunakan inline style |

### Referensi Cepat Tailwind Spacing

| Tailwind | Pixel |
|---|---|
| `1` | 4px |
| `2` | 8px |
| `3` | 12px |
| `4` | 16px |
| `5` | 20px |
| `6` | 24px |
| `8` | 32px |
| `10` | 40px |
| `12` | 48px |
| `16` | 64px |
| `20` | 80px |
| `24` | 96px |

### Referensi Cepat Tailwind Font Size

| Tailwind | Pixel |
|---|---|
| `text-xs` | 12px |
| `text-sm` | 14px |
| `text-base` | 16px |
| `text-lg` | 18px |
| `text-xl` | 20px |
| `text-2xl` | 24px |
| `text-3xl` | 30px |

### Anti-patterns Lainnya

```vue
<!-- ❌ JANGAN: Manual import component -->
<script setup>
import UButton from '@nuxt/ui' // SALAH! Auto-imported
</script>

<!-- ❌ JANGAN: Pakai class hardcoded untuk warna -->
<div class="bg-[#6366f1] text-white p-[16px]">Content</div>

<!-- ✅ BENAR: Pakai Tailwind standard + NuxtUI component -->
<UCard>Content</UCard>
<!-- atau jika memang butuh div -->
<div class="bg-primary p-4 text-white">Content</div>

<!-- ❌ JANGAN: Bikin button manual -->
<div
  class="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
  @click="handleClick"
>
  Click me
</div>

<!-- ✅ BENAR: Gunakan UButton -->
<UButton label="Click me" @click="handleClick" />

<!-- ❌ JANGAN: Loading manual dengan v-if div -->
<div v-if="loading" class="animate-spin w-[24px] h-[24px] border-2 border-blue-500 rounded-full" />

<!-- ✅ BENAR: Gunakan loading prop atau USkeleton -->
<UButton label="Loading" loading />
<USkeleton class="h-8 w-full" />
```

---

## 📖 Referensi

- [NuxtUI Documentation](https://ui.nuxt.com/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Lucide Icons](https://lucide.dev/icons/)
- [Zod Documentation](https://zod.dev/)
- [ARCHITECTURE.md](../ARCHITECTURE.md) — Arsitektur project
- [API_GUIDE.md](./API_GUIDE.md) — Panduan integrasi API
