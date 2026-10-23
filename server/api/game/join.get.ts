import { z } from 'zod'

const checkSchema = z.object({
  id: z.string().length(8),
})

export default defineEventHandler(async (event) => {
  const { id } = await getValidatedQuery(event, body => checkSchema.parse(body))

  return {
    found: await useRooms(event).exists(id),
  }
})
