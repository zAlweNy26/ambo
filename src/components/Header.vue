<template>
	<div class="navbar bg-base-200 min-h-fit">
		<div class="navbar-start gap-2">
			<Menu v-slot="{ open }" as="div" class="relative inline-block rounded-lg md:hidden">
				<MenuButton class="btn btn-ghost btn-square" title="Menu">
					<Icon v-if="!open" icon="eva:menu-outline" class="h-6 w-6" aria-hidden="true" />
					<Icon v-else icon="eva:close-outline" class="h-6 w-6" aria-hidden="true" />
				</MenuButton>
				<Transition enter-active-class="transition duration-200 ease-out"
					enter-from-class="transform scale-90 opacity-0" enter-to-class="transform scale-100 opacity-100"
					leave-active-class="transition duration-200 ease-in"
					leave-from-class="transform scale-100 opacity-100" leave-to-class="transform scale-90 opacity-0">
					<MenuItems as="ul"
						class="menu menu-compact rounded-box bg-base-200 absolute left-0 z-50 mt-4 flex w-44 origin-top-left flex-col gap-2 p-2 shadow-lg">
						<MenuItem as="li">
							<a href="/tabellone">
								<Icon icon="ion:podium" class="h-5 w-5" aria-hidden="true" />
								Tabellone
							</a>
						</MenuItem>
						<MenuItem as="li">
							<a href="/cartelle">
								<Icon icon="fluent:style-guide-24-filled" class="h-5 w-5" aria-hidden="true" />
								Cartelle
							</a>
						</MenuItem>
						<MenuItem as="li">
							<a href="/info">
								<Icon icon="fluent:info-24-filled" class="h-5 w-5" aria-hidden="true" />
								Info
							</a>
						</MenuItem>
					</MenuItems>
				</Transition>
			</Menu>
			<ThemeButton class="block md:hidden" />
			<a href="/" class="hidden shrink-0 items-center gap-2 md:flex" title="Home">
				<img class="h-12 w-12" src="/favicon.svg" alt="Logo">
				<p class="hidden text-xl text-primary font-semibold xl:block">Ambo!</p>
			</a>
		</div>
		<div class="navbar-center">
			<a href="/" class="shrink-0 md:hidden" title="Home">
				<img class="h-12 w-12" src="/favicon.svg" alt="Logo">
			</a>
			<ul class="menu menu-compact menu-horizontal hidden gap-2 font-medium md:flex">
				<li>
					<a href="/tabellone" class="rounded-lg">Tabellone</a>
				</li>
				<li>
					<a href="/cartelle" class="rounded-lg">Cartelle</a>
				</li>
				<li>
					<a href="/info/about" class="rounded-lg">Chi siamo</a>
				</li>
			</ul>
		</div>
		<div class="navbar-end gap-2">
			<a class="btn md:btn-sm btn-square md:!w-auto md:!px-3 btn-info btn-outline gap-2" href="/auth" rel="prefetch">
				<Icon icon="logos:paypal" class="h-7 w-7 md:h-5 md:w-5" aria-hidden="true" />
				<span class="hidden md:inline-block">PayPal</span>
			</a>
			<ThemeButton class="hidden md:block" />
		</div>
	</div>
</template>

<script setup lang="ts">
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue'
import ThemeButton from '@components/ThemeButton.vue'
import { Icon } from '@iconify/vue'
</script>