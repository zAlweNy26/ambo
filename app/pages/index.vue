<script lang="ts" setup>
const { title } = useAppConfig()

const { t } = useI18n(), toast = useToast()

const gameId = ref('')

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
</script>

<template>
  <section class="mx-auto flex max-w-6xl gap-2 text-center justify-center items-center grow flex-col">
    <h1 class="text-3xl font-bold">
      {{ $t('home.welcome', [title]) }}
    </h1>
    <p class="text-sm font-medium text-base-content">
      {{ $t('home.subtitle') }}
    </p>
    <div class="space-y-8 mt-8">
      <NuButton :label="$t('header.board')" block icon="i-tabler-grid-dots" size="xl"
                :to="$localePath('board')" />
      <NuModal :title="$t('cards.title')" :description="$t('cards.description')" :ui="{
        content: 'sm:max-w-md',
        body: 'grid grid-cols-2 place-content-center gap-4',
      }">
        <NuButton :label="$t('header.cards')" block icon="i-tabler-cards-filled" size="xl" />
        <template #body>
          <NuFormField class="col-span-2" size="xl" :label="$t('game.id')" required>
            <NuInput v-model="gameId" :placeholder="$t('game.id')" icon="i-tabler-lock-password" class="w-full"
                     :ui="{ leadingIcon: 'text-[var(--ui-primary)]' }" />
          </NuFormField>
          <NuButton v-for="n in 6" :key="n" :disabled="gameId.length !== 8" :variant="gameId.length !== 8 ? 'outline' : 'solid'"
                    :label="$t('cards.quantity', [n], n)" block size="xl" @click="checkGame(n)" />
        </template>
      </NuModal>
    </div>
  </section>
</template>
