import { kv } from 'void/kv'

export interface Game {
  id: string
  extractions: number[]
  host: string
}

export async function getActiveGames() {
  // shortcut: counts only the first 1000 games (one KV list page), fine for a log line
  const { keys } = await kv.list({ prefix: 'game:' })
  return keys.length
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

export async function countPlayers(id: string) {
  // shortcut: one KV list page, so at most 1000 players per game are counted
  const { keys } = await kv.list({ prefix: `player:${id}:` })
  return keys.length
}
