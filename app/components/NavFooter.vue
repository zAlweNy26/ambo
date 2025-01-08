<script setup lang="ts">
const { title } = useAppConfig()

const error = useError()
</script>

<template>
  <div class="relative mt-12 md:mt-24">
    <div class="absolute bottom-0 left-0 w-full overflow-hidden leading-0 rotate-180">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 120"
           preserveAspectRatio="none" class="relative block w-full h-12 md:h-24">
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop id="stop0" :class="{ error: !!error }" offset="0%" />
            <stop id="stop1" :class="{ error: !!error }" offset="100%" />
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
  <div class="flex flex-col items-center gap-4 text-sm text-center text-[var(--ui-bg)] p-4 text-base-200 bg-gradient-to-r"
       :class="[error ? 'from-red-600 to-red-400' : 'from-primary-600 to-primary-400']">
    <div class="flex flex-wrap justify-center font-medium gap-4">
      <NuLink class="hover:underline !text-[var(--ui-bg)]" :to="$localePath('terms')">
        {{ $t('footer.terms') }}
      </NuLink>
      <NuLink class="hover:underline !text-[var(--ui-bg)]" :to="$localePath('contacts')">
        {{ $t('footer.contacts') }}
      </NuLink>
    </div>
    <div class="grid grid-flow-col gap-4">
      <NuButton icon="i-tabler-brand-github" class="text-[var(--ui-bg)] p-0" square variant="ghost" size="xl" :ui="{ leadingIcon: 'size-8' }"
                to="https://github.com/zAlweNy26/ambo" external target="_blank" aria-label="GitHub Repository" />
    </div>
    <div class="text-sm flex justify-between items-center gap-4 w-full">
      <div class="size-8" />
      <i18n-t keypath="footer.copyright" tag="p">
        <span>{{ new Date().getFullYear() }}</span>
        <strong>{{ title }}</strong>
      </i18n-t>
      <LanguageSwitch />
    </div>
  </div>
</template>

<style>
#stop1 {
  stop-color: var(--color-primary-600);
  stop-opacity: 1;
}

#stop0 {
  stop-color: var(--color-primary-400);
  stop-opacity: 1;
}

.error#stop1 {
  stop-color: var(--color-red-600);
}

.error#stop0 {
  stop-color: var(--color-red-400);
}
</style>
