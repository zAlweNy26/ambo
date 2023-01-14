<template>
	<div class="flex w-full items-center justify-between gap-4">
		<button class="btn btn-square btn-ghost" @click="toggleFullscreen">
			<Icon icon="fluent:full-screen-maximize-16-filled" class="text-primary h-8 w-8" aria-hidden="true" />
		</button>
		<h1>Ambo!</h1>
		<label for="closeModal" class="btn btn-square btn-ghost">
			<Icon icon="fluent:dismiss-12-filled" class="text-primary h-8 w-8" aria-hidden="true" />
		</label>
		<input id="closeModal" type="checkbox" class="modal-toggle">
		<label for="closeModal" class="modal cursor-pointer">
			<label class="modal-box relative flex w-fit flex-col items-center justify-center gap-2 p-4" for="">
				<h3 class="text-center text-lg font-bold">Sei sicuro di voler uscire?</h3>
				<p class="text-center">Così facendo, perderai i progressi fatti.</p>
				<div class="mt-2 flex gap-4">
					<label for="closeModal" class="btn btn-primary w-16 rounded-xl text-lg capitalize" @click="goHome">Sì</label>
					<label for="closeModal" class="btn btn-primary w-16 rounded-xl text-lg capitalize">No</label>
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