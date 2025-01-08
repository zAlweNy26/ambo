import { z } from 'zod'

const extractionSchema = z.object({
  gameId: z.string().length(8),
  number: z.number().min(1).max(90),
})

export default defineEventHandler(async (event) => {
  const { gameId, number } = await readValidatedBody(event, body => extractionSchema.parse(body))

  const game = await getGame(gameId)

  if (!game) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Game not found',
    })
  }

  game.extractions.push(number)
  await setGame(gameId, game)

  console.info(`[Game: ${gameId}] Host ${game.host} extracted number ${number}`)

  return {
    extractions: game.extractions,
  }
})
