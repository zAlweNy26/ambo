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
  <section class="panel mx-auto grow">
    <div class="px-4 py-8 sm:px-10">
      <ContentRenderer v-if="page"
                       class="prose-sm prose max-w-[90ch] md:prose-base dark:prose-invert prose-headings:tracking-tight prose-headings:text-highlighted prose-li:marker:text-primary"
                       :value="page" prose :data="{ owner }" />
    </div>
  </section>
</template>
