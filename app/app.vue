<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

const { locale } = useI18n()
useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    // Matches the red header bar (same in both themes) and the manifest
    { key: 'theme-color', name: 'theme-color', content: '#c41e2a' },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
})
</script>

<template>
  <UApp :locale="locales[locale]" :tooltip="{ delayDuration: 300 }"
        :toaster="{ duration: 2000, position: 'bottom-right' }">
    <NuxtLayout name="default">
      <main class="flex grow flex-col px-4 py-3 md:p-4">
        <NuxtPage />
      </main>
    </NuxtLayout>
  </UApp>
</template>
