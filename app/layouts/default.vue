<script setup lang="ts">
import * as locales from '@nuxt/ui/locale'

const { locale, t } = useI18n()
const route = useRoute()
const { title } = useAppConfig()

const name = computed(() => route.name)
const lang = computed(() => locales[locale.value].code)
const dir = computed(() => locales[locale.value].dir)

const seoTitle = computed(() => name.value && name.value !== 'index'
  ? t(`header.${String(name.value)}`)
  : '')

useHead({
  titleTemplate: t => t
    ? `${t} - ${title}`
    : title,
  title: seoTitle,
  htmlAttrs: {
    lang,
    dir,
  },
  link: [
    {
      rel: 'canonical',
      href: () => route.path,
    },
  ],
})

useSeoMeta({
  title: seoTitle,
  description: () => t('home.subtitle'),
  ogTitle: seoTitle,
  ogImage: '/maskable-icon-512x512.png',
  ogDescription: () => t('home.subtitle'),
  twitterTitle: seoTitle,
  twitterDescription: () => t('home.subtitle'),
  twitterImage: '/maskable-icon-512x512.png',
  twitterCard: 'app',
})

const head = useLocaleHead({
  dir: true,
  seo: true,
  lang: true,
})
</script>

<template>
  <div class="max-h-dvh h-dvh flex flex-col">
    <NuxtPwaManifest />
    <NuxtLoadingIndicator :duration="3000" :throttle="300"
                          color="repeating-linear-gradient(to right, var(--ui-color-primary-400) 0%, var(--ui-color-primary-900) 100%)" />
    <Html :lang="head.htmlAttrs?.lang" :dir="head.htmlAttrs?.dir">
      <Head>
        <template v-for="link in head.link" :key="link.id">
          <Link v-bind="link" />
        </template>
        <template v-for="meta in head.meta" :key="meta.id">
          <Meta v-bind="meta" :content="String(meta.content)" />
        </template>
      </Head>
      <Body class="flex min-h-dvh flex-col scroll-smooth antialiased transition-colors">
        <NavHeader />
        <AdvicePwa />
        <slot />
        <NavFooter />
      </Body>
    </Html>
  </div>
</template>

<style>
.page-enter-active, .layout-enter-active {
    transition: all 0.25s ease-out;
}

.page-leave-active, .layout-leave-active {
    transition: all 0.25s cubic-bezier(1, 0.5, 0.8, 1);
}

.page-enter-from, .page-leave-to, .layout-enter-from, .layout-leave-to {
    transform: translateY(20px);
    opacity: 0;
    filter: blur(0.5rem);
}
</style>
