import type { ClientMessage, Player, ServerMessage } from '#shared/types/room'
import type { Prize, Split, Winner } from '#shared/utils/claim'
import type { Smorfia } from '#shared/utils/smorfia'
import { z } from 'zod'
import { generateCartella, TABELLONE, TABELLONE_ID } from '#shared/utils/cartella'
import { earnedSince, isPrizeClosed, isPrizeOn, isTombolinoOpen, PRIZES } from '#shared/utils/claim'
import { shortId } from '#shared/utils/player'
import { SMORFIE } from '#shared/utils/smorfia'

// The rules of one live game, with no Cloudflare code: the Durable Object (production) and the in-memory
// room (`bun run dev`) both feed messages through `dispatch`, so they behave the same.

export const ROOM_TTL = 24 * 60 * 60 * 1000
export const MAX_PLAYERS = 200

export interface Claim {
  prize: Prize
  player: string
  // How many numbers were drawn when it was claimed
  draw: number
  // How many numbers were drawn when the claimed cartella earned it; missing in rooms saved before it existed
  since?: number
}

export interface RoomState {
  id: string
  host: string
  createdAt: number
  extractions: number[]
  // Numbers drawn in every round of this game, for the stats; missing in rooms saved before it existed
  drawn?: number
  // Cartelle the server dealt, per player ID: claims are checked against these
  players: Record<string, number[][]>
  claims: Claim[]
  // The host's prize pool in euro, so phones can show what each winner takes; missing in rooms saved before it existed
  prize?: number
  // The host's custom split, which also says which prizes are played; missing means the default ladder
  split?: Split
  // The price of one cartella, when the pool comes from the cartelle sold, so each phone shows what it owes
  price?: number
  // The host's smorfia, so phones can show the meaning of each number
  smirk?: Smorfia
}

// Who is on the other end of one socket, set by its first host/join message
export interface Session {
  host?: boolean
  player?: string
}

export interface Outcome {
  reply: ServerMessage[]
  broadcast: ServerMessage[]
  session?: Session
  // The state changed and must be saved
  changed?: boolean
  // The host ended the game: forget everything
  end?: boolean
}

const messageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('host'),
    host: z.uuid(),
  }),
  z.object({
    type: z.literal('join'),
    player: z.uuid(),
    cards: z.int().min(1).max(6),
  }),
  z.object({
    type: z.literal('draw'),
  }),
  z.object({
    type: z.literal('prize'),
    total: z.number().min(0).max(1_000_000),
    split: z.record(z.enum(PRIZES), z.int().min(0).max(100)).optional(),
    price: z.number().min(0).max(10_000).optional(),
  }),
  z.object({
    type: z.literal('smirk'),
    smirk: z.enum(SMORFIE),
  }),
  z.object({
    type: z.literal('claim'),
    card: z.int().min(0).max(5),
    prize: z.enum(PRIZES),
  }),
  z.object({
    type: z.literal('round'),
  }),
  z.object({
    type: z.literal('close'),
  }),
])

export function parseMessage(raw: string): ClientMessage | undefined {
  try {
    return messageSchema.parse(JSON.parse(raw))
  }
  catch {
    return undefined
  }
}

export function createRoom(id: string, host: string, now = Date.now()): RoomState {
  return {
    id,
    host,
    createdAt: now,
    extractions: [],
    players: {},
    claims: [],
  }
}

// Players appear by short ID only: the full one is the key to their cartelle
export function winnersOf(state: RoomState): Winner[] {
  return state.claims.map(({ prize, player, draw, since }) => ({
    prize,
    player: player === TABELLONE_ID
      ? player
      : shortId(player),
    draw,
    since,
  }))
}

export function playersOf(state: RoomState): Player[] {
  return Object.entries(state.players).map(([id, cards]) => ({
    id: shortId(id),
    cards: cards.length,
  }))
}

const cryptoRandom = () => crypto.getRandomValues(new Uint32Array(1))[0]! / 2 ** 32

const only = (...reply: ServerMessage[]): Outcome => ({ reply, broadcast: [] })
const forbidden = only({ type: 'error', reason: 'forbidden' })

export function handle(state: RoomState, session: Session, msg: ClientMessage, random = cryptoRandom): Outcome {
  // Built after the message changed the state
  const snapshot = () => ({
    extractions: state.extractions,
    winners: winnersOf(state),
    prize: state.prize ?? 0,
    split: state.split,
    price: state.price,
    players: playersOf(state),
    smirk: state.smirk,
  })
  switch (msg.type) {
    case 'host':
      if (msg.host !== state.host) return forbidden
      return {
        ...only({
          type: 'state',
          ...snapshot(),
        }),
        session: { host: true },
      }

    case 'join': {
      let cards = state.players[msg.player]
      // Cards are dealt once; a different number of cards is only possible before the first draw
      const deal = !cards || (cards.length !== msg.cards && state.extractions.length === 0)
      if (deal) {
        if (!cards && Object.keys(state.players).length >= MAX_PLAYERS) return only({ type: 'error', reason: 'full' })
        cards = Array.from({ length: msg.cards }, generateCartella)
        state.players[msg.player] = cards
      }
      return {
        reply: [
          {
            type: 'state',
            ...snapshot(),
            cards,
          },
        ],
        broadcast: deal
          ? [
              {
                type: 'players',
                players: playersOf(state),
              },
            ]
          : [],
        session: { player: msg.player },
        changed: deal,
      }
    }

    case 'draw': {
      if (!session.host) return forbidden
      const left = Array.from({ length: 90 }, (_, i) => i + 1).filter(n => !state.extractions.includes(n))
      if (!left.length) return only()
      const number = left[Math.floor(random() * left.length)]!
      state.extractions.push(number)
      state.drawn = (state.drawn ?? 0) + 1
      return {
        reply: [],
        broadcast: [
          { type: 'draw', number },
        ],
        changed: true,
      }
    }

    case 'prize':
      if (!session.host) return forbidden
      state.prize = msg.total
      state.split = msg.split
      state.price = msg.price
      return {
        reply: [],
        broadcast: [
          {
            type: 'prize',
            total: msg.total,
            split: msg.split,
            price: msg.price,
          },
        ],
        changed: true,
      }

    case 'smirk':
      if (!session.host) return forbidden
      state.smirk = msg.smirk
      return {
        reply: [],
        broadcast: [msg],
        changed: true,
      }

    case 'claim': {
      const { prize } = msg
      // The host claims for the tabellone, which plays like one player with 6 cartelle
      const who = session.host
        ? TABELLONE_ID
        : session.player
      const card = session.host
        ? TABELLONE[msg.card]
        : who
          ? state.players[who]?.[msg.card]
          : undefined
      const won = state.claims.filter(c => c.player === who).map(c => c.prize)
      const draw = state.extractions.length
      const since = card && earnedSince(card, state.extractions, prize)
      if (!card || since === undefined || !isPrizeOn(prize, state.split)
        || (prize === 'tombolino' && !isTombolinoOpen(state.claims, draw, won))) {
        return only({
          type: 'claim',
          prize,
          ok: false,
          reason: 'invalid',
        })
      }
      if (isPrizeClosed(prize, state.claims, draw, since)) {
        return only({
          type: 'claim',
          prize,
          ok: false,
          reason: 'closed',
        })
      }
      if (won.includes(prize)) return only({ type: 'claim', prize, ok: true })
      state.claims.push({
        prize,
        player: who!,
        draw,
        since,
      })
      return {
        reply: [
          { type: 'claim', prize, ok: true },
        ],
        broadcast: [
          {
            type: 'winners',
            winners: winnersOf(state),
          },
        ],
        changed: true,
      }
    }

    // Same room, same players: draws and prizes start over, and every phone rejoins for new cartelle
    case 'round':
      if (!session.host) return forbidden
      state.extractions = []
      state.claims = []
      state.players = {}
      return {
        reply: [],
        broadcast: [
          { type: 'round' },
        ],
        changed: true,
      }

    case 'close':
      if (!session.host) return forbidden
      return {
        reply: [],
        broadcast: [
          { type: 'closed' },
        ],
        end: true,
      }
  }
}

// One socket of a room, whatever runs it
export interface Connection {
  session: Session
  setSession: (session: Session) => void
  send: (message: ServerMessage) => void
}

// The room's storage and sockets, whatever runs it
export interface RoomHost {
  state: RoomState | undefined
  connections: () => Connection[]
  save: () => Promise<void>
  // Forget the game and close every socket
  clear: () => Promise<void>
  stats: () => Promise<void>
}

export async function dispatch(room: RoomHost, conn: Connection, raw: string) {
  const msg = parseMessage(raw)
  if (!msg) return
  if (!room.state) return conn.send({ type: 'error', reason: 'not-found' })
  const out = handle(room.state, conn.session, msg)
  if (out.session) conn.setSession(out.session)
  if (out.changed) await room.save()
  out.reply.forEach(conn.send)
  for (const message of out.broadcast) room.connections().forEach(c => c.send(message))
  if (out.end) {
    await saveFinalStats(room)
    return room.clear()
  }
}

export const drawnIn = (state: RoomState) => state.drawn ?? state.extractions.length

// Stats are written once, when the host closes the game or its alarm expires it, not at every draw: a draw then
// doesn't wait on D1, which is most of a Durable Object's billed time. Games with no draw in any round aren't counted.
export async function saveFinalStats(room: RoomHost) {
  // Best effort: a D1 hiccup must not stop the game from closing
  if (room.state && drawnIn(room.state)) await room.stats().catch(error => console.error(error))
}
