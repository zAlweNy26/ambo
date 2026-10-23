import type { Locale } from '#i18n'

export const useSettingsStore = defineStore('Settings', () => {
  const { locale, locales, setLocale, setLocaleCookie } = useI18n()
  const switchLocalePath = useSwitchLocalePath()

  const currentLocale = computed(() =>
    locales.value.find(l => l.code === locale.value) ?? locales.value[0]!,
  )

  const changeLocale = (e: Locale) => {
    switchLocalePath(e)
    setLocaleCookie(e)
    setLocale(e)
  }

  return {
    locale,
    locales,
    currentLocale,
    changeLocale,
  }
})
