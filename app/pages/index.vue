<script lang="ts" setup>
const { title } = useAppConfig()

const { t } = useI18n(), toast = useToast()

const gameId = useRouteQuery<string>('id', '')

async function checkGame(cards: number) {
  const { found } = await $fetch('/api/game/join', { query: { id: gameId.value } })
  if (!found) {
    toast.add({
      title: t('game.error.title'),
      description: t('game.error.description'),
      color: 'error',
    })
    return
  }
  await navigateTo({ name: 'cards', query: { id: gameId.value, n: cards } })
}

// A sample cartella row as the page's one tombola cue
const sample = [4, 0, 21, 0, 43, 0, 62, 0, 85]
</script>

<template>
  <section class="mx-auto flex w-full max-w-2xl grow flex-col items-center justify-center gap-10 py-10 text-center">
    <div class="flex flex-col items-center gap-4">
      <h1 class="text-4xl font-semibold tracking-tight text-balance text-highlighted sm:text-6xl">
        {{ $t('home.welcome', [title]) }}
      </h1>
      <p class="max-w-prose text-lg text-muted text-pretty">
        {{ $t('home.subtitle') }}
      </p>
    </div>

    <div class="panel grid w-full max-w-md grid-cols-9 overflow-hidden" aria-hidden="true">
      <span v-for="(n, i) in sample" :key="i" class="numero aspect-square border-default text-base sm:text-lg"
            :class="[!n && 'blank', i < 8 && 'border-e']"
            :data-state="n === 43 ? 'on' : undefined">
        {{ n || '' }}
      </span>
    </div>

    <div class="grid w-full max-w-md gap-3 sm:grid-cols-2">
      <NuButton :label="$t('header.board')" block icon="i-tabler-grid-dots" size="xl"
                :to="$localePath('board')" />
      <NuModal :title="$t('cards.title')" :description="$t('cards.description')" :ui="{
        content: 'sm:max-w-md',
        body: 'grid grid-cols-2 place-content-center gap-3',
      }" :defaultOpen="!!gameId">
        <NuButton :label="$t('header.cards')" block icon="i-tabler-cards" size="xl" color="neutral" variant="outline" />
        <template #body>
          <NuFormField class="col-span-2" size="xl" :label="$t('game.id')" required>
            <NuInput v-model="gameId" :placeholder="$t('game.id')" icon="i-tabler-lock-password" class="w-full"
                     :ui="{ base: 'tracking-wider tabular-nums' }" />
          </NuFormField>
          <NuButton v-for="n in 6" :key="n" :disabled="gameId.length !== 8" :label="$t('cards.quantity', [n], n)"
                    block size="lg" :color="gameId.length !== 8 ? 'neutral' : 'primary'" :variant="gameId.length !== 8 ? 'outline' : 'solid'"
                    @click="checkGame(n)" />
        </template>
      </NuModal>
    </div>
  </section>
</template>
