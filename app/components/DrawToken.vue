<script lang="ts" setup>
defineProps<{
  number?: number
}>()
</script>

<template>
  <div class="relative grid aspect-square w-full max-w-56 place-content-center rounded-full border border-default bg-elevated shadow-[0_12px_32px_-16px_rgb(28_25_23/0.35)]">
    <Transition name="token" mode="out-in">
      <div v-if="number" :key="number"
           class="legno absolute inset-[11%] grid place-content-center rounded-full text-tombola-800">
        <span class="text-6xl font-semibold tabular-nums tracking-tight sm:text-7xl">{{ number }}</span>
      </div>
      <span v-else class="text-2xl text-dimmed">–</span>
    </Transition>
  </div>
</template>

<style scoped>
/* A token rolls out of the bag: drops in with a quarter turn and settles */
.token-enter-active {
  transition: transform 0.55s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s ease-out;
}

.token-leave-active {
  transition: transform 0.2s ease-in, opacity 0.2s ease-in;
}

.token-enter-from {
  transform: translateY(-24%) rotate(-90deg) scale(0.6);
  opacity: 0;
}

.token-leave-to {
  transform: scale(0.85);
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .token-enter-active,
  .token-leave-active {
    transition: opacity 0.15s linear;
  }

  .token-enter-from,
  .token-leave-to {
    transform: none;
  }
}
</style>
