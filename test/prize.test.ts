import { describe, expect, it } from 'vitest'
import { allocate, splitPrize } from '../app/utils/prize'

describe('allocate', () => {
  it('gives leftover units to the first shares', () => {
    expect(allocate(1, [40, 60])).toEqual([1, 0])
    expect(allocate(7, [50, 50])).toEqual([4, 3])
    expect(allocate(100, [40, 60])).toEqual([40, 60])
  })
})

describe('splitPrize', () => {
  // Reference values produced by the previous dinero.js v1 implementation
  const reference: [number, ReturnType<typeof splitPrize>][] = [
    [
      0.1,
      {
        ambo: 0,
        terna: 0,
        quaterna: 0,
        cinquina: 0,
        tombola: 0.1,
      },
    ],
    [
      0.7,
      {
        ambo: 0,
        terna: 0.1,
        quaterna: 0.1,
        cinquina: 0.2,
        tombola: 0.3,
      },
    ],
    [
      1,
      {
        ambo: 0,
        terna: 0.1,
        quaterna: 0.2,
        cinquina: 0.3,
        tombola: 0.4,
      },
    ],
    [
      2.5,
      {
        ambo: 0.1,
        terna: 0.2,
        quaterna: 0.4,
        cinquina: 0.8,
        tombola: 1,
      },
    ],
    [
      10,
      {
        ambo: 0.6,
        terna: 0.9,
        quaterna: 1.5,
        cinquina: 3,
        tombola: 4,
      },
    ],
    [
      13.3,
      {
        ambo: 0.8,
        terna: 1.1,
        quaterna: 2,
        cinquina: 4,
        tombola: 5.4,
      },
    ],
    [
      50,
      {
        ambo: 3.1,
        terna: 4.4,
        quaterna: 7.5,
        cinquina: 15,
        tombola: 20,
      },
    ],
  ]

  it.each(reference)('splits %s like dinero.js v1 did', (total, expected) => {
    const prizes = splitPrize(total)
    for (const key of Object.keys(expected) as (keyof typeof expected)[])
      expect(prizes[key]).toBeCloseTo(expected[key], 10)
  })
})
