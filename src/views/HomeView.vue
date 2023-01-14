<script setup lang="ts">
import { Icon } from '@iconify/vue'

const numCards = new Array(6).fill(0).map((v, i) => i + 1)
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-8 grow">
    <a class="gap-2 btn btn-primary rounded-xl" href="/tabellone">
      <Icon icon="fluent:grid-dots-20-filled" class="w-8 h-8" aria-hidden="true" />
      <span class="text-lg capitalize">Tabellone</span>
    </a>
    <label for="numCards" class="gap-2 btn btn-primary rounded-xl">
      <Icon icon="fluent:playing-cards-20-filled" class="w-8 h-8" aria-hidden="true" />
      <span class="text-lg capitalize">Cartelle</span>
    </label>
    <input id="numCards" type="checkbox" class="modal-toggle">
		<label for="numCards" class="cursor-pointer modal">
			<label class="relative flex flex-col items-center justify-center gap-4 modal-box" for="">
				<h3 class="text-lg font-bold text-center">Con quante cartelle vuoi giocare?</h3>
				<div class="grid items-center justify-center grid-cols-2 gap-4">
          <a v-for="card in numCards" :href="`/cartelle#${card}`" class="btn btn-primary">
            <span class="text-lg capitalize shrink-0">{{ card }} {{ card > 1 ? 'cartelle' : 'cartella' }}</span>
          </a>
        </div>
			</label>
		</label>
  </div>
</template>
