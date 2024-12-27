<script lang="ts" setup>
const { toggleTheme } = useSettingsStore()
</script>

<template>
	<ClientOnly>
		<NuButton variant="outline" color="neutral" square @click="toggleTheme()">
			<NuIcon name="i-tabler-moon" class="size-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
			<NuIcon name="i-tabler-sun" class="absolute size-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
			<span class="sr-only">{{ $t('theme.toggle') }}</span>
		</NuButton>
		<template #fallback>
			<div class="size-8" />
		</template>
	</ClientOnly>
</template>
