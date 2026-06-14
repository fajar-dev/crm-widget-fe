# AI Agent Rules — CRM Widget Frontend

## Project Context

- **Type**: Frontend untuk CRM Chatbot System
- **Deliverables**: 2 aplikasi — Chat Widget (embeddable) + Admin Dashboard
- **Backend**: REST API di `http://localhost:3000/api`
- **Backend Project**: `/Users/fajar/Nusanet/crm-widget`

## Referensi Backend (WAJIB BACA)

Sebelum memulai development, BACA file-file ini untuk memahami konteks:

| File | Isi | Prioritas |
|------|-----|-----------|
| `docs/PRD_CHATBOT.md` | PRD lengkap — semua halaman, API contract, wireframe, component spec | ⭐⭐⭐ UTAMA |
| `docs/swagger.yml` | OpenAPI 3.1.0 spec — semua endpoint, schema, parameter | ⭐⭐⭐ UTAMA |

Jika perlu detail implementasi backend:
- Backend source: `/Users/fajar/Nusanet/crm-widget/src/`
- Architecture doc: `/Users/fajar/Nusanet/crm-widget/ARCHITECTURE.md`
- Changelog: `/Users/fajar/Nusanet/crm-widget/CHANGELOG.md`

## Deliverable 1 — Chat Widget (Embeddable)

### Deskripsi
Widget chat yang di-embed di website pelanggan via `<script>` tag. Berjalan di domain pelanggan (cross-origin).

### Spesifikasi
- **Auth**: Session-based via `X-Session-Token` header (BUKAN JWT)
- **Embed**: `<script src="..." data-tenant="slug"></script>`
- **Storage**: `localStorage` untuk session token
- **CORS**: Cross-origin requests ke backend
- **Bundle**: Target < 100KB gzipped
- **Framework**: Vanilla JS/TS atau Preact/Solid (lightweight) — BUKAN React/Next.js

### Flow
1. Load config → 2. Show pre-chat form → 3. Create session → 4. Chat → 5. End/New chat

### API Endpoints (Public — NO auth)
```
GET  /api/chat/{tenantSlug}/config
POST /api/chat/{tenantSlug}/sessions
GET  /api/chat/{tenantSlug}/sessions/{token}
POST /api/chat/{tenantSlug}/conversations          (X-Session-Token)
POST /api/chat/{tenantSlug}/conversations/{id}/messages  (X-Session-Token)
POST /api/chat/{tenantSlug}/conversations/{id}/end       (X-Session-Token)
```

## Deliverable 2 — Admin Dashboard

### Deskripsi
Web app untuk admin mengelola chatbot: settings, form fields, knowledge base, conversations, playground.

### Spesifikasi
- **Auth**: JWT Bearer token dari login
- **Framework**: Next.js atau Vite + React
- **Routing**: SPA dengan client-side routing

### Halaman
1. Widget Settings — UI customization (color, font, welcome message)
2. Chatbot Settings — AI config (model, temperature, system instruction)
3. Form Fields — Custom pre-chat form builder (drag & reorder)
4. Knowledge Base — Category + KB entry management
5. Conversations — Chat history viewer
6. Sessions — Active session list
7. Playground — Test chatbot langsung
8. Embed Code — Copy-paste script tag

### API Endpoints (Auth + Tenant)
```
GET/PUT  /api/widget-settings
GET/PUT  /api/chatbot-settings
CRUD     /api/chatbot-form-fields + /reorder
GET/DEL  /api/chatbot-sessions
GET/DEL  /api/chatbot-conversations + /:id/messages
CRUD     /api/knowledge-categories
CRUD     /api/knowledge-bases
POST     /api/playground
```

## Response Format (Semua API)

```typescript
// Success
{ success: true, statusCode: 200, message: "Success", data: T }

// Created
{ success: true, statusCode: 201, message: "Created successfully", data: T }

// Paginated
{ success: true, statusCode: 200, message: "Success", data: T[], meta: { total, perPage, currentPage, lastPage, from, to } }

// Error
{ success: false, statusCode: number, message: string, data: null, errors?: Record<string, string[]> }
```

## Pagination Query Params

```
?page=1&perPage=10&sortBy=createdAt&sortOrder=DESC&search=keyword
```

## MUST Follow

1. Baca `docs/PRD_CHATBOT.md` sebelum memulai development
2. Baca `docs/swagger.yml` untuk API contract yang akurat
3. Semua API response dibungkus dalam format standard (lihat di atas)
4. Widget harus cross-origin compatible (CORS)
5. Widget harus lightweight (< 100KB)
6. Dashboard harus responsive (mobile + desktop)
7. Gunakan TypeScript
8. Tampilkan loading state saat menunggu AI response (2-5 detik)
9. Handle session expired (401) dengan redirect ke form
10. Render AI reply sebagai Markdown

## MUST NOT

1. Jangan gunakan cookie untuk session token (CORS issue)
2. Jangan buat widget dengan React/Next.js (terlalu berat)
3. Jangan hardcode tenant slug — ambil dari config/URL
4. Jangan skip error handling — semua API call harus handle error
5. Jangan polling untuk chat — gunakan single request-response pattern

## Key Enums

```typescript
// Form field types
type FormFieldType = 'text' | 'email' | 'phone' | 'number' | 'textarea' | 'select';

// Knowledge entry types
type EntryType = 'faq' | 'document_chunk';

// Conversation status
type ConversationStatus = 'active' | 'ended';

// Message roles
type MessageRole = 'user' | 'assistant' | 'system';
```

## Design System

| Token | Value |
|-------|-------|
| Primary | `#6366f1` (configurable from widget settings) |
| Font | `Inter` (configurable from widget settings) |
| Border Radius | `8px` (widget), `12px` (dashboard) |
| Dark Mode | Support both light/dark |

---

## Frontend Tech Stack

| Technology | Version | Kegunaan |
|---|---|---|
| Nuxt | 4.x | Framework utama |
| TypeScript | 5.x | Type safety |
| Bun | latest | Runtime & package manager |
| NuxtUI | @nuxt/ui latest | UI component library |
| TailwindCSS | v4 | Utility-first CSS (via NuxtUI) |
| Lucide | @iconify-json/lucide | Icon set |
| Zod | latest | Schema validation |
| Axios | latest | HTTP client |
| Pinia | @pinia/nuxt | State management |
| VueUse | @vueuse/nuxt | Composable utilities |
| @nuxt/image | latest | Image optimization |

## Referensi Frontend (WAJIB BACA)

| File | Isi | Prioritas |
|---|---|---|
| `ARCHITECTURE.md` | Arsitektur frontend, layer, data flow | ⭐⭐⭐ |
| `docs/COMPONENT_CATALOG.md` | Katalog NuxtUI components, icon reference, UI patterns | ⭐⭐⭐ |
| `docs/CODING_STANDARDS.md` | Coding standards, contoh kode benar/salah | ⭐⭐⭐ |
| `docs/API_GUIDE.md` | Panduan integrasi API step-by-step | ⭐⭐⭐ |
| `CONTRIBUTING.md` | Git workflow, commit conventions, PR guidelines | ⭐⭐ |
| `docs/ENV_VARIABLES.md` | Environment variables, usage, security | ⭐⭐ |
| `CHANGELOG.md` | Riwayat perubahan project | ⭐⭐ |
| `README.md` | Setup, scripts, konvensi koding | ⭐⭐ |

## Folder Structure (Nuxt 4)

```
crm-widget-fe/
├── app/                        # Semua kode frontend
│   ├── app.vue                 # Root component (UApp wrapper)
│   ├── assets/css/main.css     # Tailwind + NuxtUI imports
│   ├── components/             # Auto-imported Vue components
│   │   ├── common/             # Shared/reusable components
│   │   ├── dashboard/          # Admin dashboard components
│   │   └── widget/             # Chat widget components
│   ├── composables/            # Auto-imported composables
│   ├── layouts/                # Layout components
│   ├── middleware/             # Route middleware
│   ├── pages/                  # File-based routing
│   ├── plugins/                # Vue plugins
│   ├── services/               # API service classes (Axios)
│   ├── stores/                 # Pinia stores
│   └── utils/                  # Utility functions
├── server/                     # Server-side (jika perlu)
├── shared/                     # Shared types antara app/ dan server/
│   └── types/                  # TypeScript interfaces/types
├── public/                     # Static assets
├── docs/                       # Dokumentasi (PRD, Swagger)
├── .gemini/                    # AI agent rules
├── app.config.ts               # Runtime config (UI theme)
├── nuxt.config.ts              # Build-time config
└── package.json
```

## Frontend Coding Rules (WAJIB)

### WAJIB Dilakukan
1. Gunakan NuxtUI components untuk SEMUA UI elements (UButton, UInput, UCard, UTable, UModal, dll.)
2. Gunakan Tailwind utility classes yang sudah ada (p-4, mt-2, gap-3, dll.)
3. Gunakan Lucide icons dengan format `i-lucide-<name>`
4. Gunakan Zod schema untuk validasi form dan API response
5. Gunakan Axios service class pattern untuk API calls
6. Gunakan Pinia stores (Composition API style) untuk state management
7. Gunakan TypeScript strict mode — definisikan interface/type untuk semua data
8. Auto-import: components, composables, utils — JANGAN manual import
9. Naming Convention:
   - Components: PascalCase (e.g., `ChatMessage.vue`)
   - Composables: camelCase dengan prefix `use` (e.g., `useAuth.ts`)
   - Stores: camelCase dengan prefix `use` + suffix `Store` (e.g., `useAuthStore.ts`)
   - Services: PascalCase + suffix `Service` (e.g., `AuthService.ts`)
   - Types: PascalCase + suffix sesuai jenis (e.g., `AuthResponse`, `UserEntity`)
10. Setiap file harus punya JSDoc/comment yang menjelaskan purpose

### DILARANG (STRICT)
1. ❌ DILARANG menggunakan hardcode CSS values: `p-[10px]`, `mt-[5px]`, `w-[200px]`, `text-[14px]`
2. ❌ DILARANG menulis CSS manual di `<style>` tag (kecuali benar-benar diperlukan)
3. ❌ DILARANG menggunakan inline styles
4. ❌ DILARANG menggunakan HTML native elements yang sudah ada di NuxtUI (gunakan UButton bukan `<button>`, UInput bukan `<input>`, dst.)
5. ❌ DILARANG skip TypeScript types — semua harus typed
6. ❌ DILARANG gunakan `any` type
7. ❌ DILARANG hardcode API URLs — gunakan runtime config
8. ❌ DILARANG commit tanpa update CHANGELOG.md

## API Service Pattern

```typescript
// Service class pattern
class BaseApiService {
  protected readonly http: AxiosInstance

  constructor(baseURL: string) {
    this.http = axios.create({ baseURL })
    this.setupInterceptors()
  }
}

// Domain service
class AuthService extends BaseApiService {
  async login(payload: LoginPayload): Promise<ApiResponse<AuthData>> {
    const response = await this.http.post('/auth/login', payload)
    return apiResponseSchema.parse(response.data)
  }
}
```

## NuxtUI Icon Usage

```vue
<!-- Correct icon usage -->
<UIcon name="i-lucide-home" />
<UButton icon="i-lucide-plus" label="Add" />
<UInput icon="i-lucide-search" placeholder="Search..." />
```

SELALU gunakan prefix `i-lucide-` untuk icons.

## Saat Development

1. SELALU baca docs/PRD_CHATBOT.md untuk requirement
2. SELALU baca docs/swagger.yml untuk API contract
3. SELALU update CHANGELOG.md setiap ada perubahan
4. SELALU gunakan NuxtUI components
5. SELALU validasi form input dengan Zod
6. SELALU handle error states (loading, error, empty)
7. SELALU test responsive di mobile dan desktop
