import type { Prize, Winner } from '../utils/claim'

// What the board and the phones send to a game room over its WebSocket (/room/<id>)
export type ClientMessage
  = | { type: 'host', host: string }
    | { type: 'join', player: string, cards: number }
    | { type: 'draw' }
    | { type: 'prize', total: number }
    | { type: 'claim', card: number, prize: Prize, name: string }
    | { type: 'close' }

// What a game room sends back; `state` answers host/join and repeats after every reconnect
export type ServerMessage
  = | { type: 'state', extractions: number[], winners: Winner[], prize: number, cards?: number[][] }
    | { type: 'draw', number: number }
    | { type: 'winners', winners: Winner[] }
    | { type: 'prize', total: number }
    | { type: 'claim', prize: Prize, ok: true }
    | { type: 'claim', prize: Prize, ok: false, reason: 'closed' | 'invalid' }
    | { type: 'error', reason: 'not-found' | 'forbidden' | 'full' }
    | { type: 'closed' }
