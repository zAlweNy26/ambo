import { memorySocket } from '../../room/memory'

// Dev only: in production server/room/entry.ts hands /room/<id> to the game's Durable Object before Nuxt sees it
export default defineWebSocketHandler(memorySocket)
