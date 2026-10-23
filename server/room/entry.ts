/// <reference path="./workers.d.ts" />
import type { Env } from './durable'
import { createHandler } from 'nitropack/presets/cloudflare/runtime/_module-handler'
import { isPublicAssetURL } from '#nitro-internal-virtual/public-assets'
import '#nitro-internal-pollyfills'

// Production Worker entry: Nitro's cloudflare-module entry, plus the GameRoom class and /room/<id> routed to it
export { GameRoom } from './durable'

export default createHandler<Env & { ASSETS?: { fetch: (request: unknown) => Promise<Response> } }>({
  fetch(request, env, _context, url) {
    if (env.ASSETS && isPublicAssetURL(url.pathname)) return env.ASSETS.fetch(request)
    const id = url.pathname.match(/^\/room\/([0-9a-f]{8})$/)?.[1]
    if (id) return env.ROOMS.get(env.ROOMS.idFromName(id)).fetch(request)
  },
})
