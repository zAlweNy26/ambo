import { z } from 'zod'

const gameSchema = z.object({
  id: z.string().length(8),
  player: z.uuid(),
})

export default defineEventHandler(async (event) => {
  const { id, player } = await getValidatedQuery(event, data => gameSchema.parse(data))

  const game = await getGame(id)

  if (!game) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Game not found',
    })
  }

  await addPlayer(id, player)

  console.info(`[Game: ${id}] Player ${player} connected`)

  const eventStream = createEventStream(event)

  // Workers allow 1,000 KV operations per request: end the stream well before that and let EventSource reconnect
  let ticks = 0, sent = -1, sentWinners = ''
  const interval = setInterval(async () => {
    try {
      const game = ++ticks > 900
        ? undefined
        : await getGame(id)
      if (!game) return await stop()
      const winners = JSON.stringify(game.winners ?? [])
      // A named event, so cached clients that only parse number arrays ignore it
      if (winners !== sentWinners) {
        sentWinners = winners
        await eventStream.push({ event: 'winners', data: winners })
      }
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
