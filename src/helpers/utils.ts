/**
 * Generates a random number between the given minimum and maximum values (inclusive).
 * @param min The minimum value of the range.
 * @param max The maximum value of the range.
 * @returns A random number between the minimum and maximum values.
 */
export function randomNumber(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}