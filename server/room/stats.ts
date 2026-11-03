import type { DrizzleD1Database } from 'void/db'
import type { RoomState } from '#server/room/core'
import { extractions, games } from '@schema'
import { drawnIn } from '#server/room/core'

// Called once per game, at close or expiry (saveFinalStats in core.ts); an upsert, so a repeat is harmless.
// shortcut: players and numbers are the last round's (a new round resets them); total draws cover every round.
export async function saveStats(db: DrizzleD1Database, state: RoomState) {
  const row = {
    playersCount: Object.keys(state.players).length,
    completedAt: new Date(),
    totalExtractions: drawnIn(state),
  }
  await db.batch([
    db.insert(games).values({ gameId: state.id, ...row }).onConflictDoUpdate({ target: games.gameId, set: row }),
    db.insert(extractions).values({ gameId: state.id, numbers: state.extractions }).onConflictDoUpdate({
      target: extractions.gameId,
      set: { numbers: state.extractions },
    }),
  ])
}
