interface Meaning {
  number: number
  original: string
  translated: string
}

const files = import.meta.glob<Meaning[]>('~/assets/*.json', { import: 'default' })

// A number's meaning in a regional smorfia; only the chosen smorfia's file is loaded
export function useSmorfia(name: MaybeRefOrGetter<Smorfia | undefined>, number: MaybeRefOrGetter<number | undefined>) {
  const meanings = computedAsync(async () => {
    const smorfia = toValue(name)
    // Matched by file name: the glob's keys depend on how Vite resolves the alias
    const file = Object.entries(files).find(([path]) => path.endsWith(`/${smorfia}.json`))
    return smorfia
      ? file?.[1]()
      : undefined
  })
  return computed(() => meanings.value?.find(m => m.number === toValue(number)))
}
