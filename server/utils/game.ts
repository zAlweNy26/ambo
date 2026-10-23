import { claims } from '@schema'
import { db, eq, lt } from 'void/db'
import { kv } from 'void/kv'

export interface Game {
  id: string
  extractions: number[]
  host: string
  // Claims so far, refreshed at every draw so players learn which prizes are gone
  winners?: Winner[]
}

export async function setGame(id: string, game: Game) {
  await kv.put(`game:${id}`, game, { ttl: 60 * 60 * 24 })
  return game
}

export const getGame = (id: string) => kv.get<Game>(`game:${id}`)

// The game, only for the host who created it: players know the game ID but never the host ID
export async function getHostedGame(id: string, hostId: string) {
  const game = await getGame(id)
  if (!game)
    throw createError({ statusCode: 400, statusMessage: 'Game not found' })
  if (game.host !== hostId)
    throw createError({ statusCode: 403, statusMessage: 'Not the host of this game' })
  return game
}

// Players live under their own keys so a join never rewrites (and races with) the game's draws
export async function addPlayer(id: string, player: string) {
  const key = `player:${id}:${player}`
  if (await kv.get(key) === null)
    await kv.put(key, '1', { ttl: 60 * 60 * 24 })
}

export function getWinners(id: string): Promise<Winner[]> {
  return db.select({ prize: claims.prize, name: claims.name }).from(claims).where(eq(claims.gameId, id)).orderBy(claims.id)
}

// Claims hold the names players type: keep them only while a game can still run (KV keeps games for a day).
// Called on every new game and claim, so abandoned games are swept too.
export async function forgetOldClaims() {
  await db.delete(claims).where(lt(claims.createdAt, new Date(Date.now() - 24 * 60 * 60 * 1000)))
}

export async function countPlayers(id: string) {
  // shortcut: one KV list page, so at most 1000 players per game are counted
  const { keys } = await kv.list({ prefix: `player:${id}:` })
  return keys.length
}
