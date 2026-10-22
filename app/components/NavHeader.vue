<script lang="ts" setup>
const { title } = useAppConfig()
</script>

<template>
  <header class="bg-arancio text-ink">
    <div class="flex items-center justify-between gap-4 px-3 py-2 sm:px-5">
      <NuLink :to="$localePath('index')" class="flex items-center gap-2 text-ink hover:text-ink">
        <NuAvatar alt="" src="/logo.svg" class="size-10 border-2 border-ink" />
        <span class="font-display text-3xl leading-none">{{ title }}</span>
      </NuLink>
      <ThemeSwitch />
    </div>
    <div class="frieze" />
  </header>
</template>
