# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

_No unreleased changes._

## [0.2.0] - 2026-06-14

### Added

#### Foundation (Issues #1-#4)
- 14 TypeScript type files matching Swagger spec (auth, tenant, contact, widget-settings, chatbot-settings, form-field, session, conversation, knowledge, chat, playground)
- Zod validation schemas for all form inputs
- 12 API service classes (AuthService, TenantService, ContactService, WidgetSettingsService, ChatbotSettingsService, FormFieldService, SessionService, ConversationService, KnowledgeService, PlaygroundService, ChatService, DashboardApiService)
- `DashboardApiService` base class with JWT Bearer token + X-Tenant-ID header injection
- `ChatService` with X-Session-Token header for widget auth
- Pinia stores: `useAuthStore` (JWT management, login/logout, persistence), `useTenantStore` (multi-tenant switching)
- Dashboard layout with sidebar navigation, tenant switcher, breadcrumbs, color mode toggle
- Auth layout for login/register pages
- Auth middleware (`auth.global.ts`) for route protection
- Auth init plugin (`01.auth.ts`) for state restoration

#### Auth Pages (Issues #5-#6, #23)
- Login page with UForm + Zod validation, error handling, toast notifications
- Register page with password confirmation, field validation
- JWT token auto-refresh from localStorage persistence

#### Dashboard Pages (Issues #7-#17)
- Widget Settings page with live preview panel (2-column layout)
- Chatbot Settings page with system instruction (monospace) + model configuration
- Form Fields page with CRUD, drag reorder, dynamic options editor for select type
- Knowledge Base Categories page with CRUD, cascade delete warning
- Knowledge Base Detail page with KB entries CRUD + bulk JSON import
- Conversations page with split-pane layout (list + message detail), markdown rendering
- Sessions page with paginated table, dynamic values display
- Playground page with chat interface, client-side history, stats display
- Contacts page with CRUD, paginated table, status/source badges
- Tenant Management page with member table, invite, role management
- Embed Code Generator page with clipboard copy

#### Chat Widget (Issues #18-#20)
- Widget state machine composable (`useWidget`) — 8 states, session management, debounce
- Widget UI components: FloatingButton, ChatHeader, ChatMessage, ChatInput, PreChatForm, TypingIndicator, WidgetContainer
- Dynamic pre-chat form rendering (6 field types)
- Markdown rendering for bot responses
- Sources accordion for references
- Session persistence via localStorage
- Standalone widget preview page (`/widget/[slug]`)

#### Cross-cutting (Issues #21-#22)
- Dark mode toggle with `useColorMode()`
- Global error page (`error.vue`)
- Consistent loading states, empty states, and toast notifications

## [0.1.0] - 2026-06-14

### Added

- Initial project setup with Nuxt 4 + TypeScript
- Bun as runtime and package manager
- NuxtUI (`@nuxt/ui` ^4.8.2) for UI component library
- TailwindCSS v4 for utility-first styling
- Lucide icons via `@iconify-json/lucide`
- Zod (^4.4.3) for schema validation
- Axios (^1.17.0) for HTTP client
- Pinia (^3.0.4) + `@pinia/nuxt` for state management
- VueUse (`@vueuse/nuxt` ^14.3.0) for composable utilities
- `@nuxt/image` (^2.0.0) for image optimization
- Clean architecture folder structure (Nuxt 4 `app/` directory convention)
- Comprehensive project documentation:
  - `README.md` — setup, scripts, coding conventions
  - `ARCHITECTURE.md` — architecture layers, data flow, patterns
  - `CHANGELOG.md` — change tracking
  - `.gemini/AGENT.md` — AI agent rules & context
- ESLint configuration with `@nuxt/eslint`
- VS Code settings for Tailwind CSS IntelliSense
- PRD documentation (`docs/PRD_CHATBOT.md`)
- OpenAPI specification (`docs/swagger.yml`)
- `CONTRIBUTING.md` — git workflow, commit conventions, PR guidelines, code review checklist
- `docs/CODING_STANDARDS.md` — Vue component, TypeScript, composable, service, store standards with code examples
- `docs/COMPONENT_CATALOG.md` — NuxtUI component catalog, icon reference, color system, common UI patterns
- `docs/API_GUIDE.md` — step-by-step API integration guide, auth patterns, pagination, error handling
- `docs/ENV_VARIABLES.md` — environment variables documentation, usage guide, security notes
