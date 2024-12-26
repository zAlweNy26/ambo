<script lang="ts" setup>
const { title } = useAppConfig()
</script>

<template>
	<section class="mx-auto flex max-w-6xl gap-2 text-center justify-center items-center grow flex-col">
		<h1 class="text-4xl font-bold">
			{{ $t('home.welcome', [title]) }}
		</h1>
		<p class="text-sm font-medium text-base-content">
			{{ $t('home.subtitle') }}
		</p>
		<div class="space-y-8 mt-8">
			<NuButton :label="$t('header.board')" block icon="i-tabler-grid-dots" size="xl"
				:to="$localePath('board')" />
			<NuModal :title="$t('cards.title')" :ui="{ 
				content: 'sm:max-w-md',
				body: 'grid grid-cols-2 place-content-center gap-4'
			}">
				<NuButton :label="$t('header.cards')" block icon="i-tabler-cards-filled" size="xl" />
				<template #body>
					<NuButton v-for="n in 6" :key="n"
						:label="$t('cards.quantity', [n], n)" block size="xl"
						:to="$localePath({ name: 'cards', query: { n } })" />
				</template>
			</NuModal>
		</div>
	</section>
</template>
