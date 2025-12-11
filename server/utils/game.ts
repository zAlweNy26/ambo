import { kv } from 'hub:kv'

export interface Game {
  id: string
  extractions: number[]
  host: string
  clients: string[]
}

export async function getActiveGames() {
  const keys = await kv.keys('game')
  return keys.length
}

export async function setGame(id: string, game: Game) {
  await kv.set(`game:${id}`, game, { ttl: 60 * 60 * 24 })
  return game
}

export const getGame = (id: string) => kv.get<Game>(`game:${id}`)
