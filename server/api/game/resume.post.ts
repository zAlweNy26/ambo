import { z } from 'zod'

const resumeSchema = z.object({
  gameId: z.string().length(8),
  hostId: z.uuid(),
})

// Lets the host's board pick its game back up after a reload or crash
export default defineEventHandler(async (event) => {
  const { gameId, hostId } = await readValidatedBody(event, body => resumeSchema.parse(body))

  const game = await getHostedGame(gameId, hostId)

  return {
    extractions: game.extractions,
  }
})
