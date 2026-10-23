import { claims } from '@schema'
import { db, eq } from 'void/db'
import { z } from 'zod'

const claimSchema = z.object({
  gameId: z.string().length(8),
  player: z.uuid(),
  name: z.string().trim().min(1).max(24),
  prize: z.enum(PRIZES),
  numbers: z.array(z.int().min(1).max(90)).max(15),
})

// shortcut: cartelle are dealt on the phone, so the server checks the numbers were drawn and fit one row,
// not that they are on the player's card; register cards at join if cheating ever matters
export default defineEventHandler(async (event) => {
  const { gameId, player, name, prize, numbers } = await readValidatedBody(event, body => claimSchema.parse(body))

  const game = await getGame(gameId)

  if (!game) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Game not found',
    })
  }

  if (!isValidClaim(prize, numbers, game.extractions)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid claim',
    })
  }

  await forgetOldClaims()

  const draw = game.extractions.length
  const existing = await db.select({ prize: claims.prize, draw: claims.draw }).from(claims).where(eq(claims.gameId, gameId))

  if (isPrizeClosed(prize, existing, draw)) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Prize already won',
    })
  }

  await db.insert(claims).values({
    gameId,
    prize,
    player,
    name,
    draw,
    createdAt: new Date(),
  }).onConflictDoNothing()

  console.info(`[Game: ${gameId}] Player ${player} claimed ${prize} on draw ${draw}`)

  return { prize }
})
