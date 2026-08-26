import Phaser from 'phaser';
import buildings  from '../data/buildings';
import walls      from '../data/walls';
import stonePaths from '../data/stonePaths';

export default class VillageScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VillageScene' });
    this.buildings = [];
  }

  preload() {
    this.load.image('background',    'assets/environment/background.png');
    this.load.image('townhall',      'assets/buildings/town-hall.png');
    this.load.image('barracks',      'assets/buildings/barracks.png');
    this.load.image('builderhut',    'assets/buildings/builder-hut.png');
    this.load.image('laboratory',    'assets/buildings/laboratory.png');
    this.load.image('goldmine',      'assets/buildings/gold-mine.png');
    this.load.image('elixir',        'assets/buildings/elixir-collector.png');
    this.load.image('cannon',        'assets/buildings/cannon.png');
    this.load.image('archertower',   'assets/buildings/archer-tower.png');
    this.load.image('armycamp',      'assets/buildings/army-camp.png');
    this.load.image('wall',          'assets/buildings/wall-segment.png');
    this.load.image('clancastle',    'assets/buildings/clan-castle.png');
    this.load.image('airdefense',    'assets/buildings/air-defense.png');
    this.load.image('elixirstorage', 'assets/buildings/elixir-storage.png');
    this.load.image('goldstorage',   'assets/buildings/gold-storage.png');
    this.load.image('mortar',        'assets/buildings/mortar.png');
    this.load.image('wizardtower',      'assets/buildings/wizard-tower.png');
    this.load.image('lootcart',         'assets/buildings/loot-cart.png');
    this.load.image('stonepath',        'assets/buildings/stone-path.webp');
    this.load.image('gembox',           'assets/buildings/gem-box.webp');
    this.load.image('tree1',            'assets/buildings/tree1.webp');
    this.load.image('tree2',            'assets/buildings/tree2.webp');
    this.load.image('trunk1',           'assets/buildings/trunk1.webp');
    this.load.image('trunk2',           'assets/buildings/trunk2.webp');
    this.load.image('trunk3',           'assets/buildings/trunk3.webp');
    this.load.image('archer-character', 'assets/buildings/archer-character.webp');
    this.load.image('wizard-character', 'assets/buildings/wizard-character.webp');
  }

  create() {
    this._modalOpen = false;
    this._isMobile  = window.innerWidth < 1024;
    this._dpr       = this.game.registry.get('dpr') ?? 1;

    const cssW = this.game.registry.get('cssWidth')  ?? this.scale.width  / this._dpr;
    const cssH = this.game.registry.get('cssHeight') ?? this.scale.height / this._dpr;

    this.game.events.on('setModalOpen', (isOpen) => {
      this._modalOpen = isOpen;
      this.input.keyboard.enabled = !isOpen;
      this.input.enabled          = !isOpen;
    });

    this.game.events.on('canvasResized', (nCssW, nCssH) => {
      this._isMobile = window.innerWidth < 1024;
      this._rebuildGrid(nCssW, nCssH);
      this._resetCamera(nCssW, nCssH, false);
    });

    this._bg = this.add.image(0, 0, 'background');
    this._bg.setOrigin(0, 0);
    this._bg.setDepth(-1000);

    this._rebuildGrid(cssW, cssH);
    this._resetCamera(cssW, cssH, true);

    this.placeBuildings();
    this.setupCameraControls();
  }

  _resetCamera(cssW, cssH, isInit) {
    const dpr   = this._dpr;
    const physW = cssW * dpr;
    const physH = cssH * dpr;

    // Fit bg to canvas width. bg aspect == canvas aspect so bg fills exactly at zoom=1.
    const bgScale  = physW / this._bg.width;
    this._bg.setScale(bgScale);
    this._bg.setPosition(0, 0);
    const bgWorldW = physW;
    const bgWorldH = this._bg.height * bgScale; // ≈ physH

    // At zoom z: viewport = physW/z × physH/z.
    // No green requires: physW/z ≤ bgWorldW AND physH/z ≤ bgWorldH
    // Since bgWorldW=physW and bgWorldH≈physH, minZoom ≈ 1.0.
    // Add 0.002 epsilon for floating point — ensures no green at edges.
    this._minZoom = Math.max(physW / bgWorldW, physH / bgWorldH) + 0.002;

    if (isInit) {
      // Mobile: use minZoom exactly — never go below it
      // Desktop: zoom in to 1.5 for scroll range
      const initZoom = this._isMobile
        ? this._minZoom * 1.35   // 35% more zoomed in on mobile — bigger buildings
        : 1.5;
      this.cameras.main.setZoom(initZoom);
    } else {
      if (this.cameras.main.zoom < this._minZoom) {
        this.cameras.main.setZoom(this._minZoom);
      }
    }

    // Bounds AFTER zoom is set, so Phaser calculates scroll limits correctly
    this.cameras.main.setBounds(0, 0, bgWorldW, bgWorldH);

    // Only set initial camera position on first load — don't reset scroll on resize
    if (!isInit) return;

    // Focus on Town Hall center (gx:-7, gy:-1, size:4 → center at cx=-5, cy=1)
    const { center, tileWidth, tileHeight } = this.gridInfo;
    const thCx = -5;  // gx + size/2
    const thCy =  1;  // gy + size/2
    const fx = center.x + (thCx - thCy) * (tileWidth  / 2);
    const fy = center.y + (thCx + thCy) * (tileHeight / 2);

    // centerOn works in world coords and respects bounds automatically
    this.cameras.main.centerOn(fx, fy + tileHeight * 8);
  }

  _rebuildGrid(cssW, cssH) {
    void cssH;
    const physW = cssW * this._dpr;
    const s     = physW / 1200;

    const gridCorners = {
      top:    { x: 613  * s, y:  84 * s },
      right:  { x: 1008 * s, y: 380 * s },
      bottom: { x: 613  * s, y: 678 * s },
      left:   { x: 220  * s, y: 382 * s },
    };

    const gridCenter = {
      x: (gridCorners.left.x + gridCorners.right.x) / 2,
      y: (gridCorners.top.y  + gridCorners.bottom.y) / 2,
    };

    this.gridInfo = {
      center:     gridCenter,
      tileWidth:  (gridCorners.right.x - gridCorners.left.x) / 44,
      tileHeight: (gridCorners.bottom.y - gridCorners.top.y) / 44,
      corners:    gridCorners,
    };
  }

  placeBuildings() {
    const { center, tileWidth, tileHeight } = this.gridInfo;

    const tileCenter = (gx, gy, size) => {
      const cx = gx + size / 2;
      const cy = gy + size / 2;
      return {
        x: center.x + (cx - cy) * (tileWidth  / 2),
        y: center.y + (cx + cy) * (tileHeight / 2),
      };
    };

    buildings.forEach((d) => {
      const pos   = tileCenter(d.gx, d.gy, d.size);
      const spr   = this.add.image(pos.x, pos.y, d.type);
      const scale = Math.max(
        (d.size * tileWidth)  / spr.width,
        (d.size * tileHeight) / spr.height
      ) * (d.spriteScale ?? 1.0);

      spr.setScale(scale);
      spr.setOrigin(0.5, 0.5);
      spr.setDepth(pos.y);
      spr.setData('modalKey', d.modalKey ?? d.type);

      if (d.interactive) {
        spr.setInteractive({ useHandCursor: true });
        spr.on('pointerover', () => {
          spr.setTint(0xFFFFAA);
          this.tweens.add({ targets: spr, scaleX: scale * 1.1, scaleY: scale * 1.1, duration: 150, ease: 'Power2' });
        });
        spr.on('pointerout', () => {
          spr.clearTint();
          this.tweens.add({ targets: spr, scaleX: scale, scaleY: scale, duration: 150, ease: 'Power2' });
        });
        spr.on('pointerup', () => {
          if (this._getHasMoved && this._getHasMoved()) return;
          this.onBuildingClick(spr);
        });

        // Idle pulse on all interactive buildings — hints to user they're clickable
        this._startPulseAnim(spr, scale);
      }

      // Idle sway on trees and trunks — stagger so they don't all move in sync
      if (['tree1', 'tree2', 'trunk1', 'trunk2', 'trunk3'].includes(d.type)) {
        this._startSwayAnim(spr, scale);
      }

      // Sparkles on gem box
      if (d.type === 'gembox') {
        this._startSparkles(spr);
      }

      this.buildings.push(spr);
    });

    walls.forEach((w) => {
      if (w.type === 'row') {
        for (let gx = w.gxStart; gx <= w.gxEnd; gx++) {
          this._placeWallSegment(tileCenter(gx, w.gy, 1));
        }
      } else {
        for (let gy = w.gyStart; gy <= w.gyEnd; gy++) {
          this._placeWallSegment(tileCenter(w.gx, gy, 1));
        }
      }
    });

    stonePaths.forEach((w) => {
      if (w.type === 'row') {
        for (let gx = w.gxStart; gx <= w.gxEnd; gx++) {
          this._placePathSegment(tileCenter(gx, w.gy, 1));
        }
      } else {
        for (let gy = w.gyStart; gy <= w.gyEnd; gy++) {
          this._placePathSegment(tileCenter(w.gx, gy, 1));
        }
      }
    });

    // Place characters on top of their towers
    // Archer on the top-right archer tower (gx:6, gy:-10)
    // Wizard on the top wizard tower (gx:-7, gy:-10)
    this._placeCharacter('archer-character', tileCenter(6,  -10, 3));
    this._placeCharacter('wizard-character', tileCenter(-7, -10, 3));
    this._placeCharacter('archer-character', tileCenter(6,   10, 3));
    this._placeCharacter('archer-character', tileCenter(-13, -5, 3));
    this._placeCharacter('archer-character', tileCenter(-13,  5, 3));
    this._placeCharacter('wizard-character', tileCenter(-7,  10, 3));
  }

  _placeWallSegment(pos) {
    const { tileWidth, tileHeight } = this.gridInfo;
    const wall = this.add.image(pos.x, pos.y, 'wall');
    const sc   = Math.min(tileWidth, tileHeight) / wall.width * 1.4;
    wall.setScale(sc);
    wall.setOrigin(0.5, 0.5);
    wall.setDepth(pos.y - 1);
    wall.setAlpha(0.9);
  }

  _placePathSegment(pos) {
    const { tileWidth, tileHeight } = this.gridInfo;
    const path = this.add.image(pos.x, pos.y, 'stonepath');
    // Fit to a 1×1 tile footprint, same logic as buildings
    const sc   = Math.max(tileWidth / path.width, tileHeight / path.height) * 1.0;
    path.setScale(sc);
    path.setOrigin(0.5, 0.5);
    path.setDepth(pos.y - 2);  // below walls and buildings
    path.setAlpha(0.95);
  }

  /**
   * Place a character sprite standing on top of a tower.
   * towerPos is the world-space center of the tower (from tileCenter).
   * The character is scaled to ~1.5 tiles tall and anchored at its feet
   * so it sits naturally on the tower top.
   */
  _placeCharacter(textureKey, towerPos) {
    const { tileHeight } = this.gridInfo;
    const spr = this.add.image(towerPos.x, towerPos.y, textureKey);

    // Scale so character height ≈ 1.5 tile heights — visible but not huge
    const sc = (tileHeight * 1.5) / spr.height;
    spr.setScale(sc);

    // Anchor at feet (origin bottom-center) then shift up to sit on tower top
    spr.setOrigin(0.5, 1.0);
    spr.setY(towerPos.y - tileHeight * 0.6);

    // Depth just above the tower so character renders in front
    spr.setDepth(towerPos.y + 1);
  }

  /**
   * Gentle idle pulse for interactive buildings.
   * Scale breathes between base and base×1.05 + warm gold tint pulses in sync.
   * Paused when pointerover fires (hover tween takes over),
   * resumed on pointerout so it doesn't fight the hover scale.
   */
  _startPulseAnim(spr, baseScale) {
    const duration = 950;

    // Scale tween
    const scaleTween = this.tweens.add({
      targets:  spr,
      scaleX:   baseScale * 1.05,
      scaleY:   baseScale * 1.05,
      duration,
      ease:     'Sine.easeInOut',
      yoyo:     true,
      repeat:   -1,
    });

    // Tint tween — cycles between no tint (0xffffff) and warm gold (0xffe87a)
    const tintProxy = { t: 0 };
    const tintTween = this.tweens.add({
      targets:  tintProxy,
      t:        1,
      duration,
      ease:     'Sine.easeInOut',
      yoyo:     true,
      repeat:   -1,
      onUpdate: () => {
        const r = Math.round(Phaser.Math.Linear(0xff, 0xff, tintProxy.t));
        const g = Math.round(Phaser.Math.Linear(0xff, 0xe8, tintProxy.t));
        const b = Math.round(Phaser.Math.Linear(0xff, 0x55, tintProxy.t));
        spr.setTint((r << 16) | (g << 8) | b);
      },
    });

    // Pause both while hovered so they don't fight hover effects
    spr.on('pointerover', () => {
      scaleTween.pause();
      tintTween.pause();
    });
    spr.on('pointerout', () => {
      spr.setScale(baseScale);
      spr.clearTint();
      scaleTween.resume();
      tintTween.resume();
    });
  }

  /**
   * Organic sway for trees/trunks.
   * scaleX leans ±5%, scaleY does a subtle counter-movement for realism.
   * Each tree gets a random duration + delay so none are in sync.
   */
  _startSwayAnim(spr, baseScale) {
    const delay    = Math.random() * 3000;
    const duration = 1600 + Math.random() * 800;

    // Horizontal lean
    this.tweens.add({
      targets:  spr,
      scaleX:   baseScale * 0.95,
      duration,
      ease:     'Sine.easeInOut',
      yoyo:     true,
      repeat:   -1,
      delay,
    });

    // Subtle vertical counter — slightly taller when leaning, slightly shorter at centre
    this.tweens.add({
      targets:  spr,
      scaleY:   baseScale * 1.025,
      duration,
      ease:     'Sine.easeInOut',
      yoyo:     true,
      repeat:   -1,
      delay,    // same delay so X and Y stay in phase
    });
  }

  /**
   * Sparkle particles on the gem box.
   * Draws a tiny white circle texture at runtime — no extra asset needed.
   * Particles drift upward, fade out, and loop continuously.
   */
  _startSparkles(spr) {
    // Create a small circle texture programmatically
    const gfx = this.make.graphics({ x: 0, y: 0, add: false });
    gfx.fillStyle(0xffffff, 1);
    gfx.fillCircle(4, 4, 4);
    gfx.generateTexture('sparkle-dot', 8, 8);
    gfx.destroy();

    // Colour tints: white, cyan, gold, light-green — gem colours
    const tints = [0x4488ff, 0xff4444, 0x00ffff];

    this.add.particles(spr.x, spr.y, 'sparkle-dot', {
      // Spread around the gem box footprint
      x:          { min: -spr.displayWidth  * 0.35, max: spr.displayWidth  * 0.35 },
      y:          { min: -spr.displayHeight * 0.35, max: spr.displayHeight * 0.05 },
      lifespan:   { min: 600, max: 1100 },
      speed:      { min: 8,   max: 22  },
      angle:      { min: 250, max: 290 },   // mostly upward
      scale:      { start: 0.55, end: 0 },  // shrink to nothing as they fade
      alpha:      { start: 0.9,  end: 0 },
      tint:       tints,
      frequency:  120,   // emit one particle every 120ms
      depth:      spr.depth + 1,
      blendMode:  Phaser.BlendModes.ADD,    // additive = bright glowy look
    });
  }

  setupCameraControls() {
    if (!this._isMobile) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd    = this.input.keyboard.addKeys({
        up:    Phaser.Input.Keyboard.KeyCodes.W,
        down:  Phaser.Input.Keyboard.KeyCodes.S,
        left:  Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
      });
    }

    let isDragging = false;
    let hasMoved   = false;
    let dragStartX = 0;
    let dragStartY = 0;
    const TAP_THRESH = 12;

    this.input.on('pointerdown', (pointer) => {
      if (pointer.id > 1) return;
      isDragging = true;
      hasMoved   = false;
      dragStartX = pointer.x;
      dragStartY = pointer.y;
    });

    this.input.on('pointermove', (pointer) => {
      if (!isDragging || pointer.id > 1) return;
      const dx = pointer.x - dragStartX;
      const dy = pointer.y - dragStartY;
      if (!hasMoved && (Math.abs(dx) > TAP_THRESH || Math.abs(dy) > TAP_THRESH)) {
        hasMoved = true;
      }
      if (!hasMoved) return;
      const zoom = this.cameras.main.zoom;
      this.cameras.main.scrollX -= dx / zoom;
      this.cameras.main.scrollY -= dy / zoom;
      dragStartX = pointer.x;
      dragStartY = pointer.y;
    });

    this.input.on('pointerup',     (pointer) => { if (pointer.id <= 1) isDragging = false; });
    this.input.on('pointercancel', ()        => { isDragging = false; hasMoved = false; });

    this.input.on('wheel', (_pointer, _objects, _dx, deltaY) => {
      const newZoom = Phaser.Math.Clamp(
        this.cameras.main.zoom + (deltaY > 0 ? -0.1 : 0.1),
        this._minZoom ?? 1.0, 2.5
      );
      this.cameras.main.setZoom(newZoom);
    });

    this._getHasMoved = () => hasMoved;
  }

  onBuildingClick(building) {
    if (this._modalOpen) return;
    const currentScale = building.scaleX;
    this.tweens.add({
      targets:  building,
      scaleX:   currentScale * 1.15,
      scaleY:   currentScale * 1.15,
      duration: 100,
      yoyo:     true,
      ease:     'Power2',
      onComplete: () => {
        this.game.events.emit('buildingClicked', building.getData('modalKey'));
      },
    });
  }

  update() {
    if (this._isMobile || !this.cursors) return;
    const cam   = this.cameras.main;
    const speed = 12 / cam.zoom;
    if (this.cursors.left.isDown  || this.wasd.left.isDown)  cam.scrollX -= speed;
    else if (this.cursors.right.isDown || this.wasd.right.isDown) cam.scrollX += speed;
    if (this.cursors.up.isDown    || this.wasd.up.isDown)    cam.scrollY -= speed;
    else if (this.cursors.down.isDown  || this.wasd.down.isDown)  cam.scrollY += speed;
  }
}
