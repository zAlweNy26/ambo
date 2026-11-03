// How the board and the phones show a player: the start of their player ID. The full ID is the key to their cartelle,
// so it never leaves the room; 6 hex digits leave the rest unguessable.
// shortcut: two players can share a short ID (about 1 in 800 with 200 players); only the display is affected.
export const shortId = (player: string) => player.slice(0, 6)
