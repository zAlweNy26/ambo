<script lang="ts" setup>
import type { DropdownMenuItem } from '#ui/types'

const { locale, locales, localeProperties, setLocale } = useI18n()

const items = computed<DropdownMenuItem[]>(() => locales.value.map(l => ({
  label: l.name,
  onSelect: () => setLocale(l.code),
  checked: l.code === locale.value,
} satisfies DropdownMenuItem)))
</script>

<template>
  <ClientOnly>
    <UDropdownMenu :items :content="{ align: 'end', sideOffset: 16 }">
      <UButton :aria-label="`${localeProperties.code.toUpperCase()}, ${$t('language.toggle')}`" variant="ghost" color="neutral" size="sm"
               :label="localeProperties.code.toUpperCase()" icon="i-tabler-language" />
      <template #item-trailing="{ item }">
        <UIcon v-if="item.checked" name="i-tabler-point-filled" class="size-4" />
      </template>
    </UDropdownMenu>
    <template #fallback>
      <div class="size-8" />
    </template>
  </ClientOnly>
</template>
