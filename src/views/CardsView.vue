<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { randomNumber } from '@helpers/utils'

const props = defineProps<{
  amount: number
}>()

const { amount } = toRefs(props)

const isWidthXS = useMediaQuery('(max-width: 475px)')
const notification = ref('Nessuna notifica'), label = ref(''), search = ref<number>()

const cardsAmount = computed(() => Math.min(amount.value, 6))
const signedNumbers = reactive(Array.from({ length: cardsAmount.value }).map<number[]>(() => []))

const cards = computed(() => {
  return Array.from({ length: cardsAmount.value }, () => {
    const card = Array.from({ length: 3 }, () => new Array<number>(9).fill(0))
    card.forEach(v => {
      let times = 0
      while (times < 5) {
        const randIndex = randomNumber(0, 8)
        const randNum = randomNumber(randIndex == 0 ? 1 : randIndex * 10, (randIndex * 10) + (randIndex == 8 ? 10 : 9))
        if (v[randIndex] == 0 && 
            card.findIndex(v => v.find(s => s == randNum)) == -1 && 
            card.filter(v => v[randIndex] == 0).length > 1) {
          v[randIndex] = randNum
          times++
        }
      }
    })
    for (let i = 0; i < card.length; i++) {
      for (let j = 0; j < card[i].length; j++) {
        if (card[i][j] != 0) {
          if (card[i+1] != undefined && card[i+1][j] != 0 && card[i][j] > card[i+1][j]) {
            [card[i][j], card[i+1][j]] = [card[i+1][j], card[i][j]]
          } else if (card[i+2] != undefined && card[i+2][j] != 0 && card[i][j] > card[i+2][j]) {
            [card[i][j], card[i+2][j]] = [card[i+2][j], card[i][j]]
          }
        }
      }
    }
    return card
  }).map(c => c.flat())
})

const filteredCards = computed(() => cards.value.map(c => c.filter(r => r != 0)))

const checkNumber = (num: number) => {
  if (num == 0) return
  const indexes = filteredCards.value.flatMap((c, j) => c.map((n, i) => n == num ? j : -1)).filter(v => v != -1)
  if (indexes.length == 0) {
    label.value = 'Non presente'
  } else {
    label.value = 'Aggiunto'
    for (const card of indexes) toggleNumber(card, num)
  }
}

const remainingNumbers = computed(() => filteredCards.value.flat().length - signedNumbers.flat().length)

const toggleNumber = (card: number, num: number) => {
  if (num == 0) return
  const index = signedNumbers[card].indexOf(num)
  if (index > -1) signedNumbers[card].splice(index, 1)
  else signedNumbers[card].push(num)
}
</script>

<template>
  <div class="flex flex-col items-center justify-between w-full gap-8 grow">
    <GameHead :title="`${cardsAmount} cartelle - ${remainingNumbers} numeri rimanenti`" />
    <div class="flex flex-col items-center justify-center grow gap-8">
      <div class="form-control">
        <label class="label text-sm">Inserisci numero</label>
        <div class="relative">
          <button class="absolute inset-y-0 right-0 btn btn-sm btn-square btn-primary" @click="checkNumber(search ?? 0)">
            <Icon class="w-6 h-6" icon="ph:check-bold" />
          </button>
          <input v-model="search" type="number" placeholder="Cerca numero"
            class="pr-8 pincode input input-sm input-bordered input-primary">
        </div>
        <label class="label text-sm" :class="[ label == 'Aggiunto' ? 'text-success' : 'text-error' ]">{{ label }}</label>
      </div>
      <div class="flex flex-wrap items-center justify-center gap-8">
        <div v-for="(card, ci) in (isWidthXS ? filteredCards : cards)" :key="ci" class="p-4 bg-base-200 rounded-xl">
          <div class="grid grid-rows-3 select-none" :class="[isWidthXS ? 'grid-cols-5' : 'grid-cols-9']">
            <div v-for="(number, ni) in card" :key="`${ci}-${ni}`"
              :class="{ '!bg-error': signedNumbers[ci].includes(number) }"
              class="flex items-center justify-center w-12 h-12 transition-colors cursor-pointer xs:p-2 outline-neutral bg-neutral-content outline outline-2"
              @click="toggleNumber(ci, number)">
              <p class="text-xl font-medium">
                {{ number != 0 ? number : "" }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
