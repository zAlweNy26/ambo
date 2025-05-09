export interface Game {
  id: string
  extractions: number[]
  host: string
  clients: string[]
}

export async function getActiveGames() {
  const keys = await hubKV().keys('game')
  return keys.length
}

export const setGame = (id: string, game: Game) => hubKV().set(`game:${id}`, game, { ttl: 60 * 60 * 24 })

export const getGame = (id: string) => hubKV().get<Game>(`game:${id}`)
