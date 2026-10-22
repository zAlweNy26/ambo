<script lang="ts" setup>
const { title } = useAppConfig()
</script>

<template>
  <header class="bg-primary text-white">
    <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
      <NuLink :to="$localePath('index')" class="flex items-center gap-2.5 text-white hover:text-white">
        <img alt="" src="/logo.svg" class="size-8 rounded-full bg-white p-0.5">
        <span class="text-lg font-semibold tracking-tight">{{ title }}</span>
      </NuLink>
      <ThemeSwitch />
    </div>
  </header>
</template>
