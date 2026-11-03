// Reads text aloud in the app's language, for the board's announcer
export function useVoice() {
  const { localeProperties } = useI18n()
  const text = ref('')
  const { isPlaying, isSupported: hasSynth, speak, stop } = useSpeechSynthesis(text, {
    lang: () => localeProperties.value.language ?? localeProperties.value.code,
    pitch: 1,
    rate: 1,
    volume: 1,
  })

  // Chromium on Linux has no voices without --enable-speech-dispatcher and fails silently: hide the announcer there
  const hasVoices = ref(false)
  if (window.speechSynthesis) {
    const checkVoices = () => hasVoices.value = speechSynthesis.getVoices().length > 0
    checkVoices()
    useEventListener(speechSynthesis, 'voiceschanged', checkVoices)
  }

  function say(value: string) {
    text.value = value
    if (isPlaying.value) stop()
    setTimeout(speak, 250)
  }

  return {
    isSupported: computed(() => hasSynth.value && hasVoices.value),
    isPlaying,
    say,
    stop,
  }
}
