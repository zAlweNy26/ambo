<script setup lang="ts">
import GameHead from '@components/GameHead.vue'
import { Icon } from '@iconify/vue'
import Dinero from 'dinero.js'
import { ref, reactive, computed } from 'vue'

Dinero.defaultCurrency = "EUR"

type Smorfia = {
	number: number
	original: string
	translated: string
}

const smorfieOptions = ["Napoletana", "Trapanese", "Romana", "Piemontese", "Toscana"]
const selectSmorfia = ref("Scegli la smorfia"), totalPrize = ref(0)
const useVocal = ref(false), prizeMethod = ref("half")
const smorfieList = ref<Smorfia[]>([])
const extractedNumbers = reactive<number[]>([])

const smorfiaExtracted = computed(() => smorfieList.value.find(v => v.number == extractedNumbers[extractedNumbers.length - 1]))

const splittedPrize = computed(() => {
	const totPrize = Dinero({ amount: Math.round(totalPrize.value * 10) })
	const prizes = { ambo: 0, terna: 0, quaterna: 0, cinquina: 0, tombola: 0 }
	if (prizeMethod.value == "half") {
		prizes.tombola = totPrize.divide(2, 'HALF_UP').getAmount() / 10
		prizes.cinquina = totPrize.divide(4, 'HALF_UP').getAmount() / 10
		prizes.quaterna = totPrize.divide(8, 'HALF_UP').getAmount() / 10
		prizes.terna = totPrize.divide(16, 'HALF_UP').getAmount() / 10
		prizes.ambo = totPrize.divide(32, 'HALF_UP').getAmount() / 10
		const sumPrizes = prizes.ambo + prizes.terna + prizes.quaterna + prizes.cinquina + prizes.tombola
		const remainder = Dinero({ amount: Math.round(((totPrize.getAmount() / 10) - sumPrizes) * 10) })
		const dividedRemainder = remainder.allocate([50, 50]).map(v => v.getAmount())
		prizes.terna += dividedRemainder[0] / 10
		prizes.ambo += dividedRemainder[1] / 10
	} else if (prizeMethod.value == "constant") {
		const constantDivider = 2
		prizes.ambo = totPrize.subtract(Dinero({ amount: 10 * constantDivider })).divide(50).getAmount()
		prizes.terna = prizes.ambo + (constantDivider / 10)
		prizes.quaterna = prizes.terna + (constantDivider / 10)
		prizes.cinquina = prizes.quaterna + (constantDivider / 10)
		prizes.tombola = prizes.cinquina + (constantDivider / 10)
	}
	return prizes
})

async function importSmorfie() {
	const jsonFile = await fetch(`/${selectSmorfia.value.toLowerCase()}.json`).then(res => res.json())
	smorfieList.value = jsonFile as Smorfia[]
}

const cards = Array.from({ length: 6 }).map((_, i) => {
	let up = -5
	const card = Array.from({ length: 15 }).map((_, j) => {
		up += j % 5 ? 0 : 5
		return (j + 1) + (i * 15) + up - (i % 2 ? 10 : 0)
	})
	return card
})

const spliceIntoChunks = (arr: number[], chunk: number) => {
	const res = []
	for (let i = 0; i < arr.length; i += chunk) res.push(arr.slice(i, i + chunk))
	return res
}

const extractNumber = () => {
	if (extractedNumbers.length == 90) return
	let random = Math.floor(Math.random() * 90) + 1
	while (extractedNumbers.includes(random)) random = Math.floor(Math.random() * 90) + 1
	extractedNumbers.push(random)
	if (useVocal.value) {
		const speechSynthesis = new SpeechSynthesisUtterance(`${random}, ${smorfiaExtracted.value?.original}`)
		speechSynthesis.lang = "it"
		window.speechSynthesis.speak(speechSynthesis)
	}
	/*cards.forEach(card => {
		let occ = 0
		spliceIntoChunks(card, 5).forEach(chunk => {
			
		})
		occ = 0
		console.log(spliceIntoChunks(card, 5))
	})*/
}
</script>

<template>
	<div class="flex flex-col items-center justify-between w-full gap-8 grow">
		<GameHead />
		<div class="flex flex-col items-center w-full gap-8 justify-evenly grow md:flex-row">
			<div class="flex flex-col items-center justify-center order-1 gap-8 max-w-fit md:order-2">
				<div class="flex flex-col gap-2">
					<span class="text-sm font-medium">Partizione automatica della posta</span>
					<div class="relative mb-2">
						<div class="absolute inset-y-0 left-0 flex items-center pl-1 pointer-events-none">
							<Icon class="w-6 h-6 text-primary" icon="ph:coins" />
						</div>
						<input v-model="totalPrize" type="number" placeholder="Totale montepremi"
							class="w-full pl-8 pincode input input-sm input-bordered input-primary">
					</div>
					<div v-if="totalPrize != 0" class="flex flex-col gap-2">
						<!--<label class="flex items-center gap-2 cursor-pointer">
							<input v-model="prizeMethod" checked value="half" type="radio" name="prizeMethod" 
								class="transition rounded-full cursor-pointer text-primary focus:ring-primary-focus">
							<span class="text-sm font-medium select-none shrink-0">Le metà</span> 
						</label>
						<label class="flex items-center gap-2 cursor-pointer">
							<input v-model="prizeMethod" value="constant" type="radio" name="prizeMethod" 
								class="transition rounded-full cursor-pointer text-primary focus:ring-primary-focus">
							<span class="text-sm font-medium select-none shrink-0">Differenza costante</span> 
						</label>-->
						<div class="flex flex-wrap items-center justify-center gap-2 font-medium">
							<div class="flex flex-col items-center justify-center">
								<span>€ {{ Number(splittedPrize.tombola.toFixed(1)).toString() }}</span>
								<Icon class="w-6 h-6 text-primary" icon="ic:round-account-balance-wallet" />
							</div>
							<div class="flex flex-col items-center justify-center">
								<span>€ {{ Number(splittedPrize.cinquina.toFixed(1)).toString() }}</span>
								<Icon class="w-6 h-6 text-primary" icon="ic:round-filter-5" />
							</div>
							<div class="flex flex-col items-center justify-center">
								<span>€ {{ Number(splittedPrize.quaterna.toFixed(1)).toString() }}</span>
								<Icon class="w-6 h-6 text-primary" icon="ic:round-filter-4" />
							</div>
							<div class="flex flex-col items-center justify-center">
								<span>€ {{ Number(splittedPrize.terna.toFixed(1)).toString() }}</span>
								<Icon class="w-6 h-6 text-primary" icon="ic:round-filter-3" />
							</div>
							<div class="flex flex-col items-center justify-center">
								<span>€ {{ Number(splittedPrize.ambo.toFixed(1)).toString() }}</span>
								<Icon class="w-6 h-6 text-primary" icon="ic:round-filter-2" />
							</div>
						</div>
					</div>
				</div>
				<select v-model="selectSmorfia" class="max-w-xs select select-sm select-primary w-min"
					@change="importSmorfie">
					<option disabled selected>
						Scegli la smorfia
					</option>
					<option v-for="option in smorfieOptions" :key="option" :value="option">
						{{ option }}
					</option>
				</select>
				<label class="flex items-center justify-between gap-2 cursor-pointer">
					<input v-model="useVocal" type="checkbox" class="!toggle !toggle-primary">
					<span class="text-sm font-medium select-none shrink-0">Abilita annunciatore</span>
				</label>
				<button :class="{ 'btn-disabled': extractedNumbers.length == 90 || smorfieList.length == 0 }"
					class="btn btn-primary !flex-nowrap gap-2 rounded-xl" @click="extractNumber">
					<Icon icon="fluent:access-time-20-filled" class="w-8 h-8" aria-hidden="true" />
					<span class="text-lg normal-case whitespace-nowrap">Estrai numero</span>
				</button>
				<div v-if="smorfiaExtracted != undefined"
					class="flex items-center justify-center gap-2 py-2 pl-2 pr-6 bg-secondary text-base-100 rounded-xl">
					<div class="flex items-center justify-center w-10 h-10 p-2 text-lg font-bold">
						<p>{{ smorfiaExtracted?.number }}</p>
					</div>
					<div class="flex flex-col">
						<p class="text-lg font-medium">
							" {{ smorfiaExtracted?.original }} "
						</p>
						<p class="text-sm">
							{{ smorfiaExtracted?.translated }}
						</p>
					</div>
				</div>
			</div>
			<div class="grid order-2 grid-cols-2 gap-4 xs:gap-8 md:order-1">
				<div v-for="(card, index) in cards" :key="index" class="grid grid-cols-5 grid-rows-3 gap-2 select-none">
					<div v-for="number in card" :key="number"
						:class="{ '!bg-error !border-none': extractedNumbers.includes(number) }"
						class="flex items-center justify-center w-6 h-6 border-2 rounded-full bg-base-300 border-neutral-focus xs:h-10 xs:w-10 xs:p-2">
						<p class="text-xs font-medium xs:text-lg">
							{{ number }}
						</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>
