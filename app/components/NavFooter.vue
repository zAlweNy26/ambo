<script setup lang="ts">
const { title } = useAppConfig()

const error = useError()
</script>

<template>
  <footer class="mt-12 text-sm md:mt-16" :class="error ? 'bg-rosso text-carta' : 'bg-ink text-[#f7ecda]'">
    <div class="frieze" />
    <div class="mx-auto flex max-w-6xl flex-col items-center gap-4 p-5 text-center">
      <i18n-t keypath="donate.title" tag="p" class="font-semibold">
        <strong>{{ title }}</strong>
        <NuButton size="sm" color="primary" class="ms-1 align-middle" target="_blank" external
                  to="https://www.paypal.com/donate/?hosted_button_id=39KEMRPM67FB6" icon="i-tabler-brand-paypal-filled"
                  :label="`${$t('donate.with')} PayPal`" />
      </i18n-t>
      <nav class="flex flex-wrap justify-center gap-x-6 gap-y-2 font-semibold">
        <NuLink class="text-inherit underline-offset-4 hover:text-arancio hover:underline" :to="$localePath('terms')">
          {{ $t('footer.terms') }}
        </NuLink>
        <NuLink class="text-inherit underline-offset-4 hover:text-arancio hover:underline" :to="$localePath('contacts')">
          {{ $t('footer.contacts') }}
        </NuLink>
        <NuLink class="inline-flex items-center gap-1 text-inherit underline-offset-4 hover:text-arancio hover:underline"
                to="https://github.com/zAlweNy26/ambo" external target="_blank">
          <NuIcon name="i-tabler-brand-github" class="size-4" />
          GitHub
        </NuLink>
      </nav>
      <div class="flex w-full items-center justify-between gap-4">
        <div class="size-8" />
        <i18n-t keypath="footer.copyright" tag="p" class="opacity-80">
          <span>{{ new Date().getFullYear() }}</span>
          <strong>{{ title }}</strong>
        </i18n-t>
        <LanguageSwitch />
      </div>
    </div>
  </footer>
</template>
