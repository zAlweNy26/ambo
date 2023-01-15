<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<template>
	<div class="flex flex-col items-center justify-center gap-8 text-center grow">
		<h1 class="text-3xl font-bold">Penso tu abbia smarrito le tue cartelle...</h1>
		<div>
			<p>Mi dispiace, ma se ne vuoi altre devi tornare indietro.</p>
			<p>Visita la pagina principale per iniziare a giocare!</p>
		</div>
		<a class="gap-2 text-lg btn btn-primary" href="/">
			<Icon icon="fluent:arrow-enter-left-20-filled" class="w-6 h-6 shrink-0" />
			<span>Torna alla Home</span>
		</a>
	</div>
</template>
