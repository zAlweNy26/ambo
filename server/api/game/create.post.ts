export default defineEventHandler(async () => {
  // First UUID segment (8 hex chars) is the shareable game code; the host ID stays secret on the board
  const id = crypto.randomUUID().slice(0, 8)
  const hostId = crypto.randomUUID()

  // Housekeeping only: a D1 hiccup must not stop a game from starting
  await forgetOldClaims().catch(error => console.error(error))

  const game = await setGame(id, {
    id,
    extractions: [],
    host: hostId,
  })

  console.info(`[Game: ${game.id}] Host ${game.host} created game`)

  return {
    gameId: id,
    hostId,
  }
})
