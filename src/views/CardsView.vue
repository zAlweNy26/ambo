<script setup lang="ts">
const props = defineProps<{
  amount: number
}>()

const { amount } = toRefs(props)

const isWidthXS = useMediaQuery('(max-width: 475px)')
//const notification = ref('nulla')

const cardsAmount = computed(() => Math.min(amount.value, 6))
const signedNumbers = reactive(Array.from({ length: cardsAmount.value }).map<number[]>(() => []))

const randomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

const cards = computed(() => {
  return Array.from({ length: cardsAmount.value }).map(() => {
    const card: number[][] = []
    for (let i = 0; i < 3; i++) {
      card.push(new Array<number>(9).fill(0))
    }
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

const toggleNumber = (card: number, num: number) => {
  if (num != 0) {
    const index = signedNumbers[card].indexOf(num)
    if (index > -1) signedNumbers[card].splice(index, 1)
    else signedNumbers[card].push(num)
    //const present = filteredCards.value[card].filter(c => signedNumbers[card].includes(c)).length
    //console.log(card, num, present)
  }
}
</script>

<template>
  <div class="flex flex-col items-center justify-between w-full gap-8 grow">
    <GameHead />
    <div class="flex flex-col items-center justify-center grow gap-8">
      <div class="flex flex-wrap items-center justify-center gap-8">
        <div v-for="(card, ci) in (isWidthXS ? filteredCards : cards)" :key="ci" class="p-4 bg-base-200 rounded-xl">
          <div class="grid grid-rows-3 select-none" :class="[isWidthXS ? 'grid-cols-5' : 'grid-cols-9']">
            <div v-for="(number, ni) in card" :key="`${ci}-${ni}`"
              :class="{ '!bg-error': signedNumbers[ci].includes(number) }"
              class="flex items-center justify-center w-12 h-12 transition-colors cursor-pointer xs:p-2 outline-neutral bg-neutral-content outline outline-2"
              @click="toggleNumber(ci, number)">
              <p class="text-xl font-medium">
                {{ number != 0 ? number : " " }}
              </p>
            </div>
          </div>
        </div>
      </div>
      <!--<p>Ultima notifica : {{ notification }}</p>-->
    </div>
  </div>
</template>
