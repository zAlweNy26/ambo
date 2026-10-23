import { randomInt } from 'es-toolkit'

// One try at a 3×9 cartella: five numbers per row, at most two per column, columns sorted top to bottom.
// Returns undefined when the first two rows took the same five columns and the third row has no room.
function tryCartella() {
  const card = Array.from({ length: 3 }, () => Array.from<number>({ length: 9 }).fill(0))
  for (const row of card) {
    let times = 0, steps = 0
    while (times < 5) {
      if (++steps > 1000) return
      const col = randomInt(0, 9)
      const num = randomInt(col === 0
        ? 1
        : col * 10, col * 10 + (col === 8
        ? 10
        : 9) + 1)
      if (row[col] === 0
        && !card.some(r => r.includes(num))
        && card.filter(r => r[col] === 0).length > 1) {
        row[col] = num
        times++
      }
    }
  }
  for (let i = 0; i < card.length; i++) {
    for (let j = 0; j < 9; j++) {
      if (card[i]![j] !== 0) {
        if (card[i + 1] !== undefined && card[i + 1]![j] !== 0 && card[i]![j]! > card[i + 1]![j]!)
          [card[i]![j]!, card[i + 1]![j]!] = [card[i + 1]![j]!, card[i]![j]!]
        else if (card[i + 2] !== undefined && card[i + 2]![j]! !== 0 && card[i]![j]! > card[i + 2]![j]!)
          [card[i]![j]!, card[i + 2]![j]!] = [card[i + 2]![j]!, card[i]![j]!]
      }
    }
  }
  return card
}

// A cartella as 27 cells, row by row; 0 is a blank cell
export function generateCartella(): number[] {
  for (;;) {
    const card = tryCartella()
    if (card) return card.flat()
  }
}
