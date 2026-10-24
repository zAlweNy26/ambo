import type { H3Event } from 'h3'
import type { Env } from '../room/durable'
import { memoryRooms } from '../room/memory'

// The live games: a Durable Object per game in production, in-memory rooms under `bun run dev`
export function useRooms(event: H3Event) {
  if (import.meta.dev) return memoryRooms
  const rooms = (event.context.cloudflare.env as Env).ROOMS
  return {
    init: (id: string, host: string) => rooms.get(rooms.idFromName(id)).init(id, host),
  }
}
