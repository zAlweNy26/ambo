<script lang="ts" setup>
const owner = 'Daniele Nicosia'

const { locale } = useI18n()

const { data: page } = await useAsyncData(
  async () => {
    const content = await queryCollection('content').path(`/terms_${locale.value}`).first()
    return content || await queryCollection('content').path('/terms_en').first()
  },
  {
    watch: [locale],
  },
)
</script>

<template>
  <section class="grow mx-auto cart-panel frame-verde">
    <div class="cart-field px-4 py-6 sm:px-10">
      <ContentRenderer v-if="page"
                       class="prose-sm prose max-w-[90ch] md:prose-base dark:prose-invert prose-headings:text-center prose-headings:text-highlighted prose-h1:font-display prose-h1:font-normal prose-li:marker:text-rosso dark:prose-li:marker:text-arancio prose-li:marker:font-medium"
                       :value="page" prose :data="{ owner }" />
    </div>
  </section>
</template>
