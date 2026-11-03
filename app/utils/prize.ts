import type { Prize, Split, Winner } from '../../shared/utils/claim'
import { PRIZES } from '../../shared/utils/claim'

export type Prizes = Record<Prize, number>

// What a custom split starts from: the default ladder in round numbers
export const DEFAULT_SPLIT: Split = {
  ambo: 5,
  terna: 10,
  quaterna: 15,
  cinquina: 30,
  tombola: 40,
  tombolino: 0,
}

// Splits an integer amount by ratios; leftover units go one each to the first shares (dinero.js v1 semantics)
export function allocate(amount: number, ratios: number[]) {
  const total = ratios.reduce((a, b) => a + b, 0)
  const shares = ratios.map(r => Math.floor(amount * r / total))
  let rest = amount - shares.reduce((a, b) => a + b, 0)
  for (let i = 0; rest > 0; i++, rest--) shares[i % shares.length]!++
  return shares
}

// The host's split, scaled to the pool; by default 40% to tombola, the other 60% halved down the ladder, and whatever
// rounding leaves goes to terna and ambo
export function splitPrize(totalPrize: number, split?: Split): Prizes {
  const total = Math.round(totalPrize * 10) // tenths of a euro, the input's 0.1 step
  if (split) {
    const ratios = PRIZES.map(p => split[p])
    const shares = ratios.some(r => r > 0)
      ? allocate(total, ratios)
      : ratios
    return Object.fromEntries(PRIZES.map((p, i) => [p, shares[i]! / 10])) as Prizes
  }
  const prizes: Prizes = {
    ambo: 0,
    terna: 0,
    quaterna: 0,
    cinquina: 0,
    tombola: 0,
    tombolino: 0,
  }
  const [tombola, rest] = allocate(total, [40, 60]) as [number, number]
  prizes.tombola = tombola / 10
  prizes.cinquina = Math.round(rest / 2) / 10
  prizes.quaterna = Math.round(rest / 4) / 10
  prizes.terna = Math.round(rest / 8) / 10
  prizes.ambo = Math.round(rest / 12) / 10
  const sum = prizes.ambo + prizes.terna + prizes.quaterna + prizes.cinquina + prizes.tombola
  const [toTerna, toAmbo] = allocate(Math.round(((total / 10) - sum) * 10), [50, 50]) as [number, number]
  prizes.terna += toTerna / 10
  prizes.ambo += toAmbo / 10
  return prizes
}

// Each prize's winners with their share: a prize won on the same draw is split in tenths of a euro
export function prizeWinners(totalPrize: number, winners: Winner[], split?: Split) {
  const prizes = splitPrize(totalPrize, split)
  return Object.fromEntries(Object.entries(prizes).map(([prize, amount]) => {
    const names = winners.filter(w => w.prize === prize).map(w => w.name)
    const shares = allocate(Math.round(amount * 10), names.map(() => 1))
    return [
      prize,
      names.map((name, i) => ({ name, amount: shares[i]! / 10 })),
    ]
  })) as Record<keyof Prizes, { name: string, amount: number }[]>
}
