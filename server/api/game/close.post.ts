import { extractions, games } from '@schema'
import { db } from 'void/db'
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
    await db.insert(games).values({
      gameId,
      completedAt: new Date(),
      playersCount: game.clients.length,
      totalExtractions: game.extractions.length,
    })
    await db.insert(extractions).values({
      gameId,
      numbers: game.extractions,
    })
  }
})
