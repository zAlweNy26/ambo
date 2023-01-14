<template>
	<div class="navbar bg-base-200 min-h-fit">
		<div class="navbar-start">
			<img v-if="showLogo" alt="Ambo! Logo" class="w-6 h-6" src="/favicon.ico" />
			<a v-else href="/" class="btn btn-sm btn-ghost btn-square">
				<Icon icon="eva:home-fill" class="w-6 h-6" aria-hidden="true" />
			</a>
		</div>
		<div class="gap-2 navbar-center">
			<p class="text-xs sm:text-sm">
				Aiutaci a mantenere gratis
				<span class="font-semibold text-primary">Ambo!</span>
				<span class="hidden ml-1 sm:inline">Dona con</span>
			</p>
			<a class="btn btn-sm btn-square btn-info btn-outline gap-2 sm:!w-auto sm:!px-3" href="https://paypal.me/danyalwe">
				<Icon icon="logos:paypal" class="w-5 h-5" aria-hidden="true" />
				<span class="hidden sm:inline-block">PayPal</span>
			</a>
		</div>
		<div class="navbar-end">
			<ThemeButton class="block" />
		</div>
	</div>
</template>

<script setup lang="ts">
import ThemeButton from '@components/ThemeButton.vue'
import { Icon } from '@iconify/vue'
import { onMounted, ref } from 'vue'

const showLogo = ref(true)

onMounted(() => {
	showLogo.value = ['/', '/tabellone', '/cartelle'].includes(window.location.pathname)
})
</script>