// Prizes from smallest to biggest, and how many drawn numbers each needs: one row for ambo…cinquina, the whole cartella for tombola
export const PRIZES = [
  'ambo',
  'terna',
  'quaterna',
  'cinquina',
  'tombola',
] as const
export type Prize = typeof PRIZES[number]
export const PRIZE_COUNT: Record<Prize, number> = {
  ambo: 2,
  terna: 3,
  quaterna: 4,
  cinquina: 5,
  tombola: 15,
}

export interface Winner {
  prize: Prize
  name: string
}

// Cartella column of a number: 1–9, 10–19 … 80–90
const column = (n: number) => Math.min(Math.floor(n / 10), 8)

// The biggest prize one cartella (27 cells, 0 = blank) has earned with numbers that are both marked and drawn
export function bestPrize(card: number[], marked: number[], drawn: number[]) {
  const hit = (n: number) => n !== 0 && marked.includes(n) && drawn.includes(n)
  const rows = [0, 1, 2].map(r => card.slice(r * 9, r * 9 + 9).filter(hit))
  if (rows.every(row => row.length === 5)) {
    return {
      prize: 'tombola' as Prize,
      numbers: rows.flat(),
    }
  }
  const best = rows.reduce((a, b) => b.length > a.length
    ? b
    : a)
  if (best.length < 2) return
  return { prize: PRIZES[best.length - 2]!, numbers: best }
}

// Whether the numbers can win the prize: all drawn, no repeats, and for ambo…cinquina one per column, as on a single row
export function isValidClaim(prize: Prize, numbers: number[], drawn: number[]) {
  if (numbers.length !== PRIZE_COUNT[prize] || new Set(numbers).size !== numbers.length) return false
  if (!numbers.every(n => drawn.includes(n))) return false
  return prize === 'tombola' || new Set(numbers.map(column)).size === numbers.length
}

// A prize is closed once it, or a bigger one, was claimed on an earlier draw; claims on the same draw share it
export function isPrizeClosed(prize: Prize, claims: { prize: Prize, draw: number }[], draw: number) {
  return claims.some(c => PRIZES.indexOf(c.prize) >= PRIZES.indexOf(prize) && c.draw < draw)
}
