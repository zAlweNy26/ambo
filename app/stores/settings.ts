import type { Locale } from '#i18n'

export const useSettingsStore = defineStore('Settings', () => {
  const colorMode = useColorMode()
  const { locale, locales, setLocale, setLocaleCookie } = useI18n()
  const switchLocalePath = useSwitchLocalePath()

  const storage = useLocalStorage<{
    announcer: boolean
  }>('settings', {
    announcer: true,
  }, { mergeDefaults: true })

  const isDark = computed(() => colorMode.value === 'dark')
  const isLight = computed(() => colorMode.value === 'light')

  const currentLocale = computed(() =>
    locales.value.find(l => l.code === locale.value) ?? locales.value[0]!,
  )

  const toggleTheme = () => {
    colorMode.preference = colorMode.value === 'light' ? 'dark' : 'light'
  }

  const changeLocale = (e: Locale) => {
    switchLocalePath(e)
    setLocaleCookie(e)
    setLocale(e)
  }

  return {
    storage,
    isDark,
    isLight,
    locale,
    locales,
    currentLocale,
    toggleTheme,
    changeLocale,
  }
})
