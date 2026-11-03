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

const extractions = ref<number[]>([]), winners = ref<Winner[]>([]), prize = ref(0), split = ref<Split>(), smirk = ref<Smorfia>()
// The price of one cartella, set by the host only when the pool comes from the cartelle sold
const price = ref<number>()

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
// After the first draw the room keeps the cartelle it dealt, whatever amount the link asks for
const dealt = computed(() => cards.value.length || amount.value)
const signedNumbers = computed(() => saved.value.marked)

function goHome(title: string, description?: string) {
  navigateTo({ path: '/', query: {} }, { redirectCode: 302 })
  toast.add({ title, description, color: 'error' })
}

// For players who can't keep an eye on the board; the board's announcer does the talking. iPhones can't vibrate.
const canVibrate = 'vibrate' in navigator
const vibrate = useLocalStorage('cards:vibrate', false)

function hello(): ClientMessage {
  return {
    type: 'join',
    player: player.value,
    cards: amount.value,
  }
}

const room = useRoom(gameId, hello, (message) => {
  switch (message.type) {
    case 'state':
      extractions.value = message.extractions
      winners.value = message.winners
      prize.value = message.prize
      split.value = message.split
      price.value = message.price
      smirk.value = message.smirk
      // New cards (first join, another amount before the first draw, a new round) start marks and claims over
      if (message.cards && JSON.stringify(message.cards) !== JSON.stringify(saved.value.cards)) {
        saved.value = {
          ...saved.value,
          cards: message.cards,
          marked: message.cards.map(() => []),
          claimed: [],
        }
      }
      break
    case 'draw':
      extractions.value = [...extractions.value, message.number]
      if (vibrate.value) navigator.vibrate?.(200)
      break
    case 'winners':
      winners.value = message.winners
      break
    case 'prize':
      prize.value = message.total
      split.value = message.split
      price.value = message.price
      break
    case 'smirk':
      smirk.value = message.smirk
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
    case 'round':
      room.send(hello())
      toast.add({
        title: t('game.round'),
        icon: 'i-tabler-refresh',
      })
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

// Only the prizes someone won, biggest first, with each winner's share
const wonPrizes = computed(() => Object.entries(prizeWinners(prize.value, winners.value, split.value)).filter(([, ws]) => ws.length).reverse())

const lastExtractions = computed(() => extractions.value.slice(-5))
// The host's smorfia, for the latest number
const meaning = useSmorfia(smirk, () => extractions.value.at(-1))

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

// The prize each cartella can claim now, by the room's rules: someone else's win on this very draw is a tie, still claimable
const claimable = computed(() => cards.value.map((card, ci) =>
  claimablePrize(card, signedNumbers.value[ci] ?? [], extractions.value, winners.value, saved.value.claimed, split.value)))

// With auto-mark a prize can arrive unnoticed: buzz and offer the claim once per new prize on a cartella
watch(claimable, (now, before) => now.forEach((prize, ci) => {
  if (!prize || prize === before[ci]) return
  navigator.vibrate?.([100, 50, 100])
  toast.add({
    title: t('claim.ready', { card: ci + 1, prize }),
    icon: 'i-tabler-trophy',
    actions: [
      {
        label: t('claim.submit', { prize }),
        onClick: () => claim(ci),
      },
    ],
  })
}))

function claim(card: number) {
  const prize = claimable.value[card]
  if (prize) room.send({ type: 'claim', card, prize })
}

// How the board and the winners list show this player
const myId = computed(() => shortId(player.value))
</script>

<template>
  <section class="mx-auto flex w-full max-w-5xl grow touch-pan-y flex-col items-center gap-6 overscroll-y-contain">
    <GameHeader :remaining :confirm-exit="cards.length > 0">
      <template #title>
        <i18n-t keypath="cards.quantity" tag="span" :plural="dealt">
          <span>{{ dealt }}</span>
        </i18n-t>
      </template>
    </GameHeader>

    <div class="-mt-3 flex flex-col items-center gap-1 text-sm text-muted">
      <p>
        {{ $t('cards.you') }} <span class="font-semibold tracking-wide text-highlighted tabular-nums">{{ myId }}</span>
      </p>
      <p v-if="price" class="tabular-nums">
        {{ $t('cards.cost', { total: $n(price * dealt, 'currency'), price: $n(price, 'currency') }) }}
      </p>
    </div>

    <div v-if="wonPrizes.length" class="panel w-full max-w-sm px-4 py-2">
      <p class="py-1.5 text-sm font-medium text-highlighted">
        {{ $t('cards.winners') }}
      </p>
      <dl class="divide-y divide-default text-sm">
        <div v-for="[name, ws] in wonPrizes" :key="name" class="flex justify-between gap-4 py-1.5">
          <dt class="capitalize text-muted">
            {{ name }}
          </dt>
          <dd class="text-end">
            <span v-for="(w, i) in ws" :key="i" class="block">
              <UIcon name="i-tabler-trophy" class="size-3.5 align-[-2px] text-primary" />
              <span class="font-medium tabular-nums" :class="w.player === myId ? 'text-primary' : 'text-highlighted'">{{ w.player }}</span>
              <span v-if="prize > 0" class="tabular-nums text-muted"> · {{ $n(w.amount, 'currency') }}</span>
            </span>
          </dd>
        </div>
      </dl>
    </div>

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
      <p v-if="meaning" class="text-center text-balance">
        <span class="block font-semibold text-highlighted">{{ meaning.original }}</span>
        <span class="text-sm text-muted">{{ meaning.translated }}</span>
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
      <USwitch v-if="canVibrate" v-model="vibrate" :label="$t('cards.vibrate')" class="self-center" />
    </div>

    <div class="grid w-full justify-items-center gap-5 lg:grid-cols-2">
      <div v-for="(card, ci) in cards" :key="ci" class="panel w-full max-w-xl overflow-hidden border-[var(--print-line)]">
        <div class="flex h-10 items-center justify-between bg-primary px-4 text-xs text-white">
          <span class="font-medium tabular-nums">#{{ ci + 1 }}</span>
          <UButton v-if="claimable[ci]" size="xs" color="neutral" icon="i-tabler-trophy"
                   class="bg-white font-bold capitalize text-tombola-700 hover:bg-white/90 motion-safe:animate-pulse"
                   :label="`${claimable[ci]}!`" @click="claim(ci)" />
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
  </section>
</template>
