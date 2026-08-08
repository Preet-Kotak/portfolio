/**
 * Wall layout for the isometric village.
 *
 * Each entry is either a row or column of wall segments.
 *   type: 'row' — horizontal iso line (constant gy), gxStart→gxEnd
 *   type: 'col' — vertical iso line (constant gx), gyStart→gyEnd
 */
const walls = [
  { type: 'row', gxStart: -11, gxEnd:  5, gy:   4 },
  { type: 'row', gxStart: -11, gxEnd:  5, gy:  -1 },
  { type: 'row', gxStart:  -8, gxEnd:  5, gy:   9 },
  { type: 'row', gxStart:  -8, gxEnd:  5, gy:  -6 },
  { type: 'row', gxStart: -10, gxEnd:  1, gy: -11 },
  { type: 'row', gxStart: -10, gxEnd:  1, gy:  13 },

  { type: 'col', gx:   3, gyStart:  0, gyEnd:   3 },
  { type: 'col', gx: -11, gyStart:  0, gyEnd:   3 },
  { type: 'col', gx:   5, gyStart: -6, gyEnd:  -2 },
  { type: 'col', gx:   5, gyStart:  5, gyEnd:   9 },
  { type: 'col', gx:  -8, gyStart: -6, gyEnd:  -2 },
  { type: 'col', gx:  -8, gyStart:  5, gyEnd:   9 },
  { type: 'col', gx:  10, gyStart:-10, gyEnd:  14 },
];

export default walls;
