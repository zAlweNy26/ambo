import { randomUUID } from 'uncrypto'

export default defineEventHandler(async () => {
  const hostId = randomUUID()
  // First UUID segment (8 hex chars) is the shareable game code
  const id = hostId.slice(0, 8)

  const game = await setGame(id, {
    id,
    extractions: [],
    host: hostId,
  })

  console.info(`[Game: ${game.id}] Host ${game.host} created game`)
  console.info(`Active games: ${await getActiveGames()}`)

  return {
    gameId: id,
  }
})
