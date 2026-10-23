import type { DrizzleD1Database } from 'void/db'
import type { RoomState } from './core'
import { extractions, games } from '@schema'

// Stats are upserted at every draw, so a game counts even if its host never leaves through the app
export async function saveStats(db: DrizzleD1Database, state: RoomState) {
  const row = {
    playersCount: Object.keys(state.players).length,
    completedAt: new Date(),
    totalExtractions: state.extractions.length,
  }
  await db.batch([
    db.insert(games).values({ gameId: state.id, ...row }).onConflictDoUpdate({ target: games.gameId, set: row }),
    db.insert(extractions).values({ gameId: state.id, numbers: state.extractions }).onConflictDoUpdate({
      target: extractions.gameId,
      set: { numbers: state.extractions },
    }),
  ])
}
