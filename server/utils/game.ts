export interface Game {
  id: string
  extractions: number[]
  host: string
  clients: string[]
}

const kv = () => useStorage('kv')

export async function getActiveGames() {
  const keys = await kv().getKeys('game:')
  return keys.length
}

export async function setGame(id: string, game: Game) {
  await kv().setItem(`game:${id}`, game, { ttl: 60 * 60 * 24 })
  return game
}

export const getGame = (id: string) => kv().getItem<Game>(`game:${id}`)
