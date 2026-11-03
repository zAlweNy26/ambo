// What the join form shows before a player joins: the price of a cartella, if the host set one
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id') ?? ''
  if (!/^[0-9a-f]{8}$/.test(id)) throw createError({ statusCode: 400, statusMessage: 'Invalid game ID' })
  const info = await useRooms(event).info(id)
  if (!info) throw createError({ statusCode: 404, statusMessage: 'Game not found' })
  return info
})
