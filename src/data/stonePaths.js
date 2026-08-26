/**
 * Stone path layout for the isometric village.
 * Same format as walls.js — edit the entries below to define path routes.
 *
 *   type: 'row' — horizontal iso line (constant gy), gxStart→gxEnd
 *   type: 'col' — vertical iso line (constant gx), gyStart→gyEnd
 *
 * Examples:
 *   { type: 'row', gxStart: -3, gxEnd: 3, gy: 0 }   — horizontal path
 *   { type: 'col', gx: 0, gyStart: -3, gyEnd: 3 }    — vertical path
 */
const stonePaths = [
  // gxStart must be smaller than gxEnd
  // visible grid range: gx roughly -11 to 10, gy roughly -11 to 13
  { type: 'row', gxStart: -26, gxEnd: -12, gy: -1 },
  { type: 'row', gxStart: -17, gxEnd: 25, gy: -17 },

  { type: 'col', gx:-17, gyStart: -17, gyEnd: -1 },
  { type: 'col', gx:17, gyStart: -17, gyEnd: 25 },
];

export default stonePaths;