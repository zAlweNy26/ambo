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

  const { status, data: wsData, send, open, close } = useWebSocket(wsUrl, {
    heartbeat: {
      interval: 5000,
      pongTimeout: 5000,
      message: 'ping',
      responseMessage: 'pong',
    },
    onConnected() {
      router.replace({ query: { id: toValue(id), ...route.query } })
      console.warn('WebSocket connected')
    },
    onDisconnected(ws, e) {
      console.warn('WebSocket disconnected:', e)
      navigateTo({ path: '/', query: {} }, { redirectCode: 302 })
      if (type === 'client' && !e.wasClean) {
        toast.add({
          title: t('game.error.title'),
          description: t('game.error.description'),
          color: 'error',
        })
      }
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

    if (content.status === 'closed' && type === 'client') {
      toast.add({
        title: t('game.end.title'),
        description: t('game.end.description'),
        color: 'info',
      })
      close()
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
