<script lang="ts" setup>
const { number } = defineProps<{
  number?: number
}>()

const INKS = ['#d7262e', '#ffd04a', '#0f7a45', '#1f4fa3']
const SPOKES = 16

const spokes = Array.from({ length: SPOKES }, (_, i) => {
  const a = (i / SPOKES) * Math.PI * 2
  const b = ((i + 1) / SPOKES) * Math.PI * 2
  const p = (r: number, t: number) => `${(100 + r * Math.cos(t)).toFixed(2)} ${(100 + r * Math.sin(t)).toFixed(2)}`
  return { d: `M100 100 L${p(84, a)} A84 84 0 0 1 ${p(84, b)} Z`, fill: INKS[i % INKS.length] }
})

const studs = Array.from({ length: 24 }, (_, i) => {
  const t = (i / 24) * Math.PI * 2
  return { cx: 100 + 92 * Math.cos(t), cy: 100 + 92 * Math.sin(t) }
})

// Each new draw spins the wheel a few full turns plus a random offset, so it never lands the same way twice
const turn = ref(0)
watch(() => number, (n, old) => {
  if (n && n !== old) turn.value += 720 + Math.round(Math.random() * 360)
})
</script>

<template>
  <div class="relative aspect-square w-full max-w-80 select-none">
    <svg viewBox="0 0 200 200" class="wheel size-full drop-shadow-[0_8px_10px_rgb(26_18_9/0.35)]"
         :style="{ transform: `rotate(${turn}deg)` }" aria-hidden="true">
      <circle cx="100" cy="100" r="98" fill="#1a1209" />
      <circle cx="100" cy="100" r="88" fill="#ff8904" stroke="#1a1209" stroke-width="2" />
      <circle v-for="(s, i) in studs" :key="i" :cx="s.cx" :cy="s.cy" r="2.6" fill="#ffd04a" stroke="#1a1209" stroke-width="1" />
      <path v-for="(s, i) in spokes" :key="i" :d="s.d" :fill="s.fill" stroke="#1a1209" stroke-width="2" stroke-linejoin="round" />
      <circle cx="100" cy="100" r="50" fill="#1a1209" />
    </svg>
    <div class="absolute inset-[26%] grid place-content-center rounded-full border-[3px] border-ink bg-carta text-ink">
      <Transition name="hub" mode="out-in">
        <span :key="number ?? 0" class="font-numeral text-6xl leading-none tabular-nums sm:text-7xl">
          {{ number ?? '–' }}
        </span>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.wheel {
  transition: transform 1.2s cubic-bezier(0.16, 1, 0.3, 1);
}

.hub-enter-active {
  transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1) 0.8s, opacity 0.2s ease-out 0.8s;
}

.hub-leave-active {
  transition: opacity 0.15s ease-in;
}

.hub-enter-from {
  transform: scale(0.4);
  opacity: 0;
}

.hub-leave-to {
  opacity: 0;
}

@media (prefers-reduced-motion: reduce) {
  .wheel,
  .hub-enter-active,
  .hub-leave-active {
    transition: none;
  }
}
</style>
