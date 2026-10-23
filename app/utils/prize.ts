export type Prizes = Record<'ambo' | 'terna' | 'quaterna' | 'cinquina' | 'tombola', number>

// Splits an integer amount by ratios; leftover units go one each to the first shares (dinero.js v1 semantics)
export function allocate(amount: number, ratios: number[]) {
  const total = ratios.reduce((a, b) => a + b, 0)
  const shares = ratios.map(r => Math.floor(amount * r / total))
  let rest = amount - shares.reduce((a, b) => a + b, 0)
  for (let i = 0; rest > 0; i++, rest--) shares[i % shares.length]!++
  return shares
}

// 40% to tombola, the other 60% halved down the ladder; whatever rounding leaves goes to terna and ambo
export function splitPrize(totalPrize: number): Prizes {
  const total = Math.round(totalPrize * 10) // tenths of a euro, the input's 0.1 step
  const prizes: Prizes = {
    ambo: 0,
    terna: 0,
    quaterna: 0,
    cinquina: 0,
    tombola: 0,
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
