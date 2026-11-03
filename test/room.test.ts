import type { Connection, RoomHost, RoomState } from '#server/room/core'
import type { ServerMessage } from '#shared/types/room'
import type { Prize } from '#shared/utils/claim'
import { describe, expect, it } from 'vitest'
import { createRoom, dispatch, handle, parseMessage } from '#server/room/core'

const HOST = '00000000-0000-4000-8000-000000000001'
const P1 = 'a1a1a1a1-0000-4000-8000-000000000002'
const P2 = 'b2b2b2b2-0000-4000-8000-000000000003'

// Same sample cartella as the home page; row 1 is 4 21 43 62 85
const CARD = [
  4, 0, 21, 0, 43, 0, 62, 0, 85,
  0, 13, 0, 37, 48, 0, 66, 0, 88,
  9, 0, 28, 0, 0, 58, 0, 74, 90,
]

function room(): RoomState {
  const state = createRoom('abcd1234', HOST)
  state.players[P1] = [CARD]
  state.players[P2] = [CARD]
  return state
}

describe('handle', () => {
  it('lets only the host set the prize, and tells everyone', () => {
    const state = room()
    expect(handle(state, { player: P1 }, { type: 'prize', total: 10 }).reply[0]).toEqual({ type: 'error', reason: 'forbidden' })
    expect(handle(state, { host: true }, { type: 'prize', total: 10 }).broadcast).toEqual([
      { type: 'prize', total: 10 },
    ])
    expect(handle(state, {}, { type: 'join', player: P1, cards: 1 }).reply[0]).toMatchObject({ type: 'state', prize: 10 })
  })

  it('lets only the host pick the smorfia, and tells everyone', () => {
    const state = room()
    expect(handle(state, { player: P1 }, { type: 'smirk', smirk: 'romana' }).reply[0]).toEqual({ type: 'error', reason: 'forbidden' })
    expect(handle(state, { host: true }, { type: 'smirk', smirk: 'romana' }).broadcast).toEqual([
      { type: 'smirk', smirk: 'romana' },
    ])
    expect(handle(state, {}, { type: 'join', player: P1, cards: 1 }).reply[0]).toMatchObject({ smirk: 'romana' })
    expect(parseMessage('{"type":"smirk","smirk":"milanese"}')).toBeUndefined()
  })

  it('lets only the host draw', () => {
    const state = room()
    expect(handle(state, {}, { type: 'host', host: P1 }).reply[0]).toEqual({ type: 'error', reason: 'forbidden' })
    expect(handle(state, { player: P1 }, { type: 'draw' }).reply[0]).toEqual({ type: 'error', reason: 'forbidden' })
    expect(handle(state, {}, { type: 'host', host: HOST }).session).toEqual({ host: true })
    const out = handle(state, { host: true }, { type: 'draw' }, () => 0)
    expect(out.broadcast).toEqual([
      { type: 'draw', number: 1 },
    ])
    expect(state.extractions).toEqual([1])
  })

  it('never draws a number twice and stops at 90', () => {
    const state = room()
    for (let i = 0; i < 95; i++) handle(state, { host: true }, { type: 'draw' }, Math.random)
    expect(new Set(state.extractions).size).toBe(90)
  })

  it('deals cards once, and only redeals before the first draw', () => {
    const state = createRoom('abcd1234', HOST)
    const first = handle(state, {}, { type: 'join', player: P1, cards: 2 })
    expect(first.reply[0]).toMatchObject({ type: 'state', cards: state.players[P1] })
    expect(state.players[P1]).toHaveLength(2)
    const again = handle(state, {}, { type: 'join', player: P1, cards: 2 })
    expect(again.changed).toBe(false)
    handle(state, {}, { type: 'join', player: P1, cards: 3 })
    expect(state.players[P1]).toHaveLength(3)
    state.extractions.push(5)
    handle(state, {}, { type: 'join', player: P1, cards: 1 })
    expect(state.players[P1]).toHaveLength(3)
  })

  it('lists players by short ID and cartelle, never by full player ID', () => {
    const state = createRoom('abcd1234', HOST)
    expect(handle(state, {}, { type: 'join', player: P1, cards: 2 }).broadcast).toEqual([
      {
        type: 'players',
        players: [
          { id: 'a1a1a1', cards: 2 },
        ],
      },
    ])
    expect(handle(state, {}, { type: 'join', player: P1, cards: 2 }).broadcast).toEqual([])
    handle(state, {}, { type: 'join', player: P2, cards: 1 })
    const host = handle(state, {}, { type: 'host', host: HOST })
    expect(host.reply[0]).toMatchObject({
      players: [
        { id: 'a1a1a1', cards: 2 },
        { id: 'b2b2b2', cards: 1 },
      ],
    })
    expect(JSON.stringify(host)).not.toContain(P1)
  })

  it('checks claims against the dealt card and shares a prize won on the same draw', () => {
    const state = room()
    const claim = (player: string) => handle(state, { player }, {
      type: 'claim',
      card: 0,
      prize: 'ambo',
    })
    expect(claim(P1).reply[0]).toEqual({
      type: 'claim',
      prize: 'ambo',
      ok: false,
      reason: 'invalid',
    })
    state.extractions.push(21, 43)
    expect(claim(P1).reply[0]).toEqual({ type: 'claim', prize: 'ambo', ok: true })
    expect(claim(P2).broadcast[0]).toEqual({
      type: 'winners',
      winners: [
        { prize: 'ambo', player: 'a1a1a1', draw: 2 },
        { prize: 'ambo', player: 'b2b2b2', draw: 2 },
      ],
    })
    expect(handle(state, { player: P1 }, {
      type: 'claim',
      card: 1,
      prize: 'ambo',
    }).reply[0]).toMatchObject({ ok: false, reason: 'invalid' })
  })

  it('closes a prize, and the smaller ones, after the draw it was won on', () => {
    const state = room()
    state.extractions.push(4, 21, 43)
    handle(state, { player: P1 }, {
      type: 'claim',
      card: 0,
      prize: 'terna',
    })
    state.extractions.push(62)
    expect(handle(state, { player: P2 }, {
      type: 'claim',
      card: 0,
      prize: 'ambo',
    }).reply[0]).toMatchObject({ ok: false, reason: 'closed' })
    expect(handle(state, { player: P2 }, {
      type: 'claim',
      card: 0,
      prize: 'quaterna',
    }).reply[0]).toMatchObject({ ok: true })
  })

  it('starts a new round: new cartelle, no draws or prizes', () => {
    const state = room()
    state.extractions.push(21, 43)
    handle(state, { player: P1 }, {
      type: 'claim',
      card: 0,
      prize: 'ambo',
    })
    expect(handle(state, { player: P1 }, { type: 'round' }).reply[0]).toEqual({ type: 'error', reason: 'forbidden' })
    expect(handle(state, { host: true }, { type: 'round' }).broadcast).toEqual([
      { type: 'round' },
    ])
    expect(state).toMatchObject({
      extractions: [],
      claims: [],
      players: {},
    })
    const rejoin = handle(state, {}, { type: 'join', player: P1, cards: 3 })
    expect(rejoin.reply[0]).toMatchObject({
      winners: [],
      players: [
        { id: 'a1a1a1', cards: 3 },
      ],
    })
  })

  it('rejects prizes not played, and tombolino before the tombola or for its winner', () => {
    const state = room()
    const all = CARD.filter(n => n !== 0)
    const claim = (player: string, prize: Prize) => handle(state, { player }, {
      type: 'claim',
      card: 0,
      prize,
    }).reply[0]
    handle(state, { host: true }, {
      type: 'prize',
      total: 10,
      split: {
        ambo: 0,
        terna: 10,
        quaterna: 10,
        cinquina: 20,
        tombola: 40,
        tombolino: 20,
      },
    })
    state.extractions.push(21, 43)
    expect(claim(P1, 'ambo')).toMatchObject({ ok: false, reason: 'invalid' })
    state.extractions = [...all]
    expect(claim(P1, 'tombolino')).toMatchObject({ ok: false, reason: 'invalid' })
    expect(claim(P1, 'tombola')).toMatchObject({ ok: true })
    state.extractions.push(1)
    expect(claim(P1, 'tombolino')).toMatchObject({ ok: false, reason: 'invalid' })
    expect(claim(P2, 'tombolino')).toMatchObject({ ok: true })
  })

  it('rejects malformed messages', () => {
    expect(parseMessage('{"type":"draw"}')).toEqual({ type: 'draw' })
    expect(parseMessage('{"type":"join","player":"x","cards":2}')).toBeUndefined()
    expect(parseMessage('{"type":"claim","card":9,"prize":"ambo"}')).toBeUndefined()
    expect(parseMessage('ping')).toBeUndefined()
  })
})

describe('dispatch', () => {
  function fake(state: RoomState | undefined) {
    const sent: Record<string, ServerMessage[]> = { a: [], b: [] }
    const conns: Connection[] = ['a', 'b'].map(id => ({
      session: {},
      setSession(s) { this.session = s },
      send: m => sent[id]!.push(m),
    }))
    const calls: string[] = []
    const host: RoomHost = {
      state,
      connections: () => conns,
      save: async () => void calls.push('save'),
      clear: async () => void calls.push('clear'),
      stats: async () => {
        calls.push('stats')
        throw new Error('D1 down')
      },
    }
    return { host, conns, sent, calls }
  }

  it('saves and broadcasts a draw, and writes stats only at close, even if stats fail', async () => {
    const { host, conns, sent, calls } = fake(room())
    await dispatch(host, conns[0]!, JSON.stringify({ type: 'host', host: HOST }))
    await dispatch(host, conns[0]!, '{"type":"draw"}')
    expect(calls).toEqual(['save'])
    expect(sent.b).toHaveLength(1)
    await dispatch(host, conns[0]!, '{"type":"close"}')
    expect(calls).toEqual(['save', 'stats', 'clear'])
    expect(sent.b!.at(-1)).toEqual({ type: 'closed' })
  })

  it('skips stats for a game closed before any draw', async () => {
    const { host, conns, calls } = fake(room())
    await dispatch(host, conns[0]!, JSON.stringify({ type: 'host', host: HOST }))
    await dispatch(host, conns[0]!, '{"type":"close"}')
    expect(calls).toEqual(['clear'])
  })

  it('tells a socket when the game does not exist', async () => {
    const { host, conns, sent } = fake(undefined)
    await dispatch(host, conns[0]!, JSON.stringify({ type: 'join', player: P1, cards: 1 }))
    expect(sent.a).toEqual([
      { type: 'error', reason: 'not-found' },
    ])
  })
})
