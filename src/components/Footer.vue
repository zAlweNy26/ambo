<script setup lang="ts">
import { Icon } from '@iconify/vue'
</script>

<template>
	<div class="relative mt-24">
		<div class="wave-shape">
			<svg data-name="Layer 1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"
				preserveAspectRatio="none">
				<defs>
					<linearGradient id="grad" x1="0%" y1="0%" x2="80%" y2="0%">
						<stop id="stop0" offset="0%" />
						<stop id="stop1" offset="100%" />
					</linearGradient>
				</defs>
				<path fill="url(#grad)"
					d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
					opacity=".25" />
				<path fill="url(#grad)"
					d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
					opacity=".5" />
				<path fill="url(#grad)"
					d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" />
			</svg>
		</div>
	</div>
	<footer class="p-4 text-base-100 footer footer-center bg-gradient-r-ube-purple dark:bg-gradient-r-amber-orange gap-y-4">
		<div class="grid grid-flow-col gap-4">
			<a class="link link-hover" href="/termini">Termini & Condizioni</a>
			<a class="link link-hover" href="/attribuzioni">Attribuzioni</a>
			<a class="link link-hover" href="/riguardo">Chi siamo</a>
		</div>
		<div>
			<div class="grid grid-flow-col gap-4">
				<a href="https://github.com/zAlweNy26/ambo" aria-label="GitHub Link">
					<Icon icon="bxl:github" class="w-8 h-8" />
				</a>
			</div>
		</div>
		<div>
			<p>Copyright © 2023-2024 Ambo!, Tutti i diritti sono riservati</p>
		</div>
	</footer>
</template>

<style scoped>
	#stop0 {
		stop-color: #5B06D6;
		stop-opacity: 1;
	}

	#stop1 {
		stop-color: #8400D1;
		stop-opacity: 1;
	}

	[data-theme="dark"] #stop0 {
		stop-color: #F97316;
	}

	[data-theme="dark"] #stop1 {
		stop-color: #F59E0B;
	}
</style>