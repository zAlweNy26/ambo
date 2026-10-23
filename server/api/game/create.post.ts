import { randomUUID } from 'uncrypto'

export default defineEventHandler(async () => {
  // First UUID segment (8 hex chars) is the shareable game code; the host ID stays secret on the board
  const id = randomUUID().slice(0, 8)
  const hostId = randomUUID()

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
