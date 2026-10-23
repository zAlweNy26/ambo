import { z } from 'zod'

const claimsSchema = z.object({
  id: z.string().length(8),
})

// Polled by the board to announce winners as soon as they claim
export default defineEventHandler(async (event) => {
  const { id } = await getValidatedQuery(event, query => claimsSchema.parse(query))

  return getWinners(id)
})
