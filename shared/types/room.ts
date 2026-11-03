import type { Prize, Split, Winner } from '#shared/utils/claim'
import type { Smorfia } from '#shared/utils/smorfia'

// One player who joined, as the board lists them, by short ID
export interface Player {
  id: string
  cards: number
}

// What the board and the phones send to a game room over its WebSocket (/room/<id>)
export type ClientMessage
  = | { type: 'host', host: string }
    | { type: 'join', player: string, cards: number }
    | { type: 'draw' }
    | { type: 'prize', total: number, split?: Split, price?: number }
    | { type: 'smirk', smirk: Smorfia }
    | { type: 'claim', card: number, prize: Prize }
    | { type: 'round' }
    | { type: 'close' }

// What a game room sends back; `state` answers host/join and repeats after every reconnect
export type ServerMessage
  = | { type: 'state', extractions: number[], winners: Winner[], prize: number, split?: Split, price?: number, players: Player[], smirk?: Smorfia, cards?: number[][] }
    | { type: 'players', players: Player[] }
    | { type: 'draw', number: number }
    | { type: 'winners', winners: Winner[] }
    | { type: 'prize', total: number, split?: Split, price?: number }
    | { type: 'smirk', smirk: Smorfia }
    | { type: 'claim', prize: Prize, ok: true }
    | { type: 'claim', prize: Prize, ok: false, reason: 'closed' | 'invalid' }
    | { type: 'error', reason: 'not-found' | 'forbidden' | 'full' }
    | { type: 'round' }
    | { type: 'closed' }
