<script setup lang="ts">
import GameHead from '@components/GameHead.vue'
import { ref, onMounted, computed, reactive } from 'vue'

const isWidthXS = ref(false)

const props = defineProps<{
  amount: number
}>()

const cardsAmount = Math.min(isNaN(props.amount) ? 1 : props.amount, 6)

const randomNumber = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

const cards = Array.from({ length: cardsAmount }).map(() => {
  const card = JSON.parse(JSON.stringify(new Array<number[]>(3).fill(new Array<number>(9).fill(0)))) as number[][]
  card.map((v, i, r) => {
    let times = 0
    while (times < 5) {
      const randIndex = randomNumber(0, 8)
      const randNum = randomNumber(randIndex == 0 ? 1 : randIndex * 10, (randIndex * 10) + (randIndex == 8 ? 10 : 9))
      if (v[randIndex] == 0 && r.findIndex(v => v.find(s => s == randNum)) == -1 && r.filter(v => v[randIndex] == 0).length > 1) {
        v[randIndex] = randNum
        times++
      }
    }
    return v
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

const filteredCards = computed(() => isWidthXS.value ? cards.map(c => c.filter(r => r != 0)) : cards)

const signedNumbers = reactive<number[][]>(JSON.parse(JSON.stringify(new Array<number[]>(cardsAmount).fill([]))))

const toggleNumber = (card: number, num: number) => {
  if (num != 0) {
    const index = signedNumbers[card].indexOf(num)
    if (index > -1) signedNumbers[card].splice(index, 1)
    else signedNumbers[card].push(num)
  }
}

onMounted(() => {
  const changeMedia = window.matchMedia('(min-width: 475px)')
  isWidthXS.value = !changeMedia.matches
  changeMedia.addEventListener("change", () => isWidthXS.value = !changeMedia.matches)
})
</script>

<template>
  <div class="flex flex-col items-center justify-between w-full gap-8 grow">
    <GameHead />
    <div class="flex items-center justify-center grow">
      <div class="flex flex-wrap items-center justify-center gap-8">
        <div v-for="(card, ci) in filteredCards" :key="ci" class="p-4 bg-base-300 rounded-xl">
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
    </div>
  </div>
</template>
