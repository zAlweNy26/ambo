<script lang="ts" setup>
definePageMeta({
  middleware: [
    (to) => {
      if (!to.query.id) return navigateTo('/')
    },
  ],
})

const gameId = useRouteQuery<string>('id', '')
const { t } = useI18n(), toast = useToast()
// Stable per device, so reconnects, reloads and a killed browser get the same cartelle back
const player = useLocalStorage('player', () => crypto.randomUUID())

const amount = useRouteQuery('n', 1, {
  transform: v => Math.min(Math.max(Number(v) || 1, 1), 6),
})

const extractions = ref<number[]>([]), winners = ref<Winner[]>([])

// The room deals the cartelle and checks claims against them; this copy shows them at once after a reload.
// Marks and claims only live on the phone, one game at a time.
const saved = useLocalStorage('cartelle', {
  gameId: '',
  cards: [] as number[][],
  marked: [] as number[][],
  claimed: [] as Prize[],
})
if (saved.value.gameId !== gameId.value) {
  saved.value = {
    gameId: gameId.value,
    cards: [],
    marked: [],
    claimed: [],
  }
}
const cards = computed(() => saved.value.cards)
const signedNumbers = computed(() => saved.value.marked)

function goHome(title: string, description?: string) {
  navigateTo({ path: '/', query: {} }, { redirectCode: 302 })
  toast.add({ title, description, color: 'error' })
}

const room = useRoom(gameId, () => ({ type: 'join', player: player.value, cards: amount.value }), (message) => {
  switch (message.type) {
    case 'state':
      extractions.value = message.extractions
      winners.value = message.winners
      // New cards (first join, or another amount before the first draw) start the marks over
      if (message.cards && JSON.stringify(message.cards) !== JSON.stringify(saved.value.cards)) {
        saved.value = {
          ...saved.value,
          cards: message.cards,
          marked: message.cards.map(() => []),
        }
      }
      break
    case 'draw':
      extractions.value = [...extractions.value, message.number]
      break
    case 'winners':
      winners.value = message.winners
      break
    case 'claim':
      if (message.ok) {
        saved.value.claimed = [...saved.value.claimed, message.prize]
        toast.add({
          title: t('claim.won', { prize: message.prize }),
          color: 'success',
          icon: 'i-tabler-trophy',
        })
      }
      else {
        toast.add({
          title: t(`claim.${message.reason}`, { prize: message.prize }),
          color: 'error',
        })
      }

      break
    case 'closed':
      room.close()
      toast.add({
        title: t('game.closed'),
        icon: 'i-tabler-flag',
      })
      break
    case 'error':
      // Gone or full before we ever got cards: back home. Once playing, keep the cards on screen.
      room.close()
      if (cards.value.length) break
      if (message.reason === 'full') goHome(t('game.full'))
      else goHome(t('game.error.title'), t('game.error.description'))
  }
})

const lastExtractions = computed(() => extractions.value.slice(-5))

const searchNumber = ref(1), numberFound = ref<boolean>()

const remaining = computed(() => new Set(cards.value.flat().filter(r => r !== 0)).size - new Set(signedNumbers.value.flat()).size)

function toggleNumber(card: number, num: number, force = false) {
  if (num === 0) return
  const index = signedNumbers.value[card]!.indexOf(num)
  if (index > -1 && force) return
  if (index > -1) signedNumbers.value[card]!.splice(index, 1)
  else signedNumbers.value[card]!.push(num)
}

function checkNumber(num: number, check = true) {
  numberFound.value = undefined
  const indexes = cards.value.flatMap((c, j) => c.map(n => n === num
    ? j
    : -1)).filter(v => v !== -1)
  if (indexes.length === 0 && check) numberFound.value = false
  else {
    if (check) numberFound.value = true
    for (const card of indexes) toggleNumber(card, num, check)
  }
}

// Optional help for kids and grandparents: marks every drawn number, never unmarks; tapping still works
const autoMark = useLocalStorage('cards:autoMark', false)
watchImmediate([extractions, autoMark], () => {
  if (!autoMark.value) return
  for (const num of extractions.value) {
    cards.value.forEach((card, ci) => {
      if (card.includes(num)) toggleNumber(ci, num, true)
    })
  }
})

// The prize each cartella can claim now: its best row (or full card), unless that prize is gone or already ours
const claimable = computed(() => cards.value.map((card, ci) => {
  const best = bestPrize(card, signedNumbers.value[ci] ?? [], extractions.value)
  // Same rule as the room: someone else's win on this very draw is a tie, still claimable
  const gone = !best || saved.value.claimed.includes(best.prize)
    || isPrizeClosed(best.prize, winners.value, extractions.value.length)
  return gone ? undefined : best
}))

const playerName = useLocalStorage('player:name', '')
const nameOpen = ref(false), nameDraft = ref(''), pendingCard = ref(0)

function claim(ci: number) {
  pendingCard.value = ci
  if (playerName.value) return sendClaim()
  nameDraft.value = ''
  nameOpen.value = true
}

function confirmName() {
  if (!nameDraft.value.trim()) return
  playerName.value = nameDraft.value.trim()
  nameOpen.value = false
  sendClaim()
}

function sendClaim() {
  const best = claimable.value[pendingCard.value]
  if (best) {
    room.send({
      type: 'claim',
      card: pendingCard.value,
      prize: best.prize,
      name: playerName.value,
    })
  }
}
</script>

<template>
  <section class="mx-auto flex w-full max-w-5xl grow touch-pan-y flex-col items-center gap-6 overscroll-y-contain">
    <GameHeader :remaining :confirm-exit="cards.length > 0">
      <template #title>
        <i18n-t keypath="cards.quantity" tag="span" :plural="amount">
          <span>{{ amount }}</span>
        </i18n-t>
      </template>
    </GameHeader>

    <div v-if="lastExtractions.length > 0" class="flex flex-col items-center gap-3" aria-live="polite">
      <p class="text-sm text-muted">
        {{ $t('board.extractions', [lastExtractions.length], lastExtractions.length) }}
      </p>
      <div v-auto-animate class="flex flex-row-reverse items-center justify-center gap-3">
        <span v-for="(num, i) in lastExtractions" :key="num" class="numero"
              :class="i === lastExtractions.length - 1 ? 'size-16 text-2xl' : 'size-11 text-base'"
              :data-state="i === lastExtractions.length - 1 ? 'latest' : 'on'">
          {{ num }}
        </span>
      </div>
      <p v-if="winners.length" class="text-center text-sm text-muted">
        {{ $t('cards.winners') }}:
        <template v-for="(w, i) in winners" :key="i">
          <span v-if="i" aria-hidden="true"> · </span>
          <span class="capitalize">{{ w.prize }}</span> <strong class="text-highlighted">{{ w.name }}</strong>
        </template>
      </p>
    </div>

    <div class="flex w-full max-w-sm flex-col gap-1.5">
      <UFieldGroup class="w-full">
        <UInputNumber v-model="searchNumber" size="lg" :min="1" :step="1" :max="90" class="grow"
                      :aria-label="$t('cards.search')" @change="() => numberFound = undefined" />
        <UButton icon="i-tabler-search" size="lg" color="neutral" variant="outline" :label="$t('cards.search')" @click="checkNumber(searchNumber)" />
      </UFieldGroup>
      <i18n-t v-if="numberFound !== undefined" class="text-center text-sm" :class="[numberFound ? 'text-success' : 'text-error']"
              :keypath="`cards.${numberFound ? 'found' : 'notFound'}`" tag="p" role="status">
        <strong>{{ searchNumber }}</strong>
      </i18n-t>
      <USwitch v-model="autoMark" :label="$t('cards.autoMark')" class="mt-2 self-center" />
    </div>

    <div class="grid w-full justify-items-center gap-5 lg:grid-cols-2">
      <div v-for="(card, ci) in cards" :key="ci" class="panel w-full max-w-xl overflow-hidden border-[var(--print-line)]">
        <div class="flex items-center justify-between bg-primary px-4 py-2 text-xs text-white">
          <span class="font-medium tabular-nums">#{{ ci + 1 }}</span>
          <UButton v-if="claimable[ci]" size="xs" color="neutral" icon="i-tabler-trophy"
                   class="bg-white font-bold capitalize text-tombola-700 hover:bg-white/90"
                   :label="`${claimable[ci].prize}!`" @click="claim(ci)" />
          <span class="tabular-nums text-white">{{ signedNumbers[ci]?.length ?? 0 }}/15</span>
        </div>
        <div class="grid select-none grid-cols-9">
          <button v-for="(number, ni) in card" :key="`${ci}-${ni}`" type="button"
                  class="numero print aspect-square text-lg sm:text-xl"
                  :class="[
                    number === 0 ? 'blank' : 'cursor-pointer hover:bg-primary/5',
                    ni % 9 !== 8 && 'border-e',
                    ni < 18 && 'border-b',
                  ]"
                  :disabled="number === 0" :aria-pressed="number !== 0 ? signedNumbers[ci]?.includes(number) : undefined"
                  :data-state="signedNumbers[ci]?.includes(number) ? 'on' : undefined"
                  @click="checkNumber(number, false)">
            {{ number !== 0 ? number : '' }}
          </button>
        </div>
      </div>
    </div>

    <UModal v-model:open="nameOpen" :title="$t('claim.title')" :description="$t('claim.description')" :ui="{ content: 'sm:max-w-sm' }">
      <template #body>
        <form class="flex flex-col gap-4" @submit.prevent="confirmName">
          <UFormField :label="$t('claim.name')" required>
            <UInput v-model="nameDraft" autofocus maxlength="24" autocomplete="given-name" class="w-full" />
          </UFormField>
          <UButton type="submit" block size="lg" icon="i-tabler-trophy" :disabled="!nameDraft.trim()"
                   :label="$t('claim.submit', { prize: claimable[pendingCard]?.prize ?? '' })" />
        </form>
      </template>
    </UModal>
  </section>
</template>
