/**
 * Building definitions for the isometric village.
 *
 * Fields:
 *   type        — Phaser texture key (must match key in VillageScene preload)
 *   gx / gy     — top-left tile corner in grid coordinates
 *   size        — footprint in tiles (size × size)
 *   name        — human-readable label
 *   interactive — true if the building opens a modal on click (default: false)
 *   modalKey    — modal to open (defaults to type if omitted)
 *   spriteScale — optional multiplier on top of auto-fit scale
 */
const buildings = [

  // ── Interactive ────────────────────────────────────────────────────
  { type: 'townhall',   gx: -7, gy: -1, size: 4, name: 'Town Hall',      interactive: true, modalKey: 'about'      },
  { type: 'barracks',   gx: 11, gy: -5, size: 3, name: 'Barracks',       interactive: true                         },
  { type: 'laboratory', gx: 11, gy:  5, size: 3, name: 'Laboratory',     interactive: true                         },
  { type: 'builderhut', gx:  6, gy:  2, size: 2, name: "Builder's Hut",  interactive: true, modalKey: 'builderhut' },
  { type: 'builderhut', gx: -9, gy: 10, size: 2, name: "Builder's Hut",  interactive: true, modalKey: 'builderhut' },
  { type: 'builderhut', gx: -9, gy:-10, size: 2, name: "Builder's Hut",  interactive: true, modalKey: 'builderhut' },

  // ── Decorative ─────────────────────────────────────────────────────
  { type: 'cannon',        gx: -7, gy: -5, size: 3, spriteScale: 1.30, name: 'Cannon'         },
  { type: 'cannon',        gx: -7, gy:  5, size: 3, spriteScale: 1.30, name: 'Cannon'         },
  { type: 'cannon',        gx: -2, gy: 10, size: 3, spriteScale: 1.30, name: 'Cannon'         },
  { type: 'cannon',        gx: -2, gy:-10, size: 3, spriteScale: 1.30, name: 'Cannon'         },
  { type: 'archertower',   gx:  6, gy:-10, size: 3,                    name: 'Archer Tower'   },
  { type: 'archertower',   gx:  6, gy: 10, size: 3,                    name: 'Archer Tower'   },
  { type: 'archertower',   gx:-13, gy: -5, size: 3,                    name: 'Archer Tower'   },
  { type: 'archertower',   gx:-13, gy:  5, size: 3,                    name: 'Archer Tower'   },
  { type: 'goldmine',      gx: 11, gy: -1, size: 3,                    name: 'Gold Mine'      },
  { type: 'goldmine',      gx:  3, gy:-10, size: 3,                    name: 'Gold Mine'      },
  { type: 'elixir',        gx: 11, gy:  2, size: 3, spriteScale: 0.75, name: 'Elixir Collector' },
  { type: 'elixir',        gx:  3, gy: 10, size: 3, spriteScale: 0.75, name: 'Elixir Collector' },
  { type: 'armycamp',      gx:  6, gy: -5, size: 4,                    name: 'Army Camp'      },
  { type: 'lootcart',      gx:  6, gy: -1, size: 3,                    name: 'Loot Cart'      },
  { type: 'armycamp',      gx:  6, gy:  5, size: 4,                    name: 'Army Camp'      },
  { type: 'armycamp',      gx:-15, gy:  1, size: 4,                    name: 'Army Camp'      },
  { type: 'clancastle',    gx:-10, gy:  0, size: 3,                    name: 'Clan Castle'    },
  { type: 'airdefense',    gx: -1, gy:  0, size: 3, spriteScale: 0.75, name: 'Air Defense'    },
  { type: 'elixirstorage', gx: -4, gy:  5, size: 3, spriteScale: 1.15, name: 'Elixir Storage' },
  { type: 'goldstorage',   gx: -4, gy: -5, size: 3,                    name: 'Gold Storage'   },
  { type: 'mortar',        gx:  1, gy: -5, size: 3,                    name: 'Mortar'         },
  { type: 'mortar',        gx:  1, gy:  5, size: 3,                    name: 'Mortar'         },
  { type: 'wizardtower',   gx: -7, gy: 10, size: 3, spriteScale: 0.75, name: 'Wizard Tower'   },
  { type: 'wizardtower',   gx: -7, gy:-10, size: 3, spriteScale: 0.75, name: 'Wizard Tower'   },

];

export default buildings;
