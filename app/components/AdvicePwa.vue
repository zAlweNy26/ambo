<script lang="ts" setup>
const { $pwa } = useNuxtApp()
</script>

<template>
  <ClientOnly>
    <div v-if="$pwa?.isPWAInstalled && ($pwa?.offlineReady || $pwa?.needRefresh)"
         class="flex justify-center items-center font-medium p-2 bg-accented gap-2">
      <h6>{{ $t('pwa.updateTitle') }}</h6>
      <UButton size="sm" color="success" @click="$pwa.updateServiceWorker()">
        {{ $t('pwa.update') }}
      </UButton>
      <UButton size="sm" variant="outline" color="error" @click="$pwa.cancelPrompt()">
        {{ $t('button.cancel') }}
      </UButton>
    </div>
    <div v-else-if="$pwa?.showInstallPrompt && !$pwa?.offlineReady && !$pwa?.needRefresh"
         class="flex justify-center items-center font-medium p-2 bg-accented gap-2">
      <h6>{{ $t('pwa.installTitle') }}</h6>
      <UButton size="sm" color="success" @click="$pwa.install()">
        {{ $t('pwa.install') }}
      </UButton>
      <UButton size="sm" variant="outline" color="error" @click="$pwa.cancelInstall()">
        {{ $t('button.cancel') }}
      </UButton>
    </div>
  </ClientOnly>
</template>
