<script lang="ts" setup>
definePageMeta({
	middleware: [(to) => {
		if (!to.query.id) return navigateTo('/')
	}]
})

const gameId = useRouteQuery<string>('id')
const { extractions } = usePeer(gameId, 'client')

const lastExtractions = computed(() => extractions.value.slice(-5))

const amount = useRouteQuery('n', 1, { transform: (v) => Math.min(Number(v), 6) })

const searchNumber = ref(1), numberFound = ref<boolean>()
const signedNumbers = ref(Array.from({ length: amount.value }).map<number[]>(() => []))

const cards = computed(() => {
	// TODO: Improve card generation algorithm
	return Array.from({ length: amount.value }, () => {
		const card = Array.from({ length: 3 }, () => Array.from<number>({ length: 9 }).fill(0))
		card.forEach(v => {
			let times = 0
			while (times < 5) {
				const randIndex = useRandom(0, 8, false)
				const randNum = useRandom(randIndex == 0 ? 1 : randIndex * 10, (randIndex * 10) + (randIndex == 8 ? 10 : 9), false)
				if (v[randIndex] == 0 &&
					card.findIndex(v => v.find(s => s == randNum)) == -1 &&
					card.filter(v => v[randIndex] == 0).length > 1) {
					v[randIndex] = randNum
					times++
				}
			}
		})
		for (let i = 0; i < card.length; i++) {
			for (let j = 0; j < card[i]!.length; j++) {
				if (card[i]![j] != 0) {
					if (card[i + 1] != undefined && card[i + 1]![j] != 0 && card[i]![j]! > card[i + 1]![j]!) {
						[card[i]![j]!, card[i + 1]![j]!] = [card[i + 1]![j]!, card[i]![j]!]
					} else if (card[i + 2] != undefined && card[i + 2]![j]! != 0 && card[i]![j]! > card[i + 2]![j]!) {
						[card[i]![j]!, card[i + 2]![j]!] = [card[i + 2]![j]!, card[i]![j]!]
					}
				}
			}
		}
		return card
	}).map(c => c.flat())
})

const remaining = computed(() => 
	new Set(cards.value.flat().filter(r => r != 0)).size - 
	new Set(signedNumbers.value.flat()).size
)

const toggleNumber = (card: number, num: number, force = false) => {
	if (num == 0) return
	const index = signedNumbers.value[card]!.indexOf(num)
	if (index > -1 && force) return
	else if (index > -1) signedNumbers.value[card]!.splice(index, 1)
	else signedNumbers.value[card]!.push(num)
}

const checkNumber = (num: number, check = true) => {
	numberFound.value = undefined
	const indexes = cards.value.flatMap((c, j) => c.map((n, i) => n == num ? j : -1)).filter(v => v != -1)
	if (indexes.length == 0 && check) numberFound.value = false
	else {
		if (check) numberFound.value = true
		for (const card of indexes) toggleNumber(card, num, check)
	}
}
</script>

<template>
	<section v-auto-animate class="flex max-w-6xl mx-auto gap-8 text-center items-stretch grow flex-col">
		<GameHeader :remaining>
			<template #title>
				<i18n-t keypath="cards.quantity" tag="span" :plural="amount">
					<strong>{{ amount }}</strong>
				</i18n-t>
			</template>
		</GameHeader>
		<div v-if="lastExtractions.length > 0" class="space-y-2">
			<p>{{ $t('board.extractions', [lastExtractions.length], lastExtractions.length) }}</p>
			<div v-auto-animate class="flex flex-wrap gap-4 items-center justify-center">
				<div v-for="num in lastExtractions" :key="num"
					class="grid place-content-center size-8 transition-colors border-2 bg-[var(--ui-primary)] border-none text-[var(--ui-bg)] rounded-full sm:size-10 md:size-12">
					<p class="text-sm font-bold sm:text-lg">
						{{ num }}
					</p>
				</div>
			</div>
		</div>
		<NuButtonGroup orientation="vertical">
			<NuInputNumber v-model="searchNumber" size="xl" :min="1" :step="1" :max="90"
				:ui="{ base: ['rounded-b-none'] }" @change="() => numberFound = undefined" />
			<NuButton square icon="i-tabler-search" block size="xl" :label="$t('cards.search')" @click="checkNumber(searchNumber)" />
		</NuButtonGroup>
		<i18n-t v-if="numberFound !== undefined" class="-mt-6" :class="[numberFound ? 'text-[var(--ui-success)]' : 'text-[var(--ui-error)]']"
			:keypath="`cards.${numberFound ? 'found' : 'notFound'}`" tag="p">
			<strong>{{ searchNumber }}</strong>
		</i18n-t>
		<div class="flex flex-wrap items-center justify-center gap-8">
			<div v-for="(card, ci) in cards" :key="ci"
				class="grid select-none grid-cols-[repeat(9,minmax(2rem,3rem))] bg-[var(--ui-bg-accented)] p-2 rounded-lg">
				<div v-for="(number, ni) in card" :key="`${ci}-${ni}`" class="grid place-content-center border p-2 bg-[var(--ui-bg)]"
					:class="{ 
						'bg-[var(--ui-primary)] text-[var(--ui-bg)]': signedNumbers[ci]?.includes(number),
						'cursor-pointer transition-colors': number != 0
					}" @click="checkNumber(number, false)">
					<p class="text-xl font-medium">
						{{ number !== 0 ? number : '' }}
					</p>
				</div>
			</div>
		</div>
	</section>
</template>
