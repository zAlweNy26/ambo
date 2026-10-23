import { randomUUID } from 'uncrypto'
import { z } from 'zod'

const gameSchema = z.object({
  id: z.string().length(8),
})

export default defineEventHandler(async (event) => {
  const { id } = await getValidatedQuery(event, data => gameSchema.parse(data))

  let game = await getGame(id)

  if (!game) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Game not found',
    })
  }

  const clientId = randomUUID()

  game.clients.push(clientId)
  game = await setGame(id, game)

  console.info(`[Game: ${game.id}] Client ${clientId} joined game`)

  const eventStream = createEventStream(event)

  // Workers allow 1,000 KV operations per request: end the stream well before that and let EventSource reconnect
  let ticks = 0, sent = -1
  const interval = setInterval(async () => {
    try {
      const game = ++ticks > 900
        ? undefined
        : await getGame(id)
      if (!game) return await stop()
      if (game.extractions.length === sent) return
      sent = game.extractions.length
      await eventStream.push(JSON.stringify(game.extractions))
    }
    catch (error) {
      console.error(`[Game: ${id}] Stream poll failed`, error)
    }
  }, 1000)

  async function stop() {
    clearInterval(interval)
    await eventStream.close()
  }

  eventStream.onClosed(stop)

  return eventStream.send()
})
