<script lang="ts" setup>
import { renderSVG } from 'uqr'

const route = useRoute(), router = useRouter()

// The hosted game and the host's choices survive a reload or crash; the settings carry over to the next game
const hosted = useLocalStorage('board:game', { gameId: '', hostId: '' })
const settings = useLocalStorage('board:settings', {
  smirk: undefined as Smorfia | undefined,
  totalPrize: 0.1,
  // The pool can instead be the price of a cartella times the cartelle sold, as with a real box
  perCard: false,
  price: 0.5,
  // The host plays the tabellone as 6 cartelle: it pays into a pool from cartelle sold and wins like a player
  playBoard: true,
  // Custom shares per prize, in percent; a prize at 0 isn't played. Missing means the default ladder, without tombolino
  split: undefined as Split | undefined,
  autoAnnounce: false,
  // Seconds between automatic draws
  drawEvery: 10,
}, { mergeDefaults: true })

const game = ref({ gameId: '', hostId: '' })
const gameId = computed(() => game.value.gameId)
const extractedNumbers = ref<number[]>([]), currentNumber = ref<number>()

async function newGame() {
  const { gameId: id, hostId } = await $fetch('/api/game/create', { method: 'POST' })
  game.value = { gameId: id, hostId }
  hosted.value = { ...game.value }
  router.replace({
    query: { id },
  })
}

// A reload of /board?id=… reconnects to the hosted game; the room answers with its state, or an error if it's gone
onMounted(() => {
  if (route.query.id && route.query.id === hosted.value.gameId) game.value = { ...hosted.value }
  else newGame()
})

const cards = TABELLONE.map(card => card.filter(Boolean))

const smirkOptions = SMORFIE.map(value => ({
  label: _Capitalize(value),
  value,
}))

const toast = useToast()
const { t } = useI18n()
const { title } = useAppConfig()
const { copy, copied } = useClipboard()
const { share, isSupported: isShareSupported } = useShare()

const { isSupported: isSpeechSupported, isPlaying, say, stop } = useVoice()

const remaining = computed(() => 90 - extractedNumbers.value.length)

const currentSmirk = useSmorfia(() => settings.value.smirk, currentNumber)

watchDeep(currentSmirk, () => {
  if (isPlaying.value) stop()
  if (settings.value.autoAnnounce && isSpeechSupported.value) speechText()
})

async function copyGameId() {
  copy(gameId.value)
  toast.add({
    title: t('toasts.copied'),
    description: `${$t('game.id')}: ${gameId.value}`,
    color: 'success',
    icon: 'i-tabler-copy-check',
    ui: { description: 'truncate' },
  })
}

const joinUrl = computed(() => `${window.location.origin}/?id=${gameId.value}`)
// Fixed black on white so phones scan it in either theme
const qrCode = computed(() => gameId.value
  ? renderSVG(joinUrl.value, { border: 2 })
  : '')

async function shareGameId() {
  if (isShareSupported.value) {
    try {
      await share({
        title,
        text: `${$t('game.id')}: ${gameId.value}`,
        url: joinUrl.value,
      })
    }
    catch (error) {
      console.error(error)
      copyGameId()
    }
  }
  else copyGameId()
}

function speechText() {
  if (!currentSmirk.value) return
  const { number, original, translated } = currentSmirk.value
  say(`${number}. ${original}. ${translated}.`)
}

const winners = ref<Winner[]>([]), players = ref<Player[]>([])
const cartelle = computed(() => players.value.reduce((sum, p) => sum + p.cards, 0))
const sold = computed(() => cartelle.value + (settings.value.playBoard
  ? TABELLONE.length
  : 0))
// shortcut: cartelle dealt after the first draw still raise the pool, and amounts already won with it
const pot = computed(() => settings.value.perCard
  ? Math.round(settings.value.price * sold.value * 10) / 10
  : settings.value.totalPrize)
// Sent to the phones only while the pool comes from it
const price = computed(() => settings.value.perCard
  ? settings.value.price
  : undefined)
const splittedPrize = computed(() => splitPrize(pot.value, settings.value.split))
const wonPrizes = computed(() => prizeWinners(pot.value, winners.value, settings.value.split))
const customSplit = computed({
  get: () => !!settings.value.split,
  set: on => settings.value.split = on
    ? { ...DEFAULT_SPLIT }
    : undefined,
})
const splitTotal = computed(() => settings.value.split
  ? Object.values(settings.value.split).reduce((a, b) => a + b, 0)
  : 100)

let drawDone: (() => void) | undefined

const room = useRoom(gameId, () => ({ type: 'host', host: game.value.hostId }), (message) => {
  switch (message.type) {
    case 'state':
      extractedNumbers.value = message.extractions
      currentNumber.value ??= message.extractions.at(-1)
      winners.value = message.winners
      players.value = message.players
      // The room keeps the pool for the phones; the host's own setting wins
      if (message.prize !== pot.value || !isEqual(message.split, settings.value.split) || message.price !== price.value) sendPrize()
      if (settings.value.smirk && message.smirk !== settings.value.smirk) room.send({ type: 'smirk', smirk: settings.value.smirk })
      claimTabellone()
      break
    case 'draw':
      extractedNumbers.value = [...extractedNumbers.value, message.number]
      currentNumber.value = message.number
      drawDone?.()
      claimTabellone()
      break
    case 'winners':
      message.winners.slice(winners.value.length).forEach(announceWinner)
      winners.value = message.winners
      break
    case 'players':
      players.value = message.players
      break
    case 'round':
      extractedNumbers.value = []
      currentNumber.value = undefined
      winners.value = []
      players.value = []
      break
    case 'error':
      // The hosted game expired (a day) or isn't ours: start a new one
      if (message.reason !== 'full') newGame()
  }
})

// Every drawn number is marked on the tabellone, so the board claims for it as soon as one of its cartelle earns a prize
function claimTabellone() {
  if (!settings.value.playBoard) return
  const won = winners.value.filter(w => w.player === TABELLONE_ID).map(w => w.prize)
  TABELLONE.forEach((card, i) => {
    const prize = claimablePrize(card, extractedNumbers.value, extractedNumbers.value, winners.value, won, settings.value.split)
    if (prize) room.send({ type: 'claim', card: i, prize })
  })
}

function sendPrize() {
  room.send({
    type: 'prize',
    total: pot.value,
    split: settings.value.split,
    price: price.value,
  })
}

watch(() => settings.value.smirk, smirk => smirk && room.send({ type: 'smirk', smirk }))
watch(() => settings.value.playBoard, claimTabellone)
watchDebounced([
  pot,
  price,
  () => settings.value.split,
], sendPrize, { debounce: 500, deep: true })

// Leaving through the app ends the game; closing or reloading the tab doesn't, so the board can resume it
onBeforeUnmount(() => {
  if (!gameId.value) return
  room.send({ type: 'close' })
  hosted.value = { gameId: '', hostId: '' }
})

// Not kept across reloads, so a reopened board never starts drawing by itself
const autoDraw = ref(false)
function announceWinner({ player, prize }: Winner) {
  // The host checks the win before drawing on
  autoDraw.value = false
  const title = player === TABELLONE_ID
    ? t('claim.board', { prize })
    : t('claim.announce', { player, prize })
  toast.add({
    title,
    color: 'success',
    icon: 'i-tabler-trophy',
  })
  if (settings.value.autoAnnounce && isSpeechSupported.value) say(title)
}

const roundOpen = ref(false)
function newRound() {
  roundOpen.value = false
  room.send({ type: 'round' })
}

// Resolves when the room broadcasts the number, so the button spins until every phone has it too.
// A draw still in flight is shared, so a click during an automatic draw can't send two.
let drawing: Promise<void> | undefined
function extractNumber() {
  return drawing ??= new Promise<void>((resolve) => {
    const timeout = setTimeout(() => {
      drawDone = undefined
      toast.add({
        title: t('toasts.drawFailed'),
        color: 'error',
        icon: 'i-tabler-alert-triangle',
      })
      resolve()
    }, 5000)
    drawDone = () => {
      clearTimeout(timeout)
      drawDone = undefined
      resolve()
    }
    room.send({ type: 'draw' })
  }).finally(() => drawing = undefined)
}

const canDraw = computed(() => remaining.value > 0 && !!settings.value.smirk && !!gameId.value)
// A tick while the announcer still speaks is skipped, so every number is heard in full
const { pause, resume } = useIntervalFn(() => {
  if (!isPlaying.value) extractNumber()
}, () => settings.value.drawEvery * 1000, { immediate: false })
watch(autoDraw, on => on
  ? resume()
  : pause())
watch(canDraw, ok => ok || (autoDraw.value = false))
</script>

<template>
  <section class="mx-auto flex w-full max-w-7xl grow touch-pan-y flex-col gap-5 overscroll-y-contain">
    <GameHeader :remaining />

    <div class="panel flex flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3">
      <div class="flex items-center gap-3">
        <span class="text-sm text-muted">{{ $t('game.id') }}</span>
        <span class="text-xl font-semibold tracking-wide tabular-nums">{{ gameId || '········' }}</span>
        <UButton square variant="soft" color="neutral" :aria-label="isShareSupported ? $t('aria.share') : $t('aria.copy')"
                 :icon="isShareSupported ? 'i-tabler-share' : (copied ? 'i-tabler-copy-check' : 'i-tabler-copy')"
                 @click="shareGameId()" />
        <UModal :title="$t('board.qr')" :description="$t('board.qrDescription')" :ui="{ content: 'sm:max-w-md' }">
          <UButton square variant="soft" color="neutral" icon="i-tabler-qrcode" :aria-label="$t('board.qr')" :disabled="!gameId" />
          <template #body>
            <div class="flex flex-col items-center gap-4">
              <div class="w-full max-w-80 rounded-xl bg-white p-2 [&>svg]:size-full" role="img" :aria-label="joinUrl" v-html="qrCode" />
              <span class="text-3xl font-semibold tracking-wide tabular-nums">{{ gameId }}</span>
            </div>
          </template>
        </UModal>
      </div>
      <p class="grow text-sm text-muted">
        {{ $t('game.description') }}
      </p>
      <div class="flex w-full items-center gap-3 sm:w-48">
        <div class="h-1.5 grow overflow-hidden rounded-full bg-muted">
          <div class="h-full rounded-full bg-primary transition-[width] duration-500" :style="{ width: `${extractedNumbers.length / 90 * 100}%` }" />
        </div>
        <span class="text-sm font-semibold tabular-nums">{{ extractedNumbers.length }}<span class="font-normal text-muted">/90</span></span>
      </div>
    </div>

    <div class="grid grow items-start gap-5 lg:grid-cols-[16rem_1fr] xl:grid-cols-[16rem_1fr_17rem]">
      <div class="flex flex-col items-center gap-4">
        <DrawToken :number="currentNumber" />
        <div class="min-h-14 text-center" aria-live="polite">
          <template v-if="currentSmirk">
            <p class="text-lg font-semibold text-balance text-highlighted">
              {{ currentSmirk.original }}
            </p>
            <p class="text-sm text-muted">
              {{ currentSmirk.translated }}
              <UButton v-if="isSpeechSupported" variant="link" color="neutral" size="sm" icon="i-tabler-volume"
                       :aria-label="$t('board.announcer')" class="align-middle" @click="speechText()" />
            </p>
          </template>
        </div>
        <UButton icon="i-tabler-arrow-big-down-lines" :disabled="!canDraw" size="xl" block loadingAuto
                 :label="$t('board.draw')" @click="extractNumber" />
        <div class="flex w-full items-center justify-between gap-3">
          <USwitch v-model="autoDraw" :disabled="!canDraw" :label="$t('board.autoDraw')" />
          <UInputNumber v-if="autoDraw" v-model="settings.drawEvery" :min="3" :max="120" size="sm" class="w-24 shrink-0"
                        :format-options="{ style: 'unit', unit: 'second' }" :aria-label="$t('board.drawEvery')" />
        </div>
        <UModal v-model:open="roundOpen" :title="$t('round.title')" :description="$t('round.description')"
                :ui="{ footer: 'justify-between gap-8', content: 'sm:max-w-sm' }">
          <UButton icon="i-tabler-refresh" color="neutral" variant="outline" block :disabled="!extractedNumbers.length"
                   :label="$t('round.start')" />
          <template #footer>
            <UButton :label="$t('button.cancel')" color="neutral" variant="subtle" @click="roundOpen = false" />
            <UButton :label="$t('round.start')" icon="i-tabler-refresh" @click="newRound()" />
          </template>
        </UModal>
      </div>

      <div class="panel grid select-none border-[var(--print-line)] sm:grid-cols-2 lg:row-span-2 xl:row-span-1">
        <div v-for="(card, index) in cards" :key="index" class="print grid grid-cols-5 gap-x-1.5 gap-y-1 p-3 sm:p-4"
             :class="[index % 2 === 0 && 'sm:border-e', index < 5 && 'border-b', index >= 4 && 'sm:border-b-0']">
          <span v-for="number in card" :key="number" class="numero print h-11 text-lg sm:h-13 sm:text-xl"
                :data-state="number === currentNumber ? 'latest' : (extractedNumbers.includes(number) ? 'on' : undefined)">
            {{ number }}
          </span>
        </div>
      </div>

      <div class="panel flex flex-col gap-4 p-4 lg:col-start-1 xl:col-start-auto">
        <USelect v-model="settings.smirk" :placeholder="$t('board.smirk')" class="w-full"
                 :aria-label="$t('board.smirk')" :items="smirkOptions" />
        <USwitch v-if="isSpeechSupported" v-model="settings.autoAnnounce" :disabled="!settings.smirk" :label="$t('board.announcer')" />
        <USwitch v-model="settings.playBoard" :label="$t('board.playBoard')" />
        <USwitch v-model="settings.perCard" :label="$t('board.perCard')" />
        <UFormField v-if="settings.perCard" :label="$t('board.price')"
                    :help="$t('board.pot', { n: sold, total: $n(pot, 'currency') }, sold)">
          <UInputNumber v-model="settings.price" :min="0.1" :step="0.1" class="w-full" />
        </UFormField>
        <UFormField v-else :label="$t('board.prize')">
          <UInputNumber v-model="settings.totalPrize" :min="0.1" :step="0.1" class="w-full" />
        </UFormField>
        <USwitch v-model="customSplit" :label="$t('board.customSplit')" />
        <dl v-if="pot > 0 || settings.split" class="divide-y divide-default text-sm">
          <template v-for="(value, name) in splittedPrize" :key="name">
            <div v-if="settings.split || isPrizeOn(name)" class="flex items-center justify-between gap-2 py-1.5">
              <dt class="text-muted">
                <span class="capitalize">{{ name }}</span>
                <span v-for="(w, i) in wonPrizes[name]" :key="i" class="block text-xs font-medium text-highlighted">
                  <UIcon name="i-tabler-trophy" class="size-3.5 align-[-2px] text-primary" />
                  {{ w.player }}<template v-if="wonPrizes[name].length > 1"> · {{ $n(w.amount, 'currency') }}</template>
                </span>
              </dt>
              <dd class="flex items-center gap-2">
                <UInputNumber v-if="settings.split" v-model="settings.split[name]" :min="0" :max="100" size="xs" class="w-20"
                              :format-options="{ style: 'unit', unit: 'percent' }" :aria-label="$t('board.share', { prize: name })" />
                <span class="font-medium tabular-nums">{{ $n(value, 'currency') }}</span>
              </dd>
            </div>
          </template>
        </dl>
        <p v-if="splitTotal !== 100" class="text-xs text-warning">
          {{ $t('board.splitTotal', [splitTotal]) }}
        </p>
        <div class="flex flex-col gap-2 border-t border-default pt-4">
          <p class="flex justify-between gap-2 text-sm">
            <span class="font-medium text-highlighted">{{ $t('board.players', [players.length], players.length) }}</span>
            <span class="text-muted tabular-nums">{{ $t('cards.quantity', [cartelle], cartelle) }}</span>
          </p>
          <div v-if="players.length" class="flex flex-wrap gap-1.5">
            <UBadge v-for="(p, i) in players" :key="i" color="neutral" variant="soft">
              <span class="tabular-nums">{{ p.id }}</span>
              <span class="text-dimmed tabular-nums">×{{ p.cards }}</span>
            </UBadge>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
