<script lang="ts" setup>
import livornese from '~/assets/livornese.json'
import napoletana from '~/assets/napoletana.json'
import piemontese from '~/assets/piemontese.json'
import romana from '~/assets/romana.json'
import trapanese from '~/assets/trapanese.json'

const smirks = {
  napoletana,
  trapanese,
  romana,
  piemontese,
  livornese,
}

const { data: game } = useFetch('/api/game/create', {
  method: 'POST',
  lazy: true,
  default: () => ({ gameId: '', hostId: '' }),
})
const gameId = computed(() => game.value.gameId)

const router = useRouter()

watch(gameId, (id) => {
  if (id) {
    router.push({
      query: { id },
      replace: true,
    })
  }
})

const cards = Array.from({ length: 6 }).map((_, i) => {
  let up = -5
  const card = Array.from({ length: 15 }).map((_, j) => {
    up += j % 5
      ? 0
      : 5
    return (j + 1) + (i * 15) + up - (i % 2
      ? 10
      : 0)
  })
  return card
})

const smirkOptions = [
  { label: 'Napoletana', value: 'napoletana' },
  { label: 'Trapanese', value: 'trapanese' },
  { label: 'Romana', value: 'romana' },
  { label: 'Piemontese', value: 'piemontese' },
  { label: 'Livornese', value: 'livornese' },
]

onBeforeUnmount(() => {
  $fetch('/api/game/close', {
    method: 'POST',
    body: game.value,
  })
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

const splittedPrize = computed(() => splitPrize(totalPrize.value))

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
  setTimeout(speak, 250)
}

async function extractNumber() {
  const random = _Sample([...remainingNumbers.value])
  if (!random) return
  currentNumber.value = random
  const { extractions } = await $fetch('/api/game/extract', {
    method: 'POST',
    body: {
      ...game.value,
      number: random,
    },
  })
  extractedNumbers.value = extractions
}
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
        <UButton icon="i-tabler-arrow-big-down-lines" :disabled="remaining === 0 || !smirk" size="xl" block loadingAuto
                 :label="$t('board.draw')" @click="extractNumber" />
      </div>

      <div class="panel grid select-none border-[var(--print-line)] sm:grid-cols-2 lg:row-span-2 xl:row-span-1">
        <div v-for="(card, index) in cards" :key="index" class="print grid grid-cols-5 gap-y-1 p-3 sm:p-4"
             :class="[index % 2 === 0 && 'sm:border-e', index < 5 && 'border-b', index >= 4 && 'sm:border-b-0']">
          <span v-for="number in card" :key="number" class="numero print h-11 text-lg sm:text-xl"
                :data-state="number === currentNumber ? 'latest' : (extractedNumbers.includes(number) ? 'on' : undefined)">
            {{ number }}
          </span>
        </div>
      </div>

      <div class="panel flex flex-col gap-4 p-4 lg:col-start-1 xl:col-start-auto">
        <USelect v-model="smirk" :placeholder="$t('board.smirk')" class="w-full"
                 :aria-label="$t('board.smirk')" :items="smirkOptions" />
        <USwitch v-model="autoAnnounce" :disabled="!smirk" :label="$t('board.announcer')" />
        <UFormField :label="$t('board.prize')">
          <UInputNumber v-model="totalPrize" :min="0.1" :step="0.1" class="w-full" />
        </UFormField>
        <dl v-if="totalPrize > 0" class="divide-y divide-default text-sm">
          <div v-for="(value, name) in splittedPrize" :key="name" class="flex justify-between py-1.5">
            <dt class="capitalize text-muted">
              {{ name }}
            </dt>
            <dd class="font-medium tabular-nums">
              {{ $n(value, 'currency') }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </section>
</template>
