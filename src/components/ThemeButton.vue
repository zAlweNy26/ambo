<template>
	<button class="btn btn-ghost btn-square" title="Change theme" data-toggle-theme="dark,light" @click="toggleTheme">
		<div class="indicator mt-0.5">
			<span class="sr-only">Change theme mode</span>
			<Icon v-if="!isDark" icon="eva:moon-fill" class="h-6 w-6" aria-hidden="true" />
			<Icon v-else icon="eva:sun-fill" class="h-6 w-6" aria-hidden="true" />
		</div>
	</button>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, onMounted } from 'vue'

const isDark = ref(false)

function setTheme(dark: boolean) {
	document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
	localStorage.setItem('theme', dark ? 'dark' : 'light')
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