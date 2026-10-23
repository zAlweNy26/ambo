import { describe, expect, it } from 'vitest'
import { bestPrize, hasPrize, isPrizeClosed } from '../shared/utils/claim'

// Same sample cartella as the home page
const card = [
  4, 0, 21, 0, 43, 0, 62, 0, 85,
  0, 13, 0, 37, 48, 0, 66, 0, 88,
  9, 0, 28, 0, 0, 58, 0, 74, 90,
]
const all = card.filter(n => n !== 0)

describe('bestPrize', () => {
  it('needs numbers both marked and drawn on one row', () => {
    expect(bestPrize(card, [21, 43], [21])).toBeUndefined()
    expect(bestPrize(card, [21, 66], [21, 66])).toBeUndefined()
    expect(bestPrize(card, [21, 43, 66], [21, 43, 66])).toEqual({
      prize: 'ambo',
      numbers: [21, 43],
    })
  })

  it('takes the best row, then the full cartella', () => {
    expect(bestPrize(card, [4, 21, 43, 62, 13], all)).toEqual({
      prize: 'quaterna',
      numbers: [4, 21, 43, 62],
    })
    expect(bestPrize(card, all.slice(0, 14), all)?.prize).toBe('cinquina')
    expect(bestPrize(card, all, all)).toEqual({ prize: 'tombola', numbers: all })
  })
})

describe('hasPrize', () => {
  it('checks the dealt cartella against the draws only', () => {
    expect(hasPrize(card, [21, 43, 1], 'ambo')).toBe(true)
    expect(hasPrize(card, [21, 66], 'ambo')).toBe(false) // two rows
    expect(hasPrize(card, [4, 21, 43], 'ambo')).toBe(true) // a terna row covers ambo
    expect(hasPrize(card, [4, 21, 43], 'quaterna')).toBe(false)
    expect(hasPrize(card, all.slice(0, 14), 'tombola')).toBe(false)
    expect(hasPrize(card, all, 'tombola')).toBe(true)
  })
})

describe('isPrizeClosed', () => {
  it('closes a prize after its draw, and every smaller prize with it', () => {
    const claims = [
      { prize: 'terna' as const, draw: 10 },
    ]
    expect(isPrizeClosed('terna', claims, 10)).toBe(false) // tie on the same draw
    expect(isPrizeClosed('terna', claims, 11)).toBe(true)
    expect(isPrizeClosed('ambo', claims, 11)).toBe(true)
    expect(isPrizeClosed('quaterna', claims, 11)).toBe(false)
  })
})
