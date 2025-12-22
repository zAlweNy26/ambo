import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const games = sqliteTable('games', {
  id: integer().primaryKey({ autoIncrement: true }),
  gameId: text('game_id').notNull().unique(),
  playersCount: integer('players_count').notNull(),
  completedAt: integer('completed_at', { mode: 'timestamp' }).notNull(),
  totalExtractions: integer('total_extractions').notNull(),
})

export const extractions = sqliteTable('extractions', {
  id: integer().primaryKey({ autoIncrement: true }),
  gameId: text('game_id').notNull().references(() => games.gameId),
  number: integer().notNull(),
})
