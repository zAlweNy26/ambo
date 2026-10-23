<script lang="ts" setup>
defineProps<{
  remaining: number
}>()

const safeExit = ref(false), isModalOpen = ref(false)
const { t } = useI18n()
const { isSupported, request, release } = useWakeLock()
const { toggle, isFullscreen } = useFullscreen(undefined, { autoExit: true })

function goHome() {
  safeExit.value = true
  navigateTo('/')
}

onMounted(() => {
  // Keeping the screen on is a nicety: the browser may refuse it (battery saver, hidden tab, no permission)
  if (isSupported.value) request('screen').catch(() => {})
})

onBeforeUnmount(() => {
  if (isSupported.value) release().catch(() => {})
})

useEventListener('beforeunload', (event) => {
  if (!safeExit.value) {
    event.preventDefault()
    return event.returnValue = t('game.confirmation')
  }
})
</script>

<template>
  <div class="flex items-center justify-between w-full gap-4">
    <UButton :aria-label="isFullscreen ? $t('button.minimize') : $t('button.maximize')"
             :icon="isFullscreen ? 'i-tabler-minimize' : 'i-tabler-maximize'" size="xl" variant="ghost" color="neutral"
             @click="toggle()" />
    <i18n-t keypath="game.title" tag="h2" class="text-lg font-medium text-toned text-balance sm:text-xl">
      <slot name="title">
        <span>{{ $t(`header.${String($route.name)}`) }}</span>
      </slot>
      <strong class="font-semibold text-primary tabular-nums">{{ remaining }}</strong>
    </i18n-t>
    <UModal v-model:open="isModalOpen" :close="false"
            :title="$t('exit.title')" :description="$t('exit.description')" :ui="{
              footer: 'justify-between gap-8',
              content: 'sm:max-w-xs',
            }">
      <UButton :aria-label="$t('button.exit')" icon="i-tabler-x" size="xl" variant="ghost" color="neutral" />
      <template #footer>
        <UButton :label="$t('button.cancel')" size="xl" color="neutral" variant="subtle" @click="isModalOpen = false" />
        <UButton :label="$t('button.exit')" size="xl" color="error" @click="goHome()" />
      </template>
    </UModal>
  </div>
</template>
