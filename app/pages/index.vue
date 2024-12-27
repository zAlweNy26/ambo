<script lang="ts" setup>
const { title } = useAppConfig()

const gameId = ref('')
</script>

<template>
  <section class="mx-auto flex max-w-6xl gap-2 text-center justify-center items-center grow flex-col">
    <h1 class="text-4xl font-bold">
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
                    :label="$t('cards.quantity', [n], n)" block size="xl"
                    :to="$localePath({ name: 'cards', query: { id: gameId, n } })" />
        </template>
      </NuModal>
    </div>
  </section>
</template>
