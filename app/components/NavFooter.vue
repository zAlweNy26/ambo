<script setup lang="ts">
const { title } = useAppConfig()
</script>

<template>
  <footer class="mt-16 border-t border-default text-sm text-muted">
    <div class="mx-auto flex max-w-7xl flex-col items-center gap-4 px-4 py-6 sm:flex-row sm:justify-between">
      <i18n-t keypath="footer.copyright" tag="p">
        <span>{{ new Date().getFullYear() }}</span>
        <span class="font-medium text-toned">{{ title }}</span>
      </i18n-t>
      <nav class="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        <NuLink class="hover:text-highlighted" :to="$localePath('terms')">
          {{ $t('footer.terms') }}
        </NuLink>
        <NuLink class="hover:text-highlighted" :to="$localePath('contacts')">
          {{ $t('footer.contacts') }}
        </NuLink>
        <NuLink class="hover:text-highlighted" to="https://github.com/zAlweNy26/ambo" external target="_blank">
          GitHub
        </NuLink>
        <NuLink class="inline-flex items-center gap-1 hover:text-highlighted" target="_blank" external
                to="https://www.paypal.com/donate/?hosted_button_id=39KEMRPM67FB6">
          <NuIcon name="i-tabler-heart" class="size-4 text-primary" />
          {{ $t('donate.with') }} PayPal
        </NuLink>
        <LanguageSwitch />
      </nav>
    </div>
  </footer>
</template>
