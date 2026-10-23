import { z } from 'zod'

const extractionSchema = z.object({
  gameId: z.string().length(8),
  hostId: z.uuid(),
  number: z.int().min(1).max(90),
})

export default defineEventHandler(async (event) => {
  const { gameId, hostId, number } = await readValidatedBody(event, body => extractionSchema.parse(body))

  const game = await getHostedGame(gameId, hostId)

  if (game.extractions.includes(number)) {
    throw createError({
      statusCode: 409,
      statusMessage: 'Number already drawn',
    })
  }

  game.extractions.push(number)
  await setGame(gameId, game)

  console.info(`[Game: ${gameId}] Host ${game.host} extracted number ${number}`)

  return {
    extractions: game.extractions,
  }
})
