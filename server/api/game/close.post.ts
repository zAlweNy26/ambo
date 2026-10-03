import { z } from 'zod'

const closeSchema = z.object({
  gameId: z.string().length(8),
})

export default defineEventHandler(async (event) => {
  const { gameId } = await readValidatedBody(event, body => closeSchema.parse(body))

  const game = await getGame(gameId)

  if (!game) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Game not found',
    })
  }

  if (game) {
    const db = useDB(event)
    await db.insert(schema.games).values({
      gameId,
      completedAt: new Date(),
      playersCount: game.clients.length,
      totalExtractions: game.extractions.length,
    })
    await db.insert(schema.extractions).values({
      gameId,
      numbers: game.extractions,
    })
  }
})
