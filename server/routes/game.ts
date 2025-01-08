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

  const interval = setInterval(async () => {
    const game = await getGame(id)
    if (!game) {
      clearInterval(interval)
      await eventStream.close()
      return
    }
    await eventStream.push(JSON.stringify(game.extractions))
  }, 1000)

  eventStream.onClosed(async () => {
    clearInterval(interval)
    await eventStream.close()
  })

  return eventStream.send()
})
