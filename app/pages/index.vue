<script lang="ts" setup>
import napoletana from '~/assets/napoletana.json'

const { title } = useAppConfig()

const gameId = useRouteQuery<string>('id', '')
// Codes are lowercase hex: forgive capitals and spaces from pasting
const code = computed(() => gameId.value.trim().toLowerCase())
const valid = computed(() => /^[0-9a-f]{8}$/.test(code.value))

// The cards page sends players back here if the room answers that the game doesn't exist
async function joinGame(cards: number) {
  await navigateTo({
    name: 'cards',
    query: { id: code.value, n: cards },
  })
}

// A valid sample cartella (five numbers per row); 21 and 43 on the first row make an ambo
const sample = [
  4, 0, 21, 0, 43, 0, 62, 0, 85,
  0, 13, 0, 37, 48, 0, 66, 0, 88,
  9, 0, 28, 0, 0, 58, 0, 74, 90,
]
const marked = [21, 43, 66]

const prizes = [
  { name: 'ambo', count: 2 },
  { name: 'terna', count: 3 },
  { name: 'quaterna', count: 4 },
  { name: 'cinquina', count: 5 },
  { name: 'tombola', count: 15 },
] as const

// The same smorfia entry for everyone on a given day
const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86_400_000)
const today = napoletana[dayOfYear % napoletana.length]!
</script>

<template>
  <div class="mx-auto flex w-full max-w-6xl flex-col gap-20 py-6 lg:gap-28 lg:py-12">
    <section class="grid items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
      <div class="flex flex-col items-center gap-6 text-center lg:items-start lg:text-start">
        <h1 class="text-5xl font-extrabold tracking-tight text-balance text-highlighted sm:text-7xl">
          {{ $t('home.welcome', [title]) }}
        </h1>
        <p class="max-w-prose text-lg text-muted text-pretty sm:text-xl">
          {{ $t('home.subtitle') }}
        </p>
        <div class="grid w-full max-w-md gap-3 sm:grid-cols-2">
          <UButton :label="$t('header.board')" block icon="i-tabler-grid-dots" size="xl"
                   :to="$localePath('board')" />
          <UModal :title="$t('cards.title')" :description="$t('cards.description')" :ui="{
            content: 'sm:max-w-md',
            body: 'grid grid-cols-2 place-content-center gap-3',
          }" :defaultOpen="!!gameId">
            <UButton :label="$t('header.cards')" block icon="i-tabler-cards" size="xl" color="neutral" variant="outline" />
            <template #body>
              <UFormField class="col-span-2" size="xl" :label="$t('game.id')" required>
                <UInput v-model="gameId" :placeholder="$t('game.id')" icon="i-tabler-lock-password" class="w-full"
                        :ui="{ base: 'tracking-wider tabular-nums' }" />
              </UFormField>
              <UButton v-for="n in 6" :key="n" :disabled="!valid" :label="$t('cards.quantity', [n], n)"
                       block size="lg" :color="!valid ? 'neutral' : 'primary'" :variant="!valid ? 'outline' : 'solid'"
                       @click="joinGame(n)" />
            </template>
          </UModal>
        </div>
      </div>

      <div class="relative mx-auto w-full max-w-lg pt-10 pe-4" aria-hidden="true">
        <div class="panel relative overflow-hidden border-[var(--print-line)] shadow-[0_24px_48px_-24px_rgb(28_25_23/0.35)] -rotate-2">
          <div class="flex items-center justify-between bg-primary px-4 py-2 text-xs text-white">
            <span class="font-medium tabular-nums">#1</span>
            <span class="tabular-nums">3/15</span>
          </div>
          <div class="grid grid-cols-9">
            <span v-for="(n, i) in sample" :key="i" class="numero print aspect-square text-base sm:text-xl"
                  :class="[!n && 'blank', i % 9 !== 8 && 'border-e', i < 18 && 'border-b']"
                  :data-state="marked.includes(n) ? 'on' : undefined">
              {{ n || '' }}
            </span>
          </div>
        </div>
        <span class="absolute start-2 top-12 rotate-[-14deg] rounded-md border-2 border-primary bg-elevated px-2 py-0.5 text-sm font-extrabold uppercase tracking-wide text-primary">
          Ambo!
        </span>
        <div class="absolute -top-2 end-0 flex items-center gap-3 rounded-2xl border border-default bg-elevated py-2 ps-2 pe-4 shadow-[0_16px_32px_-16px_rgb(28_25_23/0.4)] rotate-3">
          <span class="legno grid size-14 place-content-center rounded-full text-2xl font-bold text-tombola-800 tabular-nums">{{ today.number }}</span>
          <span class="flex flex-col text-start leading-tight">
            <span class="text-2xs font-medium uppercase tracking-wider text-muted">{{ $t('home.today') }}</span>
            <span class="font-semibold text-highlighted">{{ today.original }}</span>
            <span class="text-xs text-muted">{{ today.translated }}</span>
          </span>
        </div>
      </div>
    </section>

    <section class="flex flex-col gap-8">
      <h2 class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">
        {{ $t('home.how') }}
      </h2>
      <ol class="grid gap-8 sm:grid-cols-3">
        <li v-for="n in 3" :key="n" class="flex flex-col gap-2 border-t-2 border-primary pt-4">
          <span class="text-4xl font-extrabold text-primary tabular-nums">{{ n }}</span>
          <span class="text-lg font-semibold text-highlighted">{{ $t(`home.step${n}`) }}</span>
          <span class="text-muted text-pretty">{{ $t(`home.step${n}Text`) }}</span>
        </li>
      </ol>
    </section>

    <section class="flex flex-col gap-8">
      <div class="flex flex-col gap-2">
        <h2 class="text-3xl font-bold tracking-tight text-highlighted sm:text-4xl">
          {{ $t('home.prizes') }}
        </h2>
        <p class="text-muted">
          {{ $t('home.prizesText') }}
        </p>
      </div>
      <ul class="panel grid divide-y divide-default sm:grid-cols-5 sm:divide-x sm:divide-y-0">
        <li v-for="prize in prizes" :key="prize.name" class="flex items-center gap-4 p-5 sm:flex-col sm:items-start">
          <span class="legno grid size-14 shrink-0 place-content-center rounded-full text-xl font-bold text-tombola-800 tabular-nums">{{ prize.count }}</span>
          <span class="flex flex-col gap-1">
            <span class="text-lg font-bold capitalize text-highlighted">{{ prize.name }}</span>
            <span class="text-sm text-muted text-pretty">{{ $t(`home.${prize.name}`) }}</span>
          </span>
        </li>
      </ul>
    </section>
  </div>
</template>
