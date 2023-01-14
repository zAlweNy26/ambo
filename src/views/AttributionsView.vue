<script setup lang="ts">
import { Icon } from '@iconify/vue'

interface Package {
	name: string
	icon: string
	url: string
	color: string
}

const packages: Package[] = [
	{
		name: "Tailwind",
		icon: "https://tailwindcss.com/favicons/favicon-32x32.png?v=3",
		url: "https://tailwindcss.com/",
		color: "#38BDF8"
	},
	{
		name: "daisyUI",
		icon: "https://daisyui.com/favicon.ico",
		url: "https://daisyui.com/",
		color: "#F2DB43"
	},
	{
		name: "unDraw",
		icon: "https://undraw.co/favicon-32x32.png",
		url: "https://undraw.co/",
		color: "#544AF4"
	},
	{
		name: "Iconify",
		icon: "https://avatars.githubusercontent.com/u/50354982?s=200&v=4",
		url: "https://iconify.design/",
		color: "#1769AA"
	},
	{
		name: "Vue",
		icon: "https://vuejs.org/logo.svg",
		url: "https://vuejs.org/",
		color: "#42D392"
	},
	{
		name: "ESLint",
		icon: "https://eslint.org/favicon.ico",
		url: "https://eslint.org",
		color: "#4B32C3"
	},
	{
		name: "TypeScript",
		icon: "https://www.typescriptlang.org/favicon-32x32.png",
		url: "https://www.typescriptlang.org",
		color: "#3178C6"
	},
	{
		name: "PlayWright",
		icon: "https://playwright.dev/img/playwright-logo.svg",
		url: "https://playwright.dev",
		color: "#1D8D22"
	},
]
</script>

<template>
	<div class="flex flex-col items-center justify-center gap-8 grow">
		<div class="flex flex-col items-center justify-center">
			<h2 class="mb-4 text-4xl font-bold text-center text-primary">Attribuzioni</h2>
			<p class="text-center">Il sito web "Ambo!" è stato sviluppato grazie a questi progetti!</p>
		</div>
		<div class="flex flex-wrap items-center justify-center gap-8">
			<a v-for="pack in packages" :key="pack.name"
				class="gap-4 py-2 normal-case bg-transparent border-2 btn btn-ghost text-neutral h-fit md:text-lg"
				:href="pack.url" :style="`border-color: ${pack.color}`">
				<img :alt="pack.name" class="w-6 h-6 rounded-sm" :src="pack.icon" />
				{{ pack.name }}
			</a>
		</div>
	</div>
</template>
