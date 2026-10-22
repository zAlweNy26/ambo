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

// A sample cartella row, painted on the home panel
const sample = [4, 0, 21, 0, 43, 0, 62, 0, 85]
const blocks = ['bg-rosso', 'bg-verde', 'bg-blu', 'bg-arancio']
</script>

<template>
  <section class="mx-auto flex w-full max-w-3xl grow flex-col items-center justify-center gap-10 py-6">
    <div class="cart-panel frame-rosso w-full">
      <div class="cart-field flex flex-col items-center gap-6 px-4 py-8 text-center sm:px-10 sm:py-12">
        <h1 class="font-display text-5xl leading-tight text-balance sm:text-7xl">
          {{ $t('home.welcome', [title]) }}
        </h1>
        <p class="max-w-prose text-lg font-medium text-toned text-pretty">
          {{ $t('home.subtitle') }}
        </p>
        <div class="grid w-full max-w-md grid-cols-9 border-[3px] border-ink" aria-hidden="true">
          <span v-for="(n, i) in sample" :key="i" class="numero aspect-square border-ink text-lg sm:text-2xl"
                :class="[n ? 'bg-carta text-ink' : blocks[(i >> 1) % blocks.length], i < 8 && 'border-e-2']"
                :data-state="n === 43 ? 'on' : undefined">
            {{ n || '' }}
          </span>
        </div>
      </div>
    </div>

    <div class="grid w-full gap-4 sm:grid-cols-2">
      <NuButton :label="$t('header.board')" block icon="i-tabler-grid-dots" size="xl" class="py-4 text-xl"
                :to="$localePath('board')" />
      <NuModal :title="$t('cards.title')" :description="$t('cards.description')" :ui="{
        content: 'sm:max-w-md',
        body: 'grid grid-cols-2 place-content-center gap-3',
      }" :defaultOpen="!!gameId">
        <NuButton :label="$t('header.cards')" block icon="i-tabler-cards-filled" size="xl" color="neutral"
                  variant="solid" class="py-4 text-xl" />
        <template #body>
          <NuFormField class="col-span-2" size="xl" :label="$t('game.id')" required>
            <NuInput v-model="gameId" :placeholder="$t('game.id')" icon="i-tabler-lock-password" class="w-full"
                     :ui="{ base: 'font-numeral tracking-wider uppercase' }" />
          </NuFormField>
          <NuButton v-for="n in 6" :key="n" :disabled="gameId.length !== 8" :label="$t('cards.quantity', [n], n)"
                    block size="xl" @click="checkGame(n)" />
        </template>
      </NuModal>
    </div>
  </section>
</template>
