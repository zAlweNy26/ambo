<script lang="ts" setup>
interface Member {
  name: string
  avatar?: string
  description: string
  links: {
    icon: string
    url: string
  }[]
}

const devTeam: Member[] = [
  {
    name: 'Daniele Nicosia',
    avatar: '/main_dev.png',
    description: 'Project Manager\nFull-Stack Developer',
    links: [
      {
        icon: 'i-tabler-world',
        url: 'https://zalweny26.github.io',
      },
      {
        icon: 'i-tabler-brand-linkedin',
        url: 'https://www.linkedin.com/in/daniele-nicosia',
      },
      {
        icon: 'i-tabler-brand-github',
        url: 'https://github.com/zAlweNy26',
      },
    ],
  },
]

const { title } = useAppConfig()
</script>

<template>
  <section class="flex flex-col items-center gap-4 grow">
    <h1 class="text-4xl font-bold text-[var(--ui-primary)]">
      {{ $t('contacts.title') }}
    </h1>
    <i18n-t keypath="contacts.description" tag="p" class="font-medium">
      <strong>{{ title }}</strong>
    </i18n-t>
    <div class="flex flex-wrap gap-8 w-full items-center justify-evenly">
      <NuCard v-for="member in devTeam" :key="member.name" class="text-center" :ui="{ header: 'grid place-content-center' }">
        <template v-if="member.avatar" #header>
          <NuxtImg :alt="member.name" class="rounded-2xl size-32" size="2xl" :src="member.avatar" />
        </template>
        <h3 class="font-bold">
          {{ member.name }}
        </h3>
        <p class="whitespace-pre-wrap text-sm">
          {{ member.description }}
        </p>
        <template #footer>
          <NuButtonGroup>
            <NuButton v-for="link in member.links" :key="link.icon" size="xl" variant="subtle"
                      :icon="link.icon" square external :to="link.url" target="_blank" />
          </NuButtonGroup>
        </template>
      </NuCard>
    </div>
  </section>
</template>
