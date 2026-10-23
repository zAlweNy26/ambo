import { integer, sqliteTable, text } from 'void/schema-d1'

// One row per game, upserted at every draw so games whose host just closes the tab are counted too
export const games = sqliteTable('games', {
  id: integer().primaryKey({ autoIncrement: true }),
  gameId: text('game_id').notNull().unique(),
  playersCount: integer('players_count').notNull(),
  // Time of the latest draw
  completedAt: integer('completed_at', { mode: 'timestamp' }).notNull(),
  totalExtractions: integer('total_extractions').notNull(),
})

export const extractions = sqliteTable('extractions', {
  id: integer().primaryKey({ autoIncrement: true }),
  gameId: text('game_id').notNull().unique().references(() => games.gameId),
  numbers: text('numbers', { mode: 'json' }).$type<number[]>().notNull(),
})
