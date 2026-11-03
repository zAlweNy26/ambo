// Prizes from smallest to biggest, and how many drawn numbers each needs: one row for ambo…cinquina, the whole cartella
// for tombola. Tombolino is an optional second tombola, open once the tombola is won.
export const PRIZES = [
  'ambo',
  'terna',
  'quaterna',
  'cinquina',
  'tombola',
  'tombolino',
] as const
export type Prize = typeof PRIZES[number]
export const PRIZE_COUNT: Record<Prize, number> = {
  ambo: 2,
  terna: 3,
  quaterna: 4,
  cinquina: 5,
  tombola: 15,
  tombolino: 15,
}

// The host's share of the pool per prize, in percent; a prize at 0 is not played
export type Split = Record<Prize, number>

// Without a custom split every prize is played but tombolino
export function isPrizeOn(prize: Prize, split?: Split) {
  return split
    ? split[prize] > 0
    : prize !== 'tombolino'
}

export interface Winner {
  prize: Prize
  name: string
  // How many numbers were drawn when it was claimed: others can still tie until the next draw
  draw: number
}

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

// Whether a dealt cartella earns the prize with the numbers drawn so far (a bigger row also covers a smaller prize)
export function hasPrize(card: number[], drawn: number[], prize: Prize) {
  const best = bestPrize(card, drawn, drawn)
  const need = prize === 'tombolino'
    ? 'tombola'
    : prize
  return !!best && PRIZES.indexOf(best.prize) >= PRIZES.indexOf(need)
}

// A prize is closed once it, or a bigger one, was claimed on an earlier draw; claims on the same draw share it
export function isPrizeClosed(prize: Prize, claims: { prize: Prize, draw: number }[], draw: number) {
  return claims.some(c => PRIZES.indexOf(c.prize) >= PRIZES.indexOf(prize) && c.draw < draw)
}

// Whether a player may claim tombolino: the tombola was won on an earlier draw, and not by them.
// shortcut: barred per player, not per cartella, like every other prize; track cards if players ask for both.
export function isTombolinoOpen(claims: { prize: Prize, draw: number }[], draw: number, won: Prize[]) {
  return isPrizeClosed('tombola', claims, draw) && !won.includes('tombola')
}

// The prize a cartella can claim now: the biggest one played that its marked and drawn numbers earn, unless that one is
// closed or already the player's (a smaller one would be the same row twice). Prizes not played are skipped.
export function claimablePrize(card: number[], marked: number[], drawn: number[], claims: { prize: Prize, draw: number }[], won: Prize[], split?: Split) {
  const best = bestPrize(card, marked, drawn)
  if (!best) return
  const draw = drawn.length
  const earned: Prize[] = PRIZES.slice(0, PRIZES.indexOf(best.prize) + 1)
  if (best.prize === 'tombola' && isTombolinoOpen(claims, draw, won)) earned.push('tombolino')
  const prize = earned.findLast(p => isPrizeOn(p, split))
  return prize && !won.includes(prize) && !isPrizeClosed(prize, claims, draw)
    ? prize
    : undefined
}
