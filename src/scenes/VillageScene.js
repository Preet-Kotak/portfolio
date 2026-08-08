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
    this._modalOpen = false;

    this.game.events.on('setModalOpen', (isOpen) => {
      this._modalOpen = isOpen;
      this.input.keyboard.enabled = !isOpen;
      this.input.enabled          = !isOpen;
    });

    this.game.events.on('canvasResized', () => {
      this._minZoom = 1.0;
      if (this.cameras.main.zoom < this._minZoom) {
        this.cameras.main.setZoom(this._minZoom);
      }
      const { corners } = this.gridInfo;
      const fx = (corners.left.x + corners.right.x) / 2;
      const fy = corners.top.y + (corners.bottom.y - corners.top.y) * 0.68;
      this.cameras.main.centerOn(fx, fy);
    });

    // Background — scaled to fill canvas width exactly
    const background = this.add.image(0, 0, 'background');
    background.setOrigin(0, 0);

    const canvasW = this.scale.width;
    const canvasH = this.scale.height;
    const scaleX  = canvasW / background.width;
    background.setScale(scaleX);
    background.setDepth(-1000);

    // Camera bounds = full canvas (browser handles vertical scroll)
    this.cameras.main.setBounds(0, 0, canvasW, canvasH);

    // Grid corners calibrated for 1200px-wide image, scaled to actual canvas
    const s = scaleX;
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

    this.placeBuildings();
    this.setupCameraControls();

    // Initial view: zoomed in with buildings in focus (focal point 68% down the grid)
    this._minZoom = 1.0;
    this.cameras.main.setZoom(1.4);
    const focalY = gridCorners.top.y + (gridCorners.bottom.y - gridCorners.top.y) * 0.68;
    this.cameras.main.centerOn(gridCenter.x, focalY);
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
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd    = this.input.keyboard.addKeys({
      up:    Phaser.Input.Keyboard.KeyCodes.W,
      down:  Phaser.Input.Keyboard.KeyCodes.S,
      left:  Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D,
    });

    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;

    this.input.on('pointerdown', (pointer) => {
      isDragging = true;
      dragStartX = pointer.x;
      dragStartY = pointer.y;
    });

    this.input.on('pointermove', (pointer) => {
      if (!isDragging) return;
      const zoom = this.cameras.main.zoom;
      this.cameras.main.scrollX -= (pointer.x - dragStartX) / zoom;
      this.cameras.main.scrollY -= (pointer.y - dragStartY) / zoom;
      dragStartX = pointer.x;
      dragStartY = pointer.y;
    });

    this.input.on('pointerup', () => { isDragging = false; });

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
    const cam   = this.cameras.main;
    const speed = 12 / cam.zoom;

    if (this.cursors.left.isDown  || this.wasd.left.isDown)  cam.scrollX -= speed;
    else if (this.cursors.right.isDown || this.wasd.right.isDown) cam.scrollX += speed;

    if (this.cursors.up.isDown    || this.wasd.up.isDown)    cam.scrollY -= speed;
    else if (this.cursors.down.isDown  || this.wasd.down.isDown)  cam.scrollY += speed;
  }
}
