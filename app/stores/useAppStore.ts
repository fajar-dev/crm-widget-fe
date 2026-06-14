/**
 * App Store
 *
 * Global application state managed by Pinia.
 * Handles app-wide state like sidebar visibility, loading overlays, etc.
 *
 * @example
 *   const appStore = useAppStore()
 *   appStore.toggleSidebar()
 */
export const useAppStore = defineStore('app', () => {
  /** Whether the sidebar is open (for dashboard layout) */
  const isSidebarOpen = ref(true)

  /** Global loading overlay state */
  const isGlobalLoading = ref(false)

  /**
   * Toggle sidebar visibility
   */
  function toggleSidebar(): void {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  /**
   * Set global loading state
   */
  function setGlobalLoading(value: boolean): void {
    isGlobalLoading.value = value
  }

  return {
    isSidebarOpen,
    isGlobalLoading,
    toggleSidebar,
    setGlobalLoading,
  }
})
