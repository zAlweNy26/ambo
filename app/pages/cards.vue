<script lang="ts" setup>
definePageMeta({
  middleware: [(to) => {
    if (!to.query.id) return navigateTo('/')
  }],
})

const gameId = useRouteQuery<string>('id', '')
const { t } = useI18n(), toast = useToast()
const extractions = ref<number[]>([])
const { data, error } = useEventSource(() => `/game?id=${gameId.value}`)

watchImmediate(error, (err) => {
  if (err) {
    navigateTo({ path: '/', query: {} }, { redirectCode: 302 })
    toast.add({
      title: t('game.error.title'),
      description: t('game.error.description'),
      color: 'error',
    })
  }
})

watch(data, (val) => {
  if (val === null) return

  let content: number[]

  try {
    content = JSON.parse(val)
  }
  catch (error) {
    console.error(error)
    console.error('Failed to parse WebSocket data:', data)
    return
  }

  extractions.value = content
})

const lastExtractions = computed(() => extractions.value.slice(-5))

const amount = useRouteQuery('n', 1, { transform: v => Math.min(Number(v), 6) })

const searchNumber = ref(1), numberFound = ref<boolean>()
const signedNumbers = ref(Array.from({ length: amount.value }).map<number[]>(() => []))

const cards = computed(() => {
  // TODO: Improve card generation algorithm
  return Array.from({ length: amount.value }, () => {
    const card = Array.from({ length: 3 }, () => Array.from<number>({ length: 9 }).fill(0))
    card.forEach((v) => {
      let times = 0
      while (times < 5) {
        const randIndex = _Random(0, 8, false)
        const randNum = _Random(randIndex === 0 ? 1 : randIndex * 10, (randIndex * 10) + (randIndex === 8 ? 10 : 9), false)
        if (v[randIndex] === 0
          && card.findIndex(v => v.find(s => s === randNum)) === -1
          && card.filter(v => v[randIndex] === 0).length > 1) {
          v[randIndex] = randNum
          times++
        }
      }
    })
    for (let i = 0; i < card.length; i++) {
      for (let j = 0; j < card[i]!.length; j++) {
        if (card[i]![j] !== 0) {
          if (card[i + 1] !== undefined && card[i + 1]![j] !== 0 && card[i]![j]! > card[i + 1]![j]!)
            [card[i]![j]!, card[i + 1]![j]!] = [card[i + 1]![j]!, card[i]![j]!]
          else if (card[i + 2] !== undefined && card[i + 2]![j]! !== 0 && card[i]![j]! > card[i + 2]![j]!)
            [card[i]![j]!, card[i + 2]![j]!] = [card[i + 2]![j]!, card[i]![j]!]
        }
      }
    }
    return card
  }).map(c => c.flat())
})

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
  const indexes = cards.value.flatMap((c, j) => c.map(n => n === num ? j : -1)).filter(v => v !== -1)
  if (indexes.length === 0 && check) numberFound.value = false
  else {
    if (check) numberFound.value = true
    for (const card of indexes) toggleNumber(card, num, check)
  }
}
</script>

<template>
  <section class="mx-auto flex w-full max-w-5xl grow touch-pan-y flex-col items-center gap-6 overscroll-y-contain">
    <GameHeader :remaining>
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
    </div>

    <div class="flex w-full max-w-sm flex-col gap-1.5">
      <NuFieldGroup class="w-full">
        <NuInputNumber v-model="searchNumber" size="lg" :min="1" :step="1" :max="90" class="grow"
                       :aria-label="$t('cards.search')" @change="() => numberFound = undefined" />
        <NuButton icon="i-tabler-search" size="lg" color="neutral" variant="outline" :label="$t('cards.search')" @click="checkNumber(searchNumber)" />
      </NuFieldGroup>
      <i18n-t v-if="numberFound !== undefined" class="text-center text-sm" :class="[numberFound ? 'text-success' : 'text-error']"
              :keypath="`cards.${numberFound ? 'found' : 'notFound'}`" tag="p" role="status">
        <strong>{{ searchNumber }}</strong>
      </i18n-t>
    </div>

    <div class="grid w-full justify-items-center gap-5 lg:grid-cols-2">
      <div v-for="(card, ci) in cards" :key="ci" class="panel w-full max-w-xl overflow-hidden border-[var(--print-line)]">
        <div class="flex items-center justify-between bg-primary px-4 py-2 text-xs text-white">
          <span class="font-medium tabular-nums">#{{ ci + 1 }}</span>
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
