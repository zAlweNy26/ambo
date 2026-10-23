<script lang="ts" setup>
const { $pwa } = useNuxtApp()
</script>

<template>
  <ClientOnly>
    <div v-if="$pwa?.needRefresh"
         class="flex justify-center items-center font-medium p-2 bg-accented gap-2">
      <p>{{ $t('pwa.updateTitle') }}</p>
      <UButton size="sm" color="success" @click="$pwa.updateServiceWorker()">
        {{ $t('pwa.update') }}
      </UButton>
      <UButton size="sm" variant="outline" color="error" @click="$pwa.cancelPrompt()">
        {{ $t('button.cancel') }}
      </UButton>
    </div>
    <div v-else-if="$pwa?.showInstallPrompt"
         class="flex justify-center items-center font-medium p-2 bg-accented gap-2">
      <p>{{ $t('pwa.installTitle') }}</p>
      <UButton size="sm" color="success" @click="$pwa.install()">
        {{ $t('pwa.install') }}
      </UButton>
      <UButton size="sm" variant="outline" color="error" @click="$pwa.cancelInstall()">
        {{ $t('button.cancel') }}
      </UButton>
    </div>
  </ClientOnly>
</template>
