/**
 * Placeholder mark = the website's current brand mark (BaseLayout.astro):
 * a ledger column whose last line is double-ruled, the bookkeeper's sign for
 * a final total. 32×32 grid. Replace via src/brand/config.ts when the final
 * logo/icon arrives.
 */
export const LOGO = {
  viewBox: 32,
  tile: {rx: 7},
  /** Ledger entries (mint). */
  lines: ['M 9 10.5 H 23', 'M 9 15.5 H 19'],
  /** Double rule under the total (white). */
  total: ['M 9 21 H 23', 'M 9 24.5 H 23'],
  stroke: 2,
} as const;
