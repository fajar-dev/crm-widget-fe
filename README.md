# CRM Widget Frontend

> Frontend untuk CRM Chatbot System — **Chat Widget** (embeddable) + **Admin Dashboard**

## 📋 Overview

CRM Widget Frontend adalah aplikasi Nuxt 4 yang menyediakan dua deliverable utama:

1. **Chat Widget** — Widget chat yang bisa di-embed ke website pelanggan via `<script>` tag
2. **Admin Dashboard** — Web app untuk mengelola chatbot (settings, knowledge base, conversations, dll.)

Backend API tersedia di `http://localhost:3000/api` (project terpisah).

---

## 🛠 Tech Stack

| Technology | Version | Kegunaan |
|---|---|---|
| [Nuxt](https://nuxt.com/) | 4.x | Framework utama (Vue 3 + SSR/SPA) |
| [TypeScript](https://www.typescriptlang.org/) | 5.x | Type safety & developer experience |
| [Bun](https://bun.sh/) | latest | Runtime & package manager |
| [NuxtUI](https://ui.nuxt.com/) | @nuxt/ui ^4.8.2 | UI component library |
| [TailwindCSS](https://tailwindcss.com/) | v4 | Utility-first CSS framework |
| [Lucide Icons](https://lucide.dev/) | @iconify-json/lucide | Icon set (via Iconify) |
| [Zod](https://zod.dev/) | ^4.4.3 | Schema validation |
| [Axios](https://axios-http.com/) | ^1.17.0 | HTTP client untuk API calls |
| [Pinia](https://pinia.vuejs.org/) | ^3.0.4 | State management |
| [VueUse](https://vueuse.org/) | @vueuse/nuxt ^14.3.0 | Composable utilities |
| [@nuxt/image](https://image.nuxt.com/) | ^2.0.0 | Image optimization |

---

## 📦 Prerequisites

Pastikan sudah terinstall:

- **Node.js** >= 22.x
- **Bun** >= 1.x (sebagai runtime & package manager)

```bash
# Cek versi
node -v   # v22.x.x
bun -v    # 1.x.x
```

---

## 🚀 Getting Started

### 1. Clone Repository

```bash
git clone <repository-url> crm-widget-fe
cd crm-widget-fe
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Setup Environment Variables

```bash
cp .env.example .env
# Edit .env sesuai kebutuhan
```

### 4. Run Development Server

```bash
bun dev
```

Aplikasi akan berjalan di `http://localhost:3001` (default).

---

## 📁 Project Structure

```
crm-widget-fe/
├── app/                        # Semua kode frontend (Nuxt 4 convention)
│   ├── app.vue                 # Root component (UApp wrapper)
│   ├── assets/
│   │   └── css/main.css        # Tailwind + NuxtUI imports
│   ├── components/             # Auto-imported Vue components
│   │   ├── common/             # Shared/reusable components
│   │   ├── dashboard/          # Admin dashboard components
│   │   └── widget/             # Chat widget components
│   ├── composables/            # Auto-imported composables (useXxx)
│   ├── layouts/                # Layout components (default, dashboard, widget)
│   ├── middleware/             # Route middleware (auth, guest)
│   ├── pages/                  # File-based routing
│   ├── plugins/                # Vue plugins (axios, etc.)
│   ├── services/               # API service classes (Axios-based)
│   ├── stores/                 # Pinia stores
│   └── utils/                  # Utility/helper functions
├── server/                     # Server-side logic (jika diperlukan)
├── shared/                     # Shared code antara app/ dan server/
│   └── types/                  # TypeScript interfaces & types
├── public/                     # Static assets (favicon, robots.txt)
├── docs/                       # Dokumentasi project
│   ├── PRD_CHATBOT.md          # Product Requirements Document
│   └── swagger.yml             # OpenAPI 3.1.0 specification
├── .gemini/                    # AI agent configuration
│   └── AGENT.md                # Agent rules & context
├── app.config.ts               # Runtime config (UI theme, colors)
├── nuxt.config.ts              # Nuxt build-time configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies & scripts
└── bun.lock                    # Bun lockfile
```

---

## 📜 Available Scripts

| Script | Command | Deskripsi |
|---|---|---|
| **dev** | `bun dev` | Start development server dengan hot-reload |
| **build** | `bun run build` | Build untuk production |
| **generate** | `bun run generate` | Generate static site |
| **preview** | `bun run preview` | Preview production build |
| **postinstall** | `bun run postinstall` | Prepare Nuxt (auto-run setelah install) |

---

## 🔐 Environment Variables

| Variable | Default | Deskripsi |
|---|---|---|
| `NUXT_PUBLIC_API_BASE_URL` | `http://localhost:3000/api` | Base URL backend API |
| `NUXT_PUBLIC_APP_NAME` | `CRM Widget` | Application name |

> **Note**: Environment variables dengan prefix `NUXT_PUBLIC_` akan tersedia di client-side via `useRuntimeConfig()`.

---

## 🏗 Architecture

Dokumentasi arsitektur lengkap tersedia di [ARCHITECTURE.md](./ARCHITECTURE.md).

Highlights:
- **7 Architecture Layers**: Pages, Components, Composables, Services, Stores, Types, Utils
- **Clean Architecture**: Separation of concerns yang jelas
- **API Service Pattern**: Axios-based service classes dengan Zod validation
- **State Management**: Pinia stores dengan Composition API style

---

## 📐 Coding Conventions

### ✅ WAJIB (MUST)

1. **Gunakan NuxtUI components** untuk SEMUA UI elements
   ```vue
   <!-- ✅ Benar -->
   <UButton label="Save" icon="i-lucide-save" />
   <UInput v-model="name" placeholder="Name" />
   
   <!-- ❌ Salah -->
   <button class="bg-blue-500 p-2">Save</button>
   <input v-model="name" />
   ```

2. **Gunakan Tailwind utility classes** yang sudah ada
   ```vue
   <!-- ✅ Benar -->
   <div class="p-4 mt-2 gap-3 flex items-center">
   
   <!-- ❌ Salah -->
   <div class="p-[10px] mt-[5px] gap-[12px]">
   ```

3. **TypeScript strict mode** — definisikan interface/type untuk semua data
4. **Lucide icons** dengan format `i-lucide-<name>`
5. **Zod schema** untuk validasi form dan API response
6. **Clean Architecture** — separation of concerns yang jelas

### ❌ DILARANG (MUST NOT)

1. **DILARANG** hardcode CSS values: `p-[10px]`, `mt-[5px]`, `w-[200px]`, `text-[14px]`
2. **DILARANG** menulis CSS manual di `<style>` tag (kecuali benar-benar diperlukan)
3. **DILARANG** menggunakan inline styles
4. **DILARANG** menggunakan HTML native elements yang sudah ada NuxtUI counterpart-nya
5. **DILARANG** skip TypeScript types atau menggunakan `any`
6. **DILARANG** hardcode API URLs — gunakan runtime config
7. **DILARANG** commit tanpa update `CHANGELOG.md`

---

## 📚 Backend API Reference

- **PRD (Product Requirements)**: [docs/PRD_CHATBOT.md](./docs/PRD_CHATBOT.md)
- **OpenAPI Specification**: [docs/swagger.yml](./docs/swagger.yml)
- **Backend Project**: `/Users/fajar/Nusanet/crm-widget`

### API Response Format

```typescript
// Success Response
{ success: true, statusCode: 200, message: "Success", data: T }

// Paginated Response
{ success: true, statusCode: 200, message: "Success", data: T[], meta: { total, perPage, currentPage, lastPage, from, to } }

// Error Response
{ success: false, statusCode: number, message: string, data: null, errors?: Record<string, string[]> }
```

---

## 📝 Changelog

Lihat [CHANGELOG.md](./CHANGELOG.md) untuk riwayat perubahan project.

---

## 📄 License

**Private** — All rights reserved.
