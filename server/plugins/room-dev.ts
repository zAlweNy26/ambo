import { memorySocket } from '../room/memory'

// Dev only: sends /room/<id> WebSockets to the in-memory rooms. A route file can't do it: h3 v1 takes WebSocket
// hooks from the first matching layer, and a lazy middleware of @nuxtjs/seo (llms.txt) matches every path first.
// In production server/room/entry.ts hands /room/<id> to the Durable Object before Nuxt sees it.
export default defineNitroPlugin((nitroApp) => {
  if (!import.meta.dev) return
  const websocket = nitroApp.h3App.websocket
  Object.defineProperty(nitroApp.h3App, 'websocket', {
    value: {
      ...websocket,
      resolve: (info: { url?: string, request?: { url: string } }) => {
        const url = info.request?.url ?? info.url ?? '/'
        return new URL(url, 'http://localhost').pathname.startsWith('/room/')
          ? memorySocket
          : websocket.resolve?.(info as never)
      },
    },
  })
})
