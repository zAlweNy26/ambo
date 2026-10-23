// The live game's WebSocket (/room/<id>): says hello on every (re)connect, and the room answers with its full state
export function useRoom(gameId: MaybeRefOrGetter<string>, hello: () => ClientMessage, onMessage: (message: ServerMessage) => void) {
  const url = computed(() => {
    const id = toValue(gameId)
    if (!id || !import.meta.client) return undefined
    return `${location.protocol === 'https:'
      ? 'wss'
      : 'ws'}://${location.host}/room/${id}`
  })

  const { send, status, close } = useWebSocket(url, {
    autoReconnect: {
      retries: () => true,
      delay: 1000,
    },
    // Phones drop idle sockets silently; the room answers 'pong' without waking up
    heartbeat: {
      message: 'ping',
      responseMessage: 'pong',
      interval: 25_000,
      pongTimeout: 10_000,
    },
    onConnected: ws => ws.send(JSON.stringify(hello())),
    onMessage(_, event) {
      try {
        onMessage(JSON.parse(event.data))
      }
      catch (error) {
        console.error('Bad room message', event.data, error)
      }
    },
  })

  return {
    status,
    // Stops reconnecting: the game is over or never existed
    close,
    send: (message: ClientMessage) => send(JSON.stringify(message)),
  }
}
