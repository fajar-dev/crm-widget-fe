// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: { enabled: true },

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxt/image',
    '@pinia/nuxt',
    '@vueuse/nuxt',
  ],

  css: ['~/assets/css/main.css'],

  /**
   * Runtime config — accessible via useRuntimeConfig()
   * Override via environment variables:
   *   NUXT_PUBLIC_API_BASE_URL=http://localhost:4000/api
   */
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_PUBLIC_API_BASE_URL || 'http://localhost:4000/api',
    },
  },

  /**
   * TypeScript configuration
   * - strict: Enable strict type checking
   * - typeCheck: Enable type checking at build time
   */
  typescript: {
    strict: true,
    typeCheck: false,
  },

  /**
   * Pinia configuration
   * - autoImports: Auto-import defineStore, storeToRefs, etc.
   */
  pinia: {
    autoImports: [
      'defineStore',
      'storeToRefs',
    ],
  },

  /**
   * Image optimization configuration
   */
  image: {
    quality: 80,
    format: ['webp', 'avif'],
  },

  /**
   * ESLint configuration
   */
  eslint: {
    config: {
      stylistic: true,
    },
  },
})
