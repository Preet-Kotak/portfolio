import Phaser from 'phaser';
import buildings from '../data/buildings';
import walls     from '../data/walls';

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
    this.load.image('wizardtower',   'assets/buildings/wizard-tower.png');
    this.load.image('lootcart',      'assets/buildings/loot-cart.png');
  }

  create() {
    this._modalOpen  = false;
    this._isMobile   = window.innerWidth < 1024;

    // Read CSS (logical) dimensions stored by PhaserGame.jsx.
    // this.scale.width is now the physical pixel size (= cssW * dpr),
    // so we use registry values for all layout work to stay in CSS-pixel space.
    this._dpr = this.game.registry.get('dpr') ?? 1;
    const cssW = this.game.registry.get('cssWidth')  ?? this.scale.width  / this._dpr;
    const cssH = this.game.registry.get('cssHeight') ?? this.scale.height / this._dpr;

    this.game.events.on('setModalOpen', (isOpen) => {
      this._modalOpen = isOpen;
      this.input.keyboard.enabled = !isOpen;
      this.input.enabled          = !isOpen;
    });

    this.game.events.on('canvasResized', (nCssW, nCssH) => {
      this._isMobile = window.innerWidth < 1024;
      this._minZoom  = this._isMobile ? 0.9 : 1.0;
      if (this.cameras.main.zoom < this._minZoom) {
        this.cameras.main.setZoom(this._minZoom + 0.0001);
      }
      this._rebuildGrid(nCssW, nCssH);
      const { corners } = this.gridInfo;
      const fx = (corners.left.x + corners.right.x) / 2;
      const fy = corners.top.y + (corners.bottom.y - corners.top.y) * 0.68;
      this.cameras.main.setBounds(0, 0, nCssW * this._dpr, nCssH * this._dpr);
      this.cameras.main.centerOn(fx, fy);
    });

    // Background — scaled to fill canvas width exactly
    this._bg = this.add.image(0, 0, 'background');
    this._bg.setName('bg');
    this._bg.setOrigin(0, 0);
    this._bg.setDepth(-1000);

    // Build grid using CSS dimensions (layout coordinates)
    this._rebuildGrid(cssW, cssH);

    // Camera bounds in physical pixels (Phaser world space)
    this.cameras.main.setBounds(0, 0, cssW * this._dpr, cssH * this._dpr);

    this.placeBuildings();
    this.setupCameraControls();

    // Initial view: zoomed in with buildings in focus (focal point 68% down the grid)
    this._minZoom = this._isMobile ? 0.9 : 1.0;
    this.cameras.main.setZoom(this._isMobile ? 1.0999 : 1.3999);
    const { corners } = this.gridInfo;
    const focalY = corners.top.y + (corners.bottom.y - corners.top.y) * 0.68;
    this.cameras.main.centerOn(this.gridInfo.center.x, focalY);
  }

  _rebuildGrid(cssW, cssH) {
    const dpr = this._dpr;
    // All world coordinates are in physical pixels (Phaser's coordinate space).
    // We scale the CSS-pixel corner values by dpr to land in world space.
    const ORIGINAL_BG_W = 1200;
    const physW = cssW * dpr;

    // Background scale: fit physical canvas width
    if (this._bg) {
      const bgScale = physW / this._bg.width;
      this._bg.setScale(bgScale);
    }

    // scaleX maps the 1200px-calibrated grid corners → physical pixels
    const s = physW / ORIGINAL_BG_W;

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

    const gridWidthPx  = gridCorners.right.x - gridCorners.left.x;
    const gridHeightPx = gridCorners.bottom.y - gridCorners.top.y;

    this.gridInfo = {
      center:     gridCenter,
      tileWidth:  gridWidthPx  / 44,
      tileHeight: gridHeightPx / 44,
      corners:    gridCorners,
    };
  }

  placeBuildings() {
    const { center, tileWidth, tileHeight } = this.gridInfo;

    // Convert top-left tile corner + footprint size → isometric screen center
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
        spr.on('pointerdown', () => this.onBuildingClick(spr));
      }

      this.buildings.push(spr);
    });

    // Place walls from data/walls.js
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

  setupCameraControls() {
    // Keyboard controls — desktop only (saves event overhead on mobile)
    if (!this._isMobile) {
      this.cursors = this.input.keyboard.createCursorKeys();
      this.wasd    = this.input.keyboard.addKeys({
        up:    Phaser.Input.Keyboard.KeyCodes.W,
        down:  Phaser.Input.Keyboard.KeyCodes.S,
        left:  Phaser.Input.Keyboard.KeyCodes.A,
        right: Phaser.Input.Keyboard.KeyCodes.D,
      });
    }

    let isDragging  = false;
    let dragStartX  = 0;
    let dragStartY  = 0;
    const DEAD_ZONE = 2;

    this.input.on('pointerdown', (pointer) => {
      // For touch: only track first finger (id 1). For mouse: id is 0, always allow.
      if (pointer.id > 1) return;
      isDragging = true;
      dragStartX = pointer.x;
      dragStartY = pointer.y;
    });

    this.input.on('pointermove', (pointer) => {
      if (!isDragging || pointer.id > 1) return;
      const dx = pointer.x - dragStartX;
      const dy = pointer.y - dragStartY;
      if (Math.abs(dx) < DEAD_ZONE && Math.abs(dy) < DEAD_ZONE) return;
      const zoom = this.cameras.main.zoom;
      this.cameras.main.scrollX -= dx / zoom;
      this.cameras.main.scrollY -= dy / zoom;
      dragStartX = pointer.x;
      dragStartY = pointer.y;
    });

    this.input.on('pointerup', (pointer) => {
      if (pointer.id <= 1) isDragging = false;
    });

    this.input.on('pointercancel', () => { isDragging = false; });

    // Mouse wheel zoom — desktop
    this.input.on('wheel', (_pointer, _objects, _dx, deltaY) => {
      const newZoom = Phaser.Math.Clamp(
        this.cameras.main.zoom + (deltaY > 0 ? -0.1 : 0.1),
        this._minZoom,
        2.5
      );
      this.cameras.main.setZoom(newZoom);
    });
  }

  onBuildingClick(building) {
    // Guard: ignore clicks while a modal is open
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
    // Keyboard pan — desktop only
    if (this._isMobile || !this.cursors) return;

    const cam   = this.cameras.main;
    const speed = 12 / cam.zoom;

    if (this.cursors.left.isDown  || this.wasd.left.isDown)  cam.scrollX -= speed;
    else if (this.cursors.right.isDown || this.wasd.right.isDown) cam.scrollX += speed;

    if (this.cursors.up.isDown    || this.wasd.up.isDown)    cam.scrollY -= speed;
    else if (this.cursors.down.isDown  || this.wasd.down.isDown)  cam.scrollY += speed;
  }
}
