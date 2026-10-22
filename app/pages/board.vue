<script lang="ts" setup>
import Dinero from 'dinero.js'
import livornese from '~/assets/livornese.json'
import napoletana from '~/assets/napoletana.json'
import piemontese from '~/assets/piemontese.json'
import romana from '~/assets/romana.json'
import trapanese from '~/assets/trapanese.json'

const smirks = { napoletana, trapanese, romana, piemontese, livornese }

const { data: gameId } = useFetch('/api/game/create', {
  method: 'POST',
  lazy: true,
  transform: data => data.gameId!,
  default: () => '',
})

const router = useRouter()

watch(gameId, (id) => {
  if (id) router.push({ query: { id }, replace: true })
})

const cards = Array.from({ length: 6 }).map((_, i) => {
  let up = -5
  const card = Array.from({ length: 15 }).map((_, j) => {
    up += j % 5 ? 0 : 5
    return (j + 1) + (i * 15) + up - (i % 2 ? 10 : 0)
  })
  return card
})

const frames = ['frame-rosso', 'frame-verde', 'frame-blu']

const smirkOptions = [
  { label: 'Napoletana', value: 'napoletana' },
  { label: 'Trapanese', value: 'trapanese' },
  { label: 'Romana', value: 'romana' },
  { label: 'Piemontese', value: 'piemontese' },
  { label: 'Livornese', value: 'livornese' },
]

onBeforeUnmount(() => {
  $fetch('/api/game/close', { method: 'POST', body: { gameId: gameId.value } })
})

const { currentLocale } = storeToRefs(useSettingsStore())
const toast = useToast()
const { t } = useI18n()
const { title } = useAppConfig()
const { copy, copied } = useClipboard()
const { share, isSupported: isShareSupported } = useShare()
const extractedNumbers = ref<number[]>([]), autoAnnounce = ref(false), currentNumber = ref<number>()
const totalPrize = ref(0.1), smirk = ref<keyof typeof smirks>(), speakText = ref<string>('')

const { isPlaying, isSupported: isSpeechSupported, speak, stop } = useSpeechSynthesis(speakText, {
  lang: () => currentLocale.value.language ?? currentLocale.value.code,
  pitch: 1,
  rate: 1,
  volume: 1,
})

const splittedPrize = computed(() => {
  const totPrize = Dinero({ amount: Math.round(totalPrize.value * 10) })
  const prizes = { ambo: 0, terna: 0, quaterna: 0, cinquina: 0, tombola: 0 }
  const dividedPrize = totPrize.allocate([40, 60])
  prizes.tombola = dividedPrize[0]!.getAmount() / 10
  prizes.cinquina = dividedPrize[1]!.divide(2, 'HALF_UP').getAmount() / 10
  prizes.quaterna = dividedPrize[1]!.divide(4, 'HALF_UP').getAmount() / 10
  prizes.terna = dividedPrize[1]!.divide(8, 'HALF_UP').getAmount() / 10
  prizes.ambo = dividedPrize[1]!.divide(12, 'HALF_UP').getAmount() / 10
  const sumPrizes = prizes.ambo + prizes.terna + prizes.quaterna + prizes.cinquina + prizes.tombola
  const remainder = Dinero({ amount: Math.round(((totPrize.getAmount() / 10) - sumPrizes) * 10) })
  const dividedRemainder = remainder.allocate([50, 50]).map(v => v.getAmount())
  prizes.terna += dividedRemainder[0]! / 10
  prizes.ambo += dividedRemainder[1]! / 10
  return prizes
})

const remainingNumbers = computed(() => {
  const allNumbers = cards.flat()
  if (!allNumbers.length) return new Set<number>()
  return new Set(allNumbers).difference(new Set(extractedNumbers.value))
})

const remaining = computed(() => remainingNumbers.value.size)

const currentSmirk = computed(() => {
  const number = currentNumber.value
  if (!smirk.value || !number) return
  const smirkData = smirks[smirk.value]
  const smirkNumber = smirkData.find(({ number: n }) => n === number)
  return smirkNumber
})

watchDeep(currentSmirk, () => {
  if (isPlaying.value) stop()
  if (autoAnnounce.value) speechText()
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

async function shareGameId() {
  if (isShareSupported.value) {
    try {
      await share({
        title,
        text: `${$t('game.id')}: ${gameId.value}`,
        url: `${window.location.origin}?id=${gameId.value}`,
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
  speakText.value = `${number}. ${original}. ${translated}.`
  if (isPlaying.value) stop()
  setTimeout(() => speak(), 250)
}

async function extractNumber() {
  const random = _Sample([...remainingNumbers.value])
  if (!random) return
  currentNumber.value = random
  const { extractions } = await $fetch('/api/game/extract', {
    method: 'POST',
    body: {
      gameId: gameId.value,
      number: random,
    },
  })
  extractedNumbers.value = extractions
}
</script>

<template>
  <section class="mx-auto flex w-full max-w-7xl grow touch-pan-y flex-col gap-6 overscroll-y-contain">
    <GameHeader :remaining />

    <div class="cart-panel frame-blu">
      <div class="cart-field flex flex-wrap items-center justify-between gap-x-6 gap-y-2 px-4 py-3">
        <p class="flex items-center gap-3 text-lg">
          <span class="font-semibold">{{ $t('game.id') }}</span>
          <span class="font-numeral text-2xl tracking-wider">{{ gameId || '········' }}</span>
          <NuButton square :aria-label="isShareSupported ? $t('aria.share') : $t('aria.copy')"
                    :icon="isShareSupported ? 'i-tabler-share' : (copied ? 'i-tabler-copy-check' : 'i-tabler-copy')"
                    :color="copied ? 'success' : 'primary'" size="lg" @click="shareGameId()" />
        </p>
        <p class="text-sm text-toned">
          {{ $t('game.description') }}
        </p>
        <p class="font-numeral text-2xl tabular-nums">
          {{ extractedNumbers.length }}<span class="text-base text-muted"> / 90</span>
        </p>
      </div>
    </div>

    <div class="grid grow items-start gap-6 lg:grid-cols-[22rem_1fr]">
      <div class="flex flex-col items-center gap-5">
        <CarrettoWheel :number="currentNumber" />
        <div class="min-h-16 text-center" aria-live="polite">
          <template v-if="currentSmirk">
            <p class="font-display text-2xl leading-tight text-balance">
              {{ currentSmirk.original }}
            </p>
            <p class="text-toned">
              {{ currentSmirk.translated }}
              <NuButton v-if="isSpeechSupported" variant="link" color="neutral" icon="i-tabler-volume"
                        :aria-label="$t('board.announcer')" class="align-middle" @click="speechText()" />
            </p>
          </template>
        </div>
        <NuButton icon="i-tabler-arrow-big-down-lines" :disabled="remaining === 0 || !smirk" size="xl" block loadingAuto
                  class="py-4 text-xl" :label="$t('board.draw')" @click="extractNumber" />
        <div class="cart-panel frame-verde w-full">
          <div class="cart-field flex flex-col gap-4 p-4">
            <NuSelect v-model="smirk" :placeholder="$t('board.smirk')" size="xl" class="w-full"
                      :aria-label="$t('board.smirk')" :items="smirkOptions" />
            <NuSwitch v-model="autoAnnounce" :disabled="!smirk" size="xl" :label="$t('board.announcer')"
                      uncheckedIcon="i-tabler-x" checkedIcon="i-tabler-check" defaultValue />
            <NuFormField :label="$t('board.prize')" size="xl" :ui="{ label: 'flex items-center gap-1' }">
              <NuInputNumber v-model="totalPrize" :min="0.1" :step="0.1" class="w-full" />
              <template #label="{ label }">
                <NuIcon name="i-tabler-moneybag" class="size-5" />
                <span>{{ label }}</span>
              </template>
            </NuFormField>
            <dl v-if="totalPrize > 0" class="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 rounded-md border-2 border-ink bg-giallo px-3 py-2 text-ink">
              <template v-for="(value, name) in splittedPrize" :key="name">
                <dt class="font-semibold capitalize">
                  {{ name }}
                </dt>
                <dd class="text-end font-numeral tabular-nums">
                  {{ $n(value, 'currency') }}
                </dd>
              </template>
            </dl>
          </div>
        </div>
      </div>

      <div class="grid gap-4 sm:grid-cols-2">
        <div v-for="(card, index) in cards" :key="index" class="cart-panel" :class="frames[index % frames.length]">
          <div class="cart-field grid select-none grid-cols-5 gap-1 p-2">
            <span v-for="number in card" :key="number" class="numero aspect-square text-lg sm:text-xl xl:text-2xl"
                  :data-state="number === currentNumber ? 'latest' : (extractedNumbers.includes(number) ? 'on' : undefined)">
              {{ number }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
