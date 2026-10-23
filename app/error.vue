<script setup lang="ts">
import type { NuxtError } from '#app'

const { error } = defineProps<{
  error: NuxtError
}>()

const { t } = useI18n()
const localePath = useLocalePath()

const errorMsg = computed(() => `error.routes.${error.statusCode}`)

useHead({
  title: () => t('error.routes.title', [error.statusCode]),
})

watchDeep(() => error, (err) => {
  console.log(err)
}, { immediate: true })

function handleError() {
  return clearError({
    redirect: localePath('index'),
  })
}
</script>

<template>
  <NuxtLayout name="default">
    <div class="flex h-svh w-screen flex-col items-center justify-evenly gap-8 text-center">
      <div class="flex flex-col gap-4 text-4xl font-bold sm:text-5xl">
        <span class="text-8xl font-semibold tracking-tight text-primary tabular-nums">{{ error.statusCode }}</span>
        <span class="font-semibold tracking-tight text-highlighted">{{ $t('error.routes.notAccessible') }}</span>
        <span class="whitespace-break-spaces text-2xl font-medium text-toned">
          {{ $t($te(errorMsg) ? errorMsg : 'error.routes.fallback') }}
        </span>
      </div>
      <UButton color="error" size="xl" @click="handleError">
        {{ $t('button.backHome') }}
      </UButton>
    </div>
  </NuxtLayout>
</template>
