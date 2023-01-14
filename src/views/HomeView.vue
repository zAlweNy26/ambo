<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-8 grow">
    <a class="gap-2 btn btn-primary rounded-xl" href="/tabellone">
      <Icon icon="fluent:grid-dots-20-filled" class="w-8 h-8" aria-hidden="true" />
      <span class="text-lg capitalize">Tabellone</span>
    </a>
    <a class="gap-2 btn btn-primary rounded-xl" href="/cartelle">
      <Icon icon="fluent:playing-cards-20-filled" class="w-8 h-8" aria-hidden="true" />
      <span class="text-lg capitalize">Cartelle</span>
    </a>
  </div>
</template>
