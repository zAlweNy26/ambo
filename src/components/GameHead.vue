<template>
	<div class="flex items-center justify-between w-full gap-4">
		<button class="btn btn-square btn-ghost" title="Abilita o disabilita lo schermo intero" @click="toggleFullscreen">
			<Icon icon="fluent:full-screen-maximize-16-filled" class="w-8 h-8 text-primary" aria-hidden="true" />
		</button>
		<h1>Ambo!</h1>
		<label for="closeModal" title="Esci" class="btn btn-square btn-ghost">
			<Icon icon="fluent:dismiss-12-filled" class="w-8 h-8 text-primary" aria-hidden="true" />
		</label>
		<input id="closeModal" type="checkbox" class="modal-toggle">
		<label for="closeModal" class="cursor-pointer modal">
			<label class="relative flex flex-col items-center justify-center gap-2 p-4 modal-box w-fit" for="">
				<h3 class="text-lg font-bold text-center">Sei sicuro di voler uscire?</h3>
				<p class="text-center">Così facendo, perderai i progressi fatti.</p>
				<div class="flex gap-4 mt-2">
					<label for="closeModal" class="w-16 text-lg capitalize btn btn-primary rounded-xl" @click="goHome">Sì</label>
					<label for="closeModal" class="w-16 text-lg capitalize btn btn-primary rounded-xl">No</label>
				</div>
			</label>
		</label>
	</div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { ref, onMounted } from 'vue'

const isFullscreen = ref(false)
const safeExit = ref(false)

const toggleFullscreen = () => {
    isFullscreen.value = !isFullscreen.value

    const root = document.documentElement
    if (!document.fullscreenEnabled) return

    if (isFullscreen.value) root.requestFullscreen()
    else document.exitFullscreen()
}

const goHome = () => {
	safeExit.value = true
	window.location.href = "/"
}

onMounted(() => {
    window.onbeforeunload = (event) => {
		if (!safeExit.value) {
			event.preventDefault()
			return event.returnValue = ""
		}
    }
})
</script>