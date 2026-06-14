/**
 * useApi Composable
 *
 * Provides reactive API utilities for components.
 * Wraps common patterns for loading states, error handling,
 * and toast notifications.
 *
 * @example
 *   const { loading, error, execute } = useApi()
 *   await execute(() => authService.login(payload))
 */

import { ApiError } from '~/services/ApiError'

interface UseApiOptions {
  /** Show toast on error (default: true) */
  showErrorToast?: boolean
  /** Show toast on success (default: false) */
  showSuccessToast?: boolean
  /** Custom success message */
  successMessage?: string
}

/**
 * Composable for handling API calls with loading/error states
 */
export function useApi(options: UseApiOptions = {}) {
  const {
    showErrorToast = true,
    showSuccessToast = false,
    successMessage = 'Operation successful',
  } = options

  const loading = ref(false)
  const error = ref<ApiError | null>(null)
  const toast = useToast()

  /**
   * Execute an async API call with automatic loading/error handling
   */
  async function execute<T>(fn: () => Promise<T>): Promise<T | null> {
    loading.value = true
    error.value = null

    try {
      const result = await fn()

      if (showSuccessToast) {
        toast.add({
          title: 'Success',
          description: successMessage,
          icon: 'i-lucide-check-circle',
          color: 'success',
        })
      }

      return result
    }
    catch (err) {
      if (err instanceof ApiError) {
        error.value = err

        if (showErrorToast) {
          toast.add({
            title: 'Error',
            description: err.message,
            icon: 'i-lucide-alert-circle',
            color: 'error',
          })
        }
      }
      else {
        const unknownError = new ApiError('An unexpected error occurred', 500)
        error.value = unknownError

        if (showErrorToast) {
          toast.add({
            title: 'Error',
            description: 'An unexpected error occurred',
            icon: 'i-lucide-alert-circle',
            color: 'error',
          })
        }
      }

      return null
    }
    finally {
      loading.value = false
    }
  }

  /**
   * Reset error state
   */
  function clearError(): void {
    error.value = null
  }

  return {
    loading: readonly(loading),
    error: readonly(error),
    execute,
    clearError,
  }
}
