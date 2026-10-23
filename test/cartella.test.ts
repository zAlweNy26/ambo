import { describe, expect, it } from 'vitest'
import { generateCartella } from '../shared/utils/cartella'

describe('generateCartella', () => {
  it('always builds a valid cartella', () => {
    // ~0.6% of tries get stuck, so 2,000 cards hit the retry path about a dozen times
    for (let k = 0; k < 2_000; k++) {
      const cells = generateCartella()
      expect(cells).toHaveLength(27)
      const numbers = cells.filter(n => n !== 0)
      expect(new Set(numbers).size).toBe(15)
      for (let row = 0; row < 3; row++)
        expect(cells.slice(row * 9, row * 9 + 9).filter(n => n !== 0)).toHaveLength(5)
      for (let col = 0; col < 9; col++) {
        const column = [0, 1, 2].map(row => cells[row * 9 + col]!).filter(n => n !== 0)
        expect(column.length).toBeLessThanOrEqual(2)
        expect(column).toEqual(column.toSorted((a, b) => a - b))
        for (const n of column) {
          expect(n).toBeGreaterThanOrEqual(col === 0
            ? 1
            : col * 10)
        }
        for (const n of column) {
          expect(n).toBeLessThanOrEqual(col === 8
            ? 90
            : col * 10 + 9)
        }
      }
    }
  })
})
