import { describe, expect, it } from 'vitest'
import { bestPrize, isPrizeClosed, isValidClaim } from '../shared/utils/claim'

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

describe('isValidClaim', () => {
  it('accepts drawn numbers that fit one row', () => {
    expect(isValidClaim('ambo', [21, 43], [1, 21, 43])).toBe(true)
    expect(isValidClaim('terna', [80, 85, 90], [80, 85, 90])).toBe(false) // all in the last column
    expect(isValidClaim('ambo', [21, 43], [21])).toBe(false)
    expect(isValidClaim('ambo', [21, 21], [21])).toBe(false)
    expect(isValidClaim('terna', [21, 43], [21, 43])).toBe(false)
    expect(isValidClaim('tombola', all, all)).toBe(true)
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
