import { randomUUID } from 'uncrypto'

export default defineEventHandler(async () => {
  const [id, ...hostId] = randomUUID().split('-')

  const game = await setGame(id, {
    id,
    extractions: [],
    clients: [],
    host: [id, ...hostId].join('-'),
  })

  console.info(`[Game: ${game.id}] Host ${game.host} created game`)
  console.info(`Active games: ${await getActiveGames()}`)

  return {
    gameId: id,
  }
})
