<!--
  Root Application Component

  Wraps the entire application with UApp for NuxtUI integration.
  UApp provides global context for:
  - Toasts (useToast)
  - Overlays/Modals (useOverlay)
  - Color mode (useColorMode)
  - Tooltip provider

  @see https://ui.nuxt.com/components/app
-->
<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>
