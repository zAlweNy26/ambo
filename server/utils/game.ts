import { kv } from 'void/kv'

export interface Game {
  id: string
  extractions: number[]
  host: string
  clients: string[]
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
