import type { ClientMessage, Player, ServerMessage } from '#shared/types/room'
import type { Prize, Split, Winner } from '#shared/utils/claim'
import type { Smorfia } from '#shared/utils/smorfia'
import { z } from 'zod'
import { generateCartella } from '#shared/utils/cartella'
import { hasPrize, isPrizeClosed, isPrizeOn, isTombolinoOpen, PRIZES } from '#shared/utils/claim'
import { SMORFIE } from '#shared/utils/smorfia'

// The rules of one live game, with no Cloudflare code: the Durable Object (production) and the in-memory
// room (`bun run dev`) both feed messages through `dispatch`, so they behave the same.

export const ROOM_TTL = 24 * 60 * 60 * 1000
export const MAX_PLAYERS = 200

export interface Claim {
  prize: Prize
  player: string
  name: string
  // How many numbers were drawn when it was claimed
  draw: number
}

export interface RoomState {
  id: string
  host: string
  createdAt: number
  extractions: number[]
  // Cartelle the server dealt, per player ID: claims are checked against these
  players: Record<string, number[][]>
  // Players' names, per player ID, from their join or claim; missing in rooms saved before it existed
  names?: Record<string, string>
  claims: Claim[]
  // The host's prize pool in euro, so phones can show what each winner takes; missing in rooms saved before it existed
  prize?: number
  // The host's custom split, which also says which prizes are played; missing means the default ladder
  split?: Split
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
    name: z.string().trim().max(24).optional(),
  }),
  z.object({
    type: z.literal('draw'),
  }),
  z.object({
    type: z.literal('prize'),
    total: z.number().min(0).max(1_000_000),
    split: z.record(z.enum(PRIZES), z.int().min(0).max(100)).optional(),
  }),
  z.object({
    type: z.literal('smirk'),
    smirk: z.enum(SMORFIE),
  }),
  z.object({
    type: z.literal('claim'),
    card: z.int().min(0).max(5),
    prize: z.enum(PRIZES),
    name: z.string().trim().min(1).max(24),
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

export const winnersOf = (state: RoomState): Winner[] => state.claims.map(({ prize, name, draw }) => ({ prize, name, draw }))

// Who joined, without their player IDs: those are the keys to their cartelle
export function playersOf(state: RoomState): Player[] {
  return Object.entries(state.players).map(([id, cards]) => ({
    name: state.names?.[id] ?? '',
    cards: cards.length,
  }))
}

// Remembers a player's name; true if it changed
function rename(state: RoomState, player: string, name: string | undefined) {
  if (!name || state.names?.[player] === name) return false
  state.names = { ...state.names, [player]: name }
  return true
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
      const changed = rename(state, msg.player, msg.name) || deal
      return {
        reply: [
          {
            type: 'state',
            ...snapshot(),
            cards,
          },
        ],
        broadcast: changed
          ? [
              {
                type: 'players',
                players: playersOf(state),
              },
            ]
          : [],
        session: { player: msg.player },
        changed,
      }
    }

    case 'draw': {
      if (!session.host) return forbidden
      const left = Array.from({ length: 90 }, (_, i) => i + 1).filter(n => !state.extractions.includes(n))
      if (!left.length) return only()
      const number = left[Math.floor(random() * left.length)]!
      state.extractions.push(number)
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
      return {
        reply: [],
        broadcast: [
          { type: 'prize', total: msg.total, split: msg.split },
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
      const { prize, name } = msg
      const card = session.player ? state.players[session.player]?.[msg.card] : undefined
      const won = state.claims.filter(c => c.player === session.player).map(c => c.prize)
      const draw = state.extractions.length
      if (!card || !hasPrize(card, state.extractions, prize) || !isPrizeOn(prize, state.split)
        || (prize === 'tombolino' && !isTombolinoOpen(state.claims, draw, won))) {
        return only({
          type: 'claim',
          prize,
          ok: false,
          reason: 'invalid',
        })
      }
      if (isPrizeClosed(prize, state.claims, draw)) {
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
        player: session.player!,
        name,
        draw,
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
          ...(rename(state, session.player!, name)
            ? [
                {
                  type: 'players',
                  players: playersOf(state),
                } as const,
              ]
            : []),
        ],
        changed: true,
      }
    }

    // Same room, same players and names: draws and prizes start over, and every phone rejoins for new cartelle
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

// Stats are written once, when the host closes the game or its alarm expires it, not at every draw: a draw then
// doesn't wait on D1, which is most of a Durable Object's billed time. Games with no draw aren't counted.
export async function saveFinalStats(room: RoomHost) {
  // Best effort: a D1 hiccup must not stop the game from closing
  if (room.state?.extractions.length) await room.stats().catch(error => console.error(error))
}
