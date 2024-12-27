import type { Peer } from 'crossws'

interface Game {
  id: string
  extractions: number[]
  host: string
  clients: string[]
}

const getActiveGames = async () => (await hubKV().keys('game')).length

async function getGame(peer: Peer) {
  const params = new URL(peer.websocket.url!).searchParams
  const id = params.get('id')!
  const game = await hubKV().get<Game>(`game:${id}`)
  const type = params.get('type')!
  if (game) {
    if (type === 'host' && game.host === peer.id) return game
    if (type === 'client' && game.clients.includes(peer.id)) return game
    else {
      peer.subscribe(id)
      game.clients = [...game.clients, peer.id]
      await hubKV().set(`game:${id}`, game)
      console.log(`[Peer] Client ${peer.id} connected to game ${id}`)
      return game
    }
  }
  else if (type === 'host') {
    const newGame = { id, extractions: [], host: peer.id, clients: [] }
    await hubKV().set(`game:${id}`, newGame)
    console.log(`[Peer] Host ${peer.id} created game ${id}`)
    console.log(`[Peer] Active games: ${await getActiveGames()}`)
    return newGame
  }
}

export default defineWebSocketHandler({
  async open(peer) {
    const game = await getGame(peer)
    if (!game) peer.terminate()
    else peer.send(JSON.stringify({ status: 'opened', extractions: game.extractions }))
  },
  async message(peer, message) {
    const game = await getGame(peer)
    if (!game) return peer.close(1011, 'Game not found')

    const { extracted } = message.json<{ extracted: number }>()

    if (game.host === peer.id) {
      game.extractions = [...game.extractions, extracted]
      await hubKV().set(`game:${game.id}`, game)
      peer.publish(game.id, JSON.stringify({ status: 'started', extractions: game.extractions }))
    }
  },
  async close(peer) {
    const game = await getGame(peer)
    if (!game) return
    peer.unsubscribe(game.id)

    if (peer.id === game.host) {
      await hubKV().del(`game:${game.id}`)
      console.log(`[Peer] Host ${peer.id} deleted game ${game.id}`)
      peer.publish(game.id, JSON.stringify({ status: 'closed', extractions: game.extractions }))
    }
    else {
      game.clients = game.clients.filter(client => client !== peer.id)
      await hubKV().set(`game:${game.id}`, game)
      console.log(`[Peer] Client ${peer.id} disconnected from game ${game.id}`)
    }

    console.log(`[Peer] Active games: ${await getActiveGames()}`)
  },
})
