import type { Peer } from 'crossws'

type Game = {
    id: string
    extractions: number[]
    host: Peer
    clients: Set<Peer>
}

const activeGames: Map<string, Game> = new Map()

function getGame(peer: Peer) {
    const params = new URL(peer.websocket.url!).searchParams
    const id = params.get('id')!
    const game = activeGames.get(id)
    const type = params.get('type')!
    if (game) {
        if (type === 'host' && game.host.id === peer.id) return game
        if (type === 'client' && [...game.clients].find(p => p.id === peer.id)) return game
        else {
            peer.subscribe(id)
            game.clients.add(peer)
            console.log(`[Peer] Client ${peer.id} connected to game ${id}`)
            return game
        }
    } if (type === 'host') {
        const newGame = { id, extractions: [], host: peer, clients: new Set([]) }
        activeGames.set(id, newGame)
        console.log(`[Peer] Host ${peer.id} created game ${id}`)
        console.log(`[Peer] Active games: ${activeGames.size}`)
        return newGame
    }
}

export default defineWebSocketHandler({
    open(peer) {
        const game = getGame(peer)
        if (!game) peer.terminate()
        else peer.send( JSON.stringify({ status: 'opened', extractions: game.extractions }))
    },
    message(peer, message) {
        const { extracted } = message.json<{ extracted: number }>()

        const game = getGame(peer)
        if (!game) return peer.close(1011, 'Game not found')

        if (game.host.id === peer.id) {
            game.extractions.push(extracted)
            peer.publish(game.id, JSON.stringify({ status: 'started', extractions: game.extractions }))
        }
    },
    close(peer) {
        console.log(`[Peer] Connection closed: ${peer}`)

        const game = getGame(peer)
        if (!game) return
        peer.unsubscribe(game.id)

        if (peer.id === game.host.id) {
            activeGames.delete(game.id)
            console.log(`[Peer] Host ${peer.id} deleted game ${game.id}`)
            peer.publish(game.id, JSON.stringify({ status: 'closed', extractions: game.extractions }))
        }

        console.log(`[Peer] Active games: ${activeGames.size}`)
    }
})