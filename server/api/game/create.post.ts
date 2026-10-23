export default defineEventHandler(async (event) => {
  const rooms = useRooms(event)
  // First UUID segment (8 hex chars) is the shareable game code; the host ID stays secret on the board
  for (let attempt = 0; attempt < 3; attempt++) {
    const id = crypto.randomUUID().slice(0, 8)
    const hostId = crypto.randomUUID()
    // A code already in use (one in four billion) gets another try
    if (await rooms.init(id, hostId)) {
      console.info(`[Game: ${id}] Created`)
      return { gameId: id, hostId }
    }
  }
  throw createError({ statusCode: 503, statusMessage: 'Could not create a game' })
})
