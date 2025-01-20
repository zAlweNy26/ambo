import { randomUUID } from 'uncrypto'

export default defineEventHandler(async () => {
  const hostId = randomUUID()
  const [id] = hostId.split('-')

  const game = await setGame(id, {
    id,
    extractions: [],
    clients: [],
    host: hostId,
  })

  console.info(`[Game: ${game.id}] Host ${game.host} created game`)
  console.info(`Active games: ${await getActiveGames()}`)

  return {
    gameId: id,
  }
})
