import type { Peer } from 'crossws'
import type { Connection, RoomHost, RoomState, Session } from './core'
import { db } from 'void/db'
import { createRoom, dispatch } from './core'
import { saveStats } from './stats'

// `bun run dev` can't run a Durable Object of this same Worker, so dev keeps rooms in memory with the same rules.
// They reset when the dev server restarts.
const rooms = new Map<string, { state?: RoomState, peers: Set<Peer> }>()

export function memoryRoom(id: string) {
  let room = rooms.get(id)
  if (!room) {
    rooms.set(id, room = {
      peers: new Set(),
    })
  }
  return room
}

export const memoryRooms = {
  async init(id: string, host: string) {
    const room = memoryRoom(id)
    if (room.state) return false
    room.state = createRoom(id, host)
    return true
  },
  async exists(id: string) {
    return !!rooms.get(id)?.state
  },
}

export function peerConnection(peer: Peer): Connection {
  return {
    session: (peer.context.session ?? {}) as Session,
    setSession: (session) => {
      peer.context.session = session
    },
    send: message => peer.send(JSON.stringify(message)),
  }
}

export function memoryHost(id: string): RoomHost {
  const room = memoryRoom(id)
  return {
    state: room.state,
    connections: () => [...room.peers].map(peerConnection),
    save: async () => {},
    clear: async () => {
      room.state = undefined
      for (const peer of room.peers) peer.close(1000, 'closed')
    },
    stats: () => saveStats(db, room.state!),
  }
}

const roomId = (url: string) => new URL(url, 'http://localhost').pathname.split('/').pop()!

// WebSocket hooks of the in-memory rooms (wired up by server/plugins/room-dev.ts)
export const memorySocket = defineWebSocket({
  open(peer) {
    memoryRoom(roomId(peer.request!.url)).peers.add(peer)
  },
  async message(peer, message) {
    const text = message.text()
    if (text === 'ping') {
      peer.send('pong')
      return
    }
    await dispatch(memoryHost(roomId(peer.request!.url)), peerConnection(peer), text)
  },
  close(peer) {
    memoryRoom(roomId(peer.request!.url)).peers.delete(peer)
  },
})
