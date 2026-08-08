/**
 * Building definitions for the isometric village.
 *
 * Each entry describes one building sprite to be placed on the grid.
 *
 * Fields:
 *   type        — Phaser texture key (must match the key used in VillageScene preload)
 *   gx / gy     — top-left tile corner in grid coordinates
 *   size        — footprint in tiles (size × size)
 *   name        — human-readable label (used for tooltips / logs)
 *   interactive — whether the building is clickable
 *   spriteScale — (optional) multiplier applied on top of the auto-fit scale
 */
const buildings = [

  // ── TOWN HALL ──────────────────────────────────────────────────────
  { type: 'townhall', gx: -7, gy: -1, size: 4, name: 'Town Hall', interactive: true, modalKey: 'about' },

  // ── INTERACTIVE EXTERIOR ───────────────────────────────────────────
  { type: 'barracks',     gx: 11, gy: -5, size: 3, name: 'Barracks',          interactive: true  },
  { type: 'laboratory',   gx: 11, gy:  5, size: 3, name: 'Laboratory',        interactive: true  },
  { type: 'builderhut',   gx:  6, gy:  2, size: 2, name: "Builder's Hut",     interactive: true  },
  { type: 'builderhut',   gx: -9, gy: 10, size: 2, name: "Builder's Hut",     interactive: true  },
  { type: 'builderhut',   gx: -9, gy:-10, size: 2, name: "Builder's Hut",     interactive: true  },

  // ── CANNONS ────────────────────────────────────────────────────────
  { type: 'cannon', gx: -7, gy: -5, size: 3, spriteScale: 1.3, name: 'Cannon', interactive: false },
  { type: 'cannon', gx: -7, gy:  5, size: 3, spriteScale: 1.3, name: 'Cannon', interactive: false },
  { type: 'cannon', gx: -2, gy: 10, size: 3, spriteScale: 1.3, name: 'Cannon', interactive: false },
  { type: 'cannon', gx: -2, gy:-10, size: 3, spriteScale: 1.3, name: 'Cannon', interactive: false },

  // ── ARCHER TOWERS ──────────────────────────────────────────────────
  { type: 'archertower', gx:  6, gy:-10, size: 3, name: 'Archer Tower', interactive: false },
  { type: 'archertower', gx:  6, gy: 10, size: 3, name: 'Archer Tower', interactive: false },
  { type: 'archertower', gx:-13, gy: -5, size: 3, name: 'Archer Tower', interactive: false },
  { type: 'archertower', gx:-13, gy:  5, size: 3, name: 'Archer Tower', interactive: false },

  // ── GOLD MINES ─────────────────────────────────────────────────────
  { type: 'goldmine', gx: 11, gy: -1, size: 3, name: 'Gold Mine', interactive: false },
  { type: 'goldmine', gx:  3, gy:-10, size: 3, name: 'Gold Mine', interactive: false },

  // ── ELIXIR COLLECTORS ──────────────────────────────────────────────
  { type: 'elixir', gx: 11, gy:  2, size: 3, spriteScale: 0.75, name: 'Elixir Collector', interactive: false },
  { type: 'elixir', gx:  3, gy: 10, size: 3, spriteScale: 0.75, name: 'Elixir Collector', interactive: false },

  // ── ARMY CAMPS ─────────────────────────────────────────────────────
  { type: 'armycamp', gx:  6, gy: -5, size: 4, name: 'Army Camp', interactive: false },
  { type: 'lootcart', gx:  6, gy: -1, size: 3, name: 'Loot Cart', interactive: false },
  { type: 'armycamp', gx:  6, gy:  5, size: 4, name: 'Army Camp', interactive: false },
  { type: 'armycamp', gx:-15, gy:  1, size: 4, name: 'Army Camp', interactive: false },

  // ── REMAINING BUILDINGS ────────────────────────────────────────────
  { type: 'clancastle',    gx:-10, gy:  0, size: 3,                    name: 'Clan Castle',     interactive: false },
  { type: 'airdefense',    gx: -1, gy:  0, size: 3, spriteScale: 0.75, name: 'Air Defense',     interactive: false },
  { type: 'elixirstorage', gx: -4, gy:  5, size: 3, spriteScale: 1.15, name: 'Elixir Storage',  interactive: false },
  { type: 'goldstorage',   gx: -4, gy: -5, size: 3,                    name: 'Gold Storage',    interactive: false },
  { type: 'mortar',        gx:  1, gy: -5, size: 3,                    name: 'Mortar',          interactive: false },
  { type: 'mortar',        gx:  1, gy:  5, size: 3,                    name: 'Mortar',          interactive: false },
  { type: 'wizardtower',   gx: -7, gy: 10, size: 3, spriteScale: 0.75, name: 'Wizard Tower',    interactive: false },
  { type: 'wizardtower',   gx: -7, gy:-10, size: 3, spriteScale: 0.75, name: 'Wizard Tower',    interactive: false },

];

export default buildings;
