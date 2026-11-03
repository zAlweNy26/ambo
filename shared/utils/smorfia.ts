// The regional smorfie, one JSON file each in app/assets
export const SMORFIE = [
  'napoletana',
  'trapanese',
  'romana',
  'piemontese',
  'livornese',
] as const
export type Smorfia = typeof SMORFIE[number]
