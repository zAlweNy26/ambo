<script setup lang="ts">
import { Icon } from '@iconify/vue'

const showLogo = ref(false)

const router = useRouter()

router.beforeEach((to) => {
	showLogo.value = ['/tabellone', '/cartelle', '/'].includes(to.path)
})
</script>

<template>
	<div class="navbar bg-base-200 min-h-fit">
		<div class="navbar-start">
			<img v-if="showLogo" alt="Ambo! Logo" class="w-6 h-6" src="@assets/logo.svg" />
			<a v-else href="/" class="btn btn-sm btn-ghost btn-square">
				<Icon icon="fluent:home-20-filled" class="w-6 h-6" aria-hidden="true" />
			</a>
		</div>
		<div class="gap-2 navbar-center">
			<p class="text-xs sm:text-sm">
				Aiutaci a mantenere gratis
				<span class="font-semibold text-primary">Ambo!</span>
				<span class="hidden ml-1 sm:inline">Dona con</span>
			</p>
			<a class="btn btn-sm btn-square btn-info btn-outline gap-2 sm:!w-auto sm:!px-3" 
				target="_blank" href="https://paypal.me/danyalwe" aria-label="Dona con PayPal">
				<Icon icon="logos:paypal" class="w-5 h-5" aria-hidden="true" />
				<span class="hidden sm:inline-block">PayPal</span>
			</a>
		</div>
		<div class="navbar-end">
			<ThemeButton class="block" />
		</div>
	</div>
</template>