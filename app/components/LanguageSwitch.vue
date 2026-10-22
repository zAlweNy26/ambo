<script lang="ts" setup>
import type { DropdownMenuItem } from '#ui/types'

const settings = useSettingsStore()
const { changeLocale } = settings
const { locale, locales, currentLocale } = storeToRefs(settings)

const items = computed<DropdownMenuItem[]>(() => locales.value.map(l => ({
  label: l.name,
  onSelect: () => changeLocale(l.code),
  checked: l.code === locale.value,
} satisfies DropdownMenuItem)))
</script>

<template>
  <ClientOnly>
    <NuDropdownMenu :items :content="{ align: 'end', sideOffset: 16 }">
      <NuButton :aria-label="$t('language.toggle')" variant="ghost" color="neutral" size="sm"
                :label="currentLocale.code.toUpperCase()" icon="i-tabler-language" />
      <template #item-trailing="{ item }">
        <NuIcon v-if="item.checked" name="i-tabler-point-filled" class="size-4" />
      </template>
    </NuDropdownMenu>
    <template #fallback>
      <div class="size-8" />
    </template>
  </ClientOnly>
</template>
