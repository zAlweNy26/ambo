<script lang="ts" setup>
import { randomUUID } from 'uncrypto'
import Dinero from 'dinero.js'
import smorfiaLivornese from 'assets/livornese.json'
import smorfiaNapoletana from 'assets/napoletana.json'
import smorfiaPiemontese from 'assets/piemontese.json'
import smorfiaRomana from 'assets/romana.json'
import smorfiaTrapanese from 'assets/trapanese.json'

const gameId = useRouteQuery('id', randomUUID().split('-')[0]!)

const { sendExtraction } = usePeer(gameId, 'host')

const smirks = {
	napoletana: smorfiaNapoletana,
	trapanese: smorfiaTrapanese,
	romana: smorfiaRomana,
	piemontese: smorfiaPiemontese,
	livornese: smorfiaLivornese,
}

const cards = Array.from({ length: 6 }).map((_, i) => {
	let up = -5
	const card = Array.from({ length: 15 }).map((_, j) => {
		up += j % 5 ? 0 : 5
		return (j + 1) + (i * 15) + up - (i % 2 ? 10 : 0)
	})
	return card
})

const { currentLocale } = storeToRefs(useSettingsStore())

const extractedNumbers = ref<number[]>([]), autoAnnounce = ref(false), currentNumber = ref<number>()
const totalPrize = ref(0.1), smirk = ref<keyof typeof smirks>(), speakText = ref<string>('')

const { isPlaying, isSupported, speak, stop } = useSpeechSynthesis(speakText, { 
	lang: () => currentLocale.value.language ?? currentLocale.value.code,
	pitch: 1,
	rate: 1,
	volume: 1
})

const smirkOptions = computed(() => [
	{ label: 'Napoletana', value: 'napoletana' },
	{ label: 'Trapanese', value: 'trapanese' },
	{ label: 'Romana', value: 'romana' },
	{ label: 'Piemontese', value: 'piemontese' },
	{ label: 'Livornese', value: 'livornese' },
])

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

const speechText = () => {
	if (!currentSmirk.value) return
	const { number, original, translated } = currentSmirk.value
	speakText.value = `${number}. ${original}. ${translated}.`
	if (isPlaying.value) stop()
	setTimeout(() => speak(), 250)
}

const extractNumber = () => {
	const random = useSample([...remainingNumbers.value])
	if (!random) return
	currentNumber.value = random
	extractedNumbers.value.push(random)
	sendExtraction(random)
}
</script>

<template>
	<section class="flex max-w-6xl mx-auto gap-8 text-center items-stretch grow flex-col">
		<GameHeader :remaining />
		<div class="flex flex-col items-center w-full gap-8 justify-evenly grow md:flex-row">
			<div v-auto-animate class="flex flex-col items-center justify-center gap-8">
				<NuFormField :label="$t('board.prize')" size="xl" :ui="{ label: 'space-x-1' }">
					<NuInputNumber v-model="totalPrize" :min="0.1" :step="0.1" />
					<template #label="{ label }">
						<NuIcon name="i-tabler-moneybag" class="size-5 text-[var(--ui-primary)] align-text-bottom" />
						<span>{{ label }}</span>
					</template>
				</NuFormField>
				<div v-if="totalPrize > 0" class="flex flex-col gap-2">
					<div class="flex flex-wrap items-center justify-center gap-2 font-semibold">
						<div class="text-center">
							<p>{{ $n(splittedPrize.tombola, 'currency') }}</p>
							<NuIcon class="size-8" name="i-tabler-wallet" />
						</div>
						<div class="text-center">
							<p>{{ $n(splittedPrize.cinquina, 'currency') }}</p>
							<NuIcon class="size-8" name="i-tabler-box-multiple-5" />
						</div>
						<div class="text-center">
							<p>{{ $n(splittedPrize.quaterna, 'currency') }}</p>
							<NuIcon class="size-8" name="i-tabler-box-multiple-4" />
						</div>
						<div class="text-center">
							<p>{{ $n(splittedPrize.terna, 'currency') }}</p>
							<NuIcon class="size-8" name="i-tabler-box-multiple-3" />
						</div>
						<div class="text-center">
							<p>{{ $n(splittedPrize.ambo, 'currency') }}</p>
							<NuIcon class="size-8" name="i-tabler-box-multiple-2" />
						</div>
					</div>
				</div>
				<NuSelect v-model="smirk" :placeholder="$t('board.smirk')" size="xl" :items="smirkOptions" />
				<NuSwitch v-model="autoAnnounce" :disabled="!smirk" size="xl" :label="$t('board.announcer')"
					uncheckedIcon="i-tabler-x" checkedIcon="i-tabler-check" defaultValue />
				<NuButton icon="i-tabler-numbers" :disabled="remaining === 0 || !smirk" size="xl" :label="$t('board.draw')" @click="extractNumber()" />
				<NuCard v-if="currentSmirk" :ui="{ body: 'inline-flex items-center justify-center gap-4 !px-4 !py-2' }">
					<span class="font-bold">{{ currentSmirk.number }}</span>
					<div>
						<p class="font-semibold">" {{ currentSmirk.original }} "</p>
						<p>{{ currentSmirk.translated }}</p>
					</div>
					<NuButton v-if="isSupported" variant="subtle" icon="i-tabler-volume" size="xl" @click="speechText()" />
				</NuCard>
			</div>
			<div class="grid grid-cols-2 gap-8">
				<div v-for="(card, index) in cards" :key="index" class="grid grid-cols-5 grid-rows-3 gap-2 select-none">
					<div v-for="number in card" :key="number"
						:class="{ 'bg-[var(--ui-primary)] border-none text-[var(--ui-bg)]': extractedNumbers.includes(number) }"
						class="grid place-content-center size-8 transition-colors border-2 rounded-full sm:size-10 md:size-12">
						<p class="text-sm font-bold sm:text-lg">
							{{ number }}
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
