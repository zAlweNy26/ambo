<script lang="ts" setup>
import type { DropdownMenuItem } from '#ui/types'

const settings = useSettingsStore()
const { changeLocale } = settings
const { locale, locales, currentLocale } = storeToRefs(settings)

const items = computed<DropdownMenuItem[]>(() => locales.value.map(l => ({
  label: `${l.domain} ${l.name}`,
  onSelect: () => changeLocale(l.code),
  checked: l.code === locale.value,
} satisfies DropdownMenuItem)))
</script>

<template>
  <ClientOnly>
    <NuDropdownMenu :items :content="{ align: 'end', sideOffset: 16 }">
      <NuButton variant="outline" color="neutral" :ui="{ label: 'size-5' }"
                square :label="currentLocale.domain" />
      <template #item-trailing="{ item }">
        <NuIcon v-if="item.checked" name="i-tabler-point-filled" class="size-4" />
      </template>
    </NuDropdownMenu>
    <template #fallback>
      <div class="size-8" />
    </template>
  </ClientOnly>
</template>
