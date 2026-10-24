import { integer, sqliteTable, text } from 'void/schema-d1'

// One row per game with at least one draw, written when the host closes it or its 24h alarm expires it
export const games = sqliteTable('games', {
  id: integer().primaryKey({ autoIncrement: true }),
  gameId: text('game_id').notNull().unique(),
  playersCount: integer('players_count').notNull(),
  // When the game was closed or expired
  completedAt: integer('completed_at', { mode: 'timestamp' }).notNull(),
  totalExtractions: integer('total_extractions').notNull(),
})

export const extractions = sqliteTable('extractions', {
  id: integer().primaryKey({ autoIncrement: true }),
  gameId: text('game_id').notNull().unique().references(() => games.gameId),
  numbers: text('numbers', { mode: 'json' }).$type<number[]>().notNull(),
})
