import type { H3Event } from 'h3'
import type { Env } from '../room/durable'
import { memoryRooms } from '../room/memory'

// The live games: a Durable Object per game in production, in-memory rooms under `bun run dev`
export function useRooms(event: H3Event) {
  if (import.meta.dev) return memoryRooms
  const rooms = (event.context.cloudflare.env as Env).ROOMS
  const room = (id: string) => rooms.get(rooms.idFromName(id))
  return {
    init: (id: string, host: string) => room(id).init(id, host),
    exists: (id: string) => room(id).exists(),
  }
}
