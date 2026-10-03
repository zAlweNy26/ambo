import type { H3Event } from 'h3'
import { drizzle } from 'drizzle-orm/d1'
import * as schema from '../db/schema'

export { schema }

export function useDB(event: H3Event) {
  return drizzle(event.context.cloudflare.env.DB, { schema, casing: 'camelCase' })
}
