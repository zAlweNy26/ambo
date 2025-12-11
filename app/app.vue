<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

const { locale } = useI18n()
</script>

<template>
  <NuApp :locale="locales[locale]" :tooltip="{ delayDuration: 300 }"
         :toaster="{ duration: 2000, position: 'bottom-right' }">
    <NuxtLayout name="default">
      <main class="flex grow flex-col p-2 md:p-4">
        <NuxtPage />
      </main>
    </NuxtLayout>
  </NuApp>
</template>
