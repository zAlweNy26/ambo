<script setup lang="ts">
import { Icon } from '@iconify/vue'

const isDark = ref(false)

function setTheme(dark: boolean) {
	document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
	localStorage.setItem('theme', dark ? 'dark' : 'light')
	let meta = document.querySelector('meta[name="theme-color"]')
	if (!meta) {
		const head = document.querySelector('head')
		meta = document.createElement('meta')
		meta.setAttribute('name', 'theme-color')
		meta.setAttribute('content', dark ? '#F97316' : '#5B06D6')
		head?.appendChild(meta)
	}
	meta?.setAttribute('content', dark ? '#F97316' : '#5B06D6')
}

function toggleTheme() {
	setTheme(isDark.value = !isDark.value)
	window.dispatchEvent(new Event('storage'))
}

onMounted(() => {
	isDark.value = localStorage.getItem("theme") === 'dark' ||
		(!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
	setTheme(isDark.value)
})
</script>

<template>
	<button class="btn btn-sm btn-ghost btn-square" title="Change theme" data-toggle-theme="dark,light" @click="toggleTheme">
		<div class="indicator mt-0.5">
			<span class="sr-only">Change theme mode</span>
			<Icon v-if="!isDark" icon="eva:moon-fill" class="w-6 h-6" aria-hidden="true" />
			<Icon v-else icon="eva:sun-fill" class="w-6 h-6" aria-hidden="true" />
		</div>
	</button>
</template>