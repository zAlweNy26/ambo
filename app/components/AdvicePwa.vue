<script lang="ts" setup>
const { $pwa } = useNuxtApp()
</script>

<template>
  <ClientOnly>
    <div v-if="$pwa?.offlineReady || $pwa?.needRefresh"
         class="flex justify-center items-center font-medium p-2 bg-[var(--ui-bg-accented)] gap-2">
      <h6>{{ $t('pwa.updateTitle') }}</h6>
      <NuButton size="sm" color="success" @click="$pwa.updateServiceWorker()">
        {{ $t('pwa.update') }}
      </NuButton>
      <NuButton size="sm" variant="outline" color="error" @click="$pwa.cancelPrompt()">
        {{ $t('button.cancel') }}
      </NuButton>
    </div>
    <div v-else-if="$pwa?.showInstallPrompt && !$pwa?.offlineReady && !$pwa?.needRefresh"
         class="flex justify-center items-center font-medium p-2 bg-[var(--ui-bg-accented)] gap-2">
      <h6>{{ $t('pwa.installTitle') }}</h6>
      <NuButton size="sm" color="success" @click="$pwa.install()">
        {{ $t('pwa.install') }}
      </NuButton>
      <NuButton size="sm" variant="outline" color="error" @click="$pwa.cancelInstall()">
        {{ $t('button.cancel') }}
      </NuButton>
    </div>
  </ClientOnly>
</template>
