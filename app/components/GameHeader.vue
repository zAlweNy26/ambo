<script lang="ts" setup>
defineProps<{
  remaining: number
}>()

const safeExit = ref(false), isModalOpen = ref(false)

const { isSupported, request, release } = useWakeLock()
const { toggle, isFullscreen } = useFullscreen(undefined, { autoExit: true })

const goHome = () => {
	safeExit.value = true
  navigateTo('/')
}

onMounted(() => {
  if (isSupported.value) {
    request('screen')
    console.warn('Wake Lock requested')
  }
})

useEventListener('beforeunload', (event) => {
  if (!safeExit.value) {
    event.preventDefault()
    return event.returnValue = ''
  }
  if (isSupported.value) release()
})
</script>

<template>
  <div class="flex items-center justify-between w-full gap-4">
    <NuButton :aria-label="isFullscreen ? $t('button.minimize') : $t('button.maximize')"
      :icon="isFullscreen ? 'i-tabler-minimize' : 'i-tabler-maximize'" size="xl" variant="ghost"
      @click="toggle()" />
    <i18n-t keypath="game.title" tag="h3" class="text-xl">
      <slot name="title">
        <span>{{ $t(`header.${String($route.name)}`) }}</span>
      </slot>
      <strong>{{ remaining }}</strong>
    </i18n-t>
    <NuModal v-model:open="isModalOpen" :close="false"
      :title="$t('exit.title')" :description="$t('exit.description')" :ui="{ 
        footer: 'justify-between gap-8',
        content: 'sm:max-w-xs'
      }">
      <NuButton :aria-label="$t('button.exit')" icon="i-tabler-x" size="xl" variant="ghost" />
      <template #footer>
        <NuButton :label="$t('button.cancel')" size="xl" color="neutral" variant="subtle" @click="isModalOpen = false" />
        <NuButton :label="$t('button.exit')" size="xl" color="error" @click="goHome()" />
      </template>
    </NuModal>
  </div>
</template>