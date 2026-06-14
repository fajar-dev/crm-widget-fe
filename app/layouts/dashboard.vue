<template>
  <UApp>
    <div class="min-h-screen flex bg-gray-50 dark:bg-gray-950">
      <!-- Sidebar -->
      <aside
        class="fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 transition-transform lg:translate-x-0"
        :class="sidebarOpen ? 'translate-x-0' : '-translate-x-full'"
      >
        <!-- Sidebar Header -->
        <div class="flex h-16 items-center gap-2 border-b border-gray-200 dark:border-gray-800 px-4">
          <UIcon name="i-lucide-bot" class="text-primary text-xl" />
          <span class="font-semibold text-gray-900 dark:text-white text-lg">CRM Widget</span>
        </div>

        <!-- Tenant Switcher -->
        <div class="px-3 py-3 border-b border-gray-200 dark:border-gray-800">
          <USelect
            v-if="tenantStore.hasTenants"
            :model-value="tenantStore.currentTenantId"
            :items="tenantOptions"
            placeholder="Pilih Tenant"
            size="sm"
            @update:model-value="onTenantChange"
          />
        </div>

        <!-- Navigation -->
        <nav class="flex-1 overflow-y-auto py-3 px-3">
          <div v-for="group in navGroups" :key="group.label" class="mb-4">
            <p class="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider px-2 mb-1">
              {{ group.label }}
            </p>
            <ul class="space-y-0.5">
              <li v-for="item in group.items" :key="item.to">
                <NuxtLink
                  :to="item.to"
                  class="flex items-center gap-3 rounded-md px-2 py-2 text-sm font-medium transition-colors"
                  :class="isActiveRoute(item.to)
                    ? 'bg-primary/10 text-primary dark:bg-primary/10 dark:text-primary'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'"
                  @click="sidebarOpen = false"
                >
                  <UIcon :name="item.icon" class="text-lg" />
                  <span>{{ item.label }}</span>
                </NuxtLink>
              </li>
            </ul>
          </div>
        </nav>

        <!-- User section -->
        <div class="border-t border-gray-200 dark:border-gray-800 p-3">
          <UDropdownMenu
            :items="userMenuItems"
            :ui="{ content: 'w-56' }"
          >
            <UButton variant="ghost" class="w-full justify-start gap-2" size="sm">
              <UAvatar :text="authStore.userInitials" size="xs" />
              <span class="truncate text-sm">{{ authStore.fullName }}</span>
              <UIcon name="i-lucide-chevrons-up-down" class="ml-auto text-gray-400" />
            </UButton>
          </UDropdownMenu>
        </div>
      </aside>

      <!-- Overlay for mobile -->
      <div
        v-if="sidebarOpen"
        class="fixed inset-0 z-20 bg-black/50 lg:hidden"
        @click="sidebarOpen = false"
      />

      <!-- Main Content -->
      <div class="flex-1 lg:ml-64">
        <!-- Top Bar -->
        <header class="sticky top-0 z-10 flex h-16 items-center gap-4 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 lg:px-6">
          <UButton
            variant="ghost"
            icon="i-lucide-menu"
            class="lg:hidden"
            size="sm"
            @click="sidebarOpen = !sidebarOpen"
          />

          <!-- Breadcrumb -->
          <UBreadcrumb :items="breadcrumbItems" class="hidden sm:flex" />

          <div class="ml-auto flex items-center gap-2">
            <UButton
              :icon="colorMode.value === 'dark' ? 'i-lucide-sun' : 'i-lucide-moon'"
              variant="ghost"
              color="neutral"
              size="sm"
              @click="toggleColorMode"
            />
          </div>
        </header>

        <!-- Page Content -->
        <main class="p-4 lg:p-6">
          <slot />
        </main>
      </div>
    </div>
  </UApp>
</template>

<script setup lang="ts">
/**
 * Dashboard Layout
 *
 * Main layout for admin dashboard with sidebar navigation,
 * tenant switcher, and top bar with breadcrumbs.
 */

const route = useRoute()
const colorMode = useColorMode()
const authStore = useAuthStore()
const tenantStore = useTenantStore()

const sidebarOpen = ref(false)

/** Navigation groups */
const navGroups = [
  {
    label: 'Chatbot',
    items: [
      { label: 'Widget Settings', to: '/chatbot/widget', icon: 'i-lucide-palette' },
      { label: 'Chatbot Settings', to: '/chatbot/settings', icon: 'i-lucide-bot' },
      { label: 'Form Fields', to: '/chatbot/form-fields', icon: 'i-lucide-list-checks' },
      { label: 'Playground', to: '/chatbot/playground', icon: 'i-lucide-play' },
    ],
  },
  {
    label: 'Knowledge Base',
    items: [
      { label: 'Categories', to: '/knowledge', icon: 'i-lucide-book-open' },
    ],
  },
  {
    label: 'Conversations',
    items: [
      { label: 'All Conversations', to: '/conversations', icon: 'i-lucide-message-square' },
      { label: 'Sessions', to: '/sessions', icon: 'i-lucide-users' },
    ],
  },
  {
    label: 'CRM',
    items: [
      { label: 'Contacts', to: '/contacts', icon: 'i-lucide-contact' },
    ],
  },
  {
    label: 'Settings',
    items: [
      { label: 'Tenant', to: '/settings/tenant', icon: 'i-lucide-building' },
      { label: 'Embed Code', to: '/embed', icon: 'i-lucide-code' },
    ],
  },
]

/** Tenant select options */
const tenantOptions = computed(() =>
  tenantStore.tenants.map(t => ({
    label: t.name,
    value: t.id,
  })),
)

/** Handle tenant change */
function onTenantChange(tenantId: string): void {
  const tenant = tenantStore.tenants.find(t => t.id === tenantId)
  if (tenant) {
    tenantStore.setCurrentTenant(tenant)
    // Reload current page to refetch data with new tenant context
    window.location.reload()
  }
}

/** Check if route matches nav item */
function isActiveRoute(path: string): boolean {
  return route.path === path || route.path.startsWith(`${path}/`)
}

/** Toggle color mode */
function toggleColorMode(): void {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}

/** Breadcrumb items from route */
const breadcrumbItems = computed(() => {
  const segments = route.path.split('/').filter(Boolean)
  const items: Array<{ label: string; to?: string }> = []

  let path = ''
  for (const segment of segments) {
    path += `/${segment}`
    items.push({
      label: segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' '),
      to: path,
    })
  }

  return items
})

/** User menu items */
const userMenuItems = computed(() => [
  [{
    label: authStore.fullName,
    slot: 'header' as const,
    disabled: true,
  }],
  [{
    label: 'Logout',
    icon: 'i-lucide-log-out',
    click: () => authStore.logout(),
  }],
])
</script>
