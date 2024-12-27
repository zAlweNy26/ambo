interface Message {
  status: 'opened' | 'started' | 'closed'
  extractions: number[]
}

export function usePeer(id: MaybeRefOrGetter<string>, type: 'host' | 'client') {
  const router = useRouter(), route = useRoute(), toast = useToast()
  const { t } = useI18n()

  const protocol = computed(() => location.protocol.includes('s') ? 's' : '')

  const wsUrl = computed(() => `ws${protocol.value}://${location.host}/_ws?id=${toValue(id)}&type=${type}`)

  const extractions = ref<number[]>([])

  const { status, data: wsData, send, open } = useWebSocket(wsUrl, {
    onConnected() {
      router.replace({ query: { id: toValue(id), ...route.query } })
    },
    onError(_ws, event) {
      console.error('WebSocket error:', event)
    },
  })

  watch(wsData, (data) => {
    if (data === null) return
    let content: Message

    try {
      content = JSON.parse(data)
    }
    catch (error) {
      console.error(error)
      console.error('Failed to parse WebSocket data:', data)
      return
    }

    extractions.value = content.extractions

    if (content.status === 'closed') {
      navigateTo('/')
      toast.add({
        title: t('game.end.title'),
        description: t('game.end.description'),
        color: 'info',
      })
    }
  })

  function sendExtraction(extracted: number) {
    send(JSON.stringify({ extracted }))
  }

  return {
    status,
    extractions,
    open,
    sendExtraction,
  }
}
