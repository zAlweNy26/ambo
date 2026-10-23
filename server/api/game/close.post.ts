import { claims, extractions, games } from '@schema'
import { db, eq } from 'void/db'
import { z } from 'zod'

const closeSchema = z.object({
  gameId: z.string().length(8),
  hostId: z.uuid(),
})

export default defineEventHandler(async (event) => {
  const { gameId, hostId } = await readValidatedBody(event, body => closeSchema.parse(body))

  const game = await getHostedGame(gameId, hostId)

  // One batch is one transaction: no games row without its numbers. Claims go: they hold players' names
  await db.batch([
    db.insert(games).values({
      gameId,
      completedAt: new Date(),
      playersCount: await countPlayers(gameId),
      totalExtractions: game.extractions.length,
    }),
    db.insert(extractions).values({
      gameId,
      numbers: game.extractions,
    }),
    db.delete(claims).where(eq(claims.gameId, gameId)),
  ])
})
