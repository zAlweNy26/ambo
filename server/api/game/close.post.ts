import { extractions, games } from '@schema'
import { db } from 'void/db'
import { z } from 'zod'

const closeSchema = z.object({
  gameId: z.string().length(8),
  hostId: z.uuid(),
})

export default defineEventHandler(async (event) => {
  const { gameId, hostId } = await readValidatedBody(event, body => closeSchema.parse(body))

  const game = await getHostedGame(gameId, hostId)

  if (game) {
    await db.insert(games).values({
      gameId,
      completedAt: new Date(),
      playersCount: await countPlayers(gameId),
      totalExtractions: game.extractions.length,
    })
    await db.insert(extractions).values({
      gameId,
      numbers: game.extractions,
    })
  }
})
