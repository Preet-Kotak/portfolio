import Phaser from 'phaser';
import buildings from '../data/buildings';

export default class VillageScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VillageScene' });
    this.buildings = [];
  }

  preload() {
    // Load actual CoC background image
    this.load.image('background', 'assets/environment/background.png');
    
    // Load building sprites
    this.load.image('townhall',     'assets/buildings/town-hall.png');
    this.load.image('barracks',     'assets/buildings/barracks.png');
    this.load.image('builderhut',   'assets/buildings/builder-hut.png');
    this.load.image('laboratory',   'assets/buildings/laboratory.png');
    this.load.image('goldmine',     'assets/buildings/gold-mine.png');
    this.load.image('elixir',       'assets/buildings/elixir-collector.png');
    this.load.image('cannon',       'assets/buildings/cannon.png');
    this.load.image('archertower',  'assets/buildings/archer-tower.png');
    this.load.image('armycamp',     'assets/buildings/army-camp.png');
    this.load.image('wall',         'assets/buildings/wall-segment.png');
    this.load.image('clancastle',   'assets/buildings/clan-castle.png');
    this.load.image('airdefense',   'assets/buildings/air-defense.png');
    this.load.image('elixirstorage','assets/buildings/elixir-storage.png');
    this.load.image('goldstorage',  'assets/buildings/gold-storage.png');
    this.load.image('mortar',       'assets/buildings/mortar.png');
    this.load.image('wizardtower',  'assets/buildings/wizard-tower.png');
    this.load.image('lootcart',     'assets/buildings/loot-cart.png');
  }

  create() {
    // Track whether a modal is open — disables Phaser input while true
    this._modalOpen = false;
    this.game.events.on('setModalOpen', (isOpen) => {
      this._modalOpen = isOpen;
      // Disable/enable keyboard so arrow keys don't scroll the village
      if (isOpen) {
        this.input.keyboard.enabled = false;
        this.input.enabled          = false;
      } else {
        this.input.keyboard.enabled = true;
        this.input.enabled          = true;
      }
    });
    // Load the actual CoC background image
    const background = this.add.image(0, 0, 'background');
    background.setOrigin(0, 0);
    
    // Get background dimensions
    const bgWidth = background.width;
    const bgHeight = background.height;
    
    // Set world bounds to background size
    this.cameras.main.setBounds(0, 0, bgWidth, bgHeight);
    background.setDepth(-1000);
    
    // Calibrated coordinates of the 44x44 tile grid (isometric diamond)
    // Based on user's calibration: top, right, bottom, left corners
    const gridCorners = {
      top: { x: 613, y: 84 },
      right: { x: 1008, y: 380 },
      bottom: { x: 613, y: 678 },
      left: { x: 220, y: 382 }
    };
    
    // Calculate center of the playable area
    const gridCenter = {
      x: (gridCorners.left.x + gridCorners.right.x) / 2,
      y: (gridCorners.top.y + gridCorners.bottom.y) / 2
    };
    
    // Calculate tile size from the grid dimensions
    // Width (left to right) and height (top to bottom) in pixels
    const gridWidthPx = gridCorners.right.x - gridCorners.left.x;
    const gridHeightPx = gridCorners.bottom.y - gridCorners.top.y;
    
    // For a 44x44 isometric grid, calculate the tile size
    // In isometric view: diagonal width = 44 tiles, diagonal height = 44 tiles
    const isometricTileWidth = gridWidthPx / 44;  // ~17.9px per tile horizontally
    const isometricTileHeight = gridHeightPx / 44; // ~13.5px per tile vertically
    
    // Store grid info for building placement
    this.gridInfo = {
      center: gridCenter,
      tileWidth: isometricTileWidth,
      tileHeight: isometricTileHeight,
      corners: gridCorners
    };
    
    // Place buildings aligned to the actual grid
    this.placeBuildings();
    
    // Set up camera controls
    this.setupCameraControls();
    
    // Center camera on the grid center
    this.cameras.main.centerOn(gridCenter.x, gridCenter.y);
    
    // Set initial zoom level
    this._targetZoom = 1.2;
    this.cameras.main.setZoom(this._targetZoom);
  }

  placeBuildings() {
    const { center, tileWidth, tileHeight } = this.gridInfo;

    // Convert TOP-LEFT tile corner + size to isometric screen CENTER of building
    // In iso: moving +1 in gridX goes right-down, +1 in gridY goes left-down
    // Center of an SxS building placed at (gx,gy) is at (gx + S/2, gy + S/2)
    const tileCenter = (gx, gy, size) => {
      const cx = gx + size / 2;
      const cy = gy + size / 2;
      return {
        x: center.x + (cx - cy) * (tileWidth  / 2),
        y: center.y + (cx + cy) * (tileHeight / 2),
      };
    };

    // Draw iso-diamond footprint as green placeholder
    // Uses same center point and size as a real sprite would render
    const drawPlaceholder = (gx, gy, size, depth) => {
      const tw = tileWidth / 2;
      const th = tileHeight / 2;

      // Compute the 4 iso corners of the SxS footprint
      const corner = (cx, cy) => ({
        x: center.x + (cx - cy) * tw,
        y: center.y + (cx + cy) * th,
      });

      const topPt    = corner(gx,        gy       );
      const rightPt  = corner(gx + size, gy       );
      const bottomPt = corner(gx + size, gy + size);
      const leftPt   = corner(gx,        gy + size);

      const g = this.add.graphics();
      g.fillStyle(0x2ECC40, 0.45);
      g.lineStyle(1.5, 0x27AE60, 0.9);
      g.beginPath();
      g.moveTo(topPt.x,    topPt.y);
      g.lineTo(rightPt.x,  rightPt.y);
      g.lineTo(bottomPt.x, bottomPt.y);
      g.lineTo(leftPt.x,   leftPt.y);
      g.closePath();
      g.fillPath();
      g.strokePath();
      g.setDepth(depth);
    };

    const defs = buildings;

    defs.forEach((d) => {
      const pos   = tileCenter(d.gx, d.gy, d.size);
      const depth = pos.y;

      if (!d.type) {
        // Green placeholder for buildings we don't have sprites for yet
        drawPlaceholder(d.gx, d.gy, d.size, depth);
        return;
      }

      const spr = this.add.image(pos.x, pos.y, d.type);

      // Scale: fit the larger axis so sprite fills footprint, apply per-sprite multiplier
      const fitW  = (d.size * tileWidth)  / spr.width;
      const fitH  = (d.size * tileHeight) / spr.height;
      const scale = Math.max(fitW, fitH) * (d.spriteScale ?? 1.0);

      spr.setScale(scale);
      spr.setOrigin(0.5, 0.5); // center anchor matches tileCenter calculation
      spr.setDepth(depth);
      spr.setData('buildingType', d.type);
      spr.setData('buildingName', d.name);
      spr.setData('interactive',  d.interactive);
      spr.setData('modalKey',     d.modalKey ?? d.type);

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

    // ── WALLS ─────────────────────────────────────────────────────
    // Add wall lines below. Each call draws a straight line of walls.
    // Usage: placeWallRow(gxStart, gxEnd, gy)  — horizontal iso line (constant gy)
    //        placeWallCol(gx, gyStart, gyEnd)   — vertical iso line   (constant gx)

    const placeWallRow = (gxStart, gxEnd, gy) => {
      for (let gx = gxStart; gx <= gxEnd; gx++) {
        const pos  = tileCenter(gx, gy, 1);
        const wall = this.add.image(pos.x, pos.y, 'wall');
        const sc   = Math.min(tileWidth, tileHeight) / wall.width * 1.4;
        wall.setScale(sc);
        wall.setOrigin(0.5, 0.5);
        wall.setDepth(pos.y - 1);
        wall.setAlpha(0.9);
      }
    };

    const placeWallCol = (gx, gyStart, gyEnd) => {
      for (let gy = gyStart; gy <= gyEnd; gy++) {
        const pos  = tileCenter(gx, gy, 1);
        const wall = this.add.image(pos.x, pos.y, 'wall');
        const sc   = Math.min(tileWidth, tileHeight) / wall.width * 1.4;
        wall.setScale(sc);
        wall.setOrigin(0.5, 0.5);
        wall.setDepth(pos.y - 1);
        wall.setAlpha(0.9);
      }
    };

    // ── ADD YOUR WALL LINES HERE ───────────────────────────────────
    // Example — top edge of compartment 1:
    // placeWallRow(-8, 5, -2);
    // Example — left edge of compartment 1:
    // placeWallCol(-8, -2, 3);
    placeWallRow(-11, 5, 4);
    placeWallRow(-11, 5, -1);
    placeWallRow( -8, 5,  9);
    placeWallRow( -8, 5, -6);
    placeWallRow(-10, 1,-11);
    placeWallRow(-10, 1, 13);

    placeWallCol( 3, 0,  3);
    placeWallCol(-11, 0, 3);
    placeWallCol( 5,-6, -2);
    placeWallCol( 5, 5,  9);
    placeWallCol(-8,-6, -2);
    placeWallCol(-8, 5,  9);
    placeWallCol(10,-10, 14);

  }

  setupCameraControls() {
    // Keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.wasd = this.input.keyboard.addKeys({
      up: Phaser.Input.Keyboard.KeyCodes.W,
      down: Phaser.Input.Keyboard.KeyCodes.S,
      left: Phaser.Input.Keyboard.KeyCodes.A,
      right: Phaser.Input.Keyboard.KeyCodes.D
    });
    
    // Mouse/Touch drag
    let isDragging = false;
    let dragStartX = 0;
    let dragStartY = 0;
    
    this.input.on('pointerdown', (pointer) => {
      isDragging = true;
      dragStartX = pointer.x;
      dragStartY = pointer.y;
    });
    
    this.input.on('pointermove', (pointer) => {
      if (isDragging) {
        const deltaX = pointer.x - dragStartX;
        const deltaY = pointer.y - dragStartY;
        
        this.cameras.main.scrollX -= deltaX / this.cameras.main.zoom;
        this.cameras.main.scrollY -= deltaY / this.cameras.main.zoom;
        
        dragStartX = pointer.x;
        dragStartY = pointer.y;
      }
    });
    
    this.input.on('pointerup', () => {
      isDragging = false;
    });
    
    // Mouse wheel zoom
    this.input.on('wheel', (_pointer, _gameObjects, _deltaX, deltaY, _deltaZ) => {
      const zoomAmount = deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Phaser.Math.Clamp(
        this.cameras.main.zoom + zoomAmount,
        0.8,  // Min zoom
        2.5   // Max zoom
      );
      
      this._targetZoom = newZoom;
      this.cameras.main.setZoom(newZoom);
    });
  }

  onBuildingClick(building) {
    const modalKey     = building.getData('modalKey');
    const currentScale = building.scaleX;

    this.tweens.add({
      targets:  building,
      scaleX:   currentScale * 1.15,
      scaleY:   currentScale * 1.15,
      duration: 100,
      yoyo:     true,
      ease:     'Power2',
      onComplete: () => {
        this.game.events.emit('buildingClicked', modalKey);
      }
    });
  }

  update() {
    const cam = this.cameras.main;
    const speed = 12 / cam.zoom;
    
    // Keyboard camera movement
    if (this.cursors.left.isDown || this.wasd.left.isDown) {
      cam.scrollX -= speed;
    } else if (this.cursors.right.isDown || this.wasd.right.isDown) {
      cam.scrollX += speed;
    }
    
    if (this.cursors.up.isDown || this.wasd.up.isDown) {
      cam.scrollY -= speed;
    } else if (this.cursors.down.isDown || this.wasd.down.isDown) {
      cam.scrollY += speed;
    }
  }
}
