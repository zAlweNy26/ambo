<script lang="ts" setup>
const { title } = useAppConfig()
</script>

<template>
  <header class="flex items-center justify-between bg-[var(--ui-bg-elevated)] p-2 shadow-lg">
    <NuLink :to="$localePath('index')">
      <NuAvatar alt="App Logo" src="/logo.svg" />
    </NuLink>
    <div class="h-full items-center gap-2 flex">
      <i18n-t keypath="donate.title" tag="p" class="text-sm">
        <strong>{{ title }}</strong>
        <span class="hidden sm:inline-block">{{ $t('donate.with') }}</span>
      </i18n-t>
      <NuButton variant="subtle" size="sm" color="info" class="px-1.5 sm:px-2.5" aria-label="PayPal"
                target="_blank" to="https://paypal.me/danyalwe" external icon="i-tabler-brand-paypal-filled">
        <span class="hidden sm:inline-block">PayPal</span>
      </NuButton>
    </div>
    <ThemeSwitch />
  </header>
</template>
