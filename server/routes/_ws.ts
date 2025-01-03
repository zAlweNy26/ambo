import type { Peer } from 'crossws'

interface Game {
  id: string
  extractions: number[]
  host: string
  clients: string[]
}

const getActiveGames = async () => (await hubKV().keys('game')).length

const setGame = (id: string, game: Game) => hubKV().set(`game:${id}`, game, { ttl: 60 * 60 * 24 })

async function getGame(peer: Peer) {
  const params = new URL(peer.websocket.url!).searchParams
  const id = params.get('id')!
  const game = await hubKV().get<Game>(`game:${id}`)
  const type = params.get('type')!
  if (game) {
    if (type === 'host' && game.host === peer.id) return game
    if (type === 'client' && game.clients.includes(peer.id)) return game

    peer.subscribe(id)
    game.clients = [...game.clients, peer.id]
    await setGame(id, game)
    console.log(`[Peer] Client ${peer.id} connected to game ${id}`)
    return game
  }
  else if (type === 'host') {
    const newGame = { id, extractions: [], host: peer.id, clients: [] }
    await setGame(id, newGame)
    console.log(`[Peer] Host ${peer.id} created game ${id}`)
    console.log(`[Peer] Active games: ${await getActiveGames()}`)
    return newGame
  }
  else return null
}

export default defineWebSocketHandler({
  async open(peer) {
    const game = await getGame(peer)
    if (!game) peer.terminate()
    else peer.send(JSON.stringify({ status: 'opened', extractions: game.extractions }))
  },
  async message(peer, message) {
    if (message.text().includes('ping')) peer.send('pong')
    else {
      const game = await getGame(peer)
      if (!game) return peer.close(1011, 'Game not found')

      const { extracted } = message.json<{ extracted: number }>()

      if (game.host === peer.id) {
        game.extractions = [...game.extractions, extracted]
        await setGame(game.id, game)
        peer.publish(game.id, JSON.stringify({ status: 'started', extractions: game.extractions }))
      }
    }
  },
  async close(peer) {
    const game = await getGame(peer)
    if (!game) return

    if (peer.id === game.host) {
      await hubKV().del(`game:${game.id}`)
      console.log(`[Peer] Host ${peer.id} deleted game ${game.id}`)
      peer.publish(game.id, JSON.stringify({ status: 'closed', extractions: game.extractions }))
    }
    else {
      peer.unsubscribe(game.id)
      game.clients = game.clients.filter(client => client !== peer.id)
      await setGame(game.id, game)
      console.log(`[Peer] Client ${peer.id} disconnected from game ${game.id}`)
    }

    console.log(`[Peer] Active games: ${await getActiveGames()}`)
  },
})
