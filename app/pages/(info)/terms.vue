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
  <section class="grow mx-auto">
    <ContentRenderer v-if="page"
                     class="prose-sm prose max-w-[90ch] md:prose-base dark:prose-invert prose-headings:text-center prose-h1:text-[var(--ui-primary)] prose-li:marker:text-[var(--ui-primary)] prose-li:marker:font-medium"
                     :value="page" prose :data="{ owner }" />
  </section>
</template>
