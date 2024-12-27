interface Message {
  extractions: number[]
}

export function usePeer(id: MaybeRefOrGetter<string>, type: 'host' | 'client') {
  const protocol = computed(() => location.protocol.includes('s') ? 's' : '')

  const wsUrl = computed(() => `ws${protocol.value}://${location.host}/_ws?id=${toValue(id)}&type=${type}`)

  const extractions = ref<number[]>([])

  const { status, data: wsData, send, open } = useWebSocket(wsUrl, {
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
