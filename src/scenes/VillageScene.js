import Phaser from 'phaser';

export default class VillageScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VillageScene' });
    this.buildings = [];
    // CoC specifications from official sources
    this.TILE_SIZE = 32; // Each tile in pixels
    this.VILLAGE_TILES = 44; // 44x44 playable village
    this.BORDER_TILES = 3; // 3-tile grass border
  }

  preload() {
    // Load actual CoC background image
    this.load.image('background', 'assets/environment/background.png');
    
    // Load building sprites
    this.load.image('townhall', 'assets/buildings/town-hall.png');
    this.load.image('barracks', 'assets/buildings/barracks.png');
    this.load.image('builderhut', 'assets/buildings/builder-hut.png');
    this.load.image('laboratory', 'assets/buildings/laboratory.png');
    this.load.image('goldmine', 'assets/buildings/gold-mine.png');
    this.load.image('elixir', 'assets/buildings/elixir-collector.png');
    this.load.image('cannon', 'assets/buildings/cannon.png');
    this.load.image('archertower', 'assets/buildings/archer-tower.png');
    this.load.image('armycamp', 'assets/buildings/army-camp.png');
    this.load.image('wall', 'assets/buildings/wall-segment.png');
  }

  create() {
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
    
    console.log('Grid calibration:', {
      center: gridCenter,
      gridWidthPx,
      gridHeightPx,
      isometricTileWidth,
      isometricTileHeight,
      backgroundSize: { width: bgWidth, height: bgHeight }
    });
    
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
    
    // Set zoom level
    this.cameras.main.setZoom(1.2);
  }

  createGrassBackgroundWithGrid(worldWidth, worldHeight) {
    // Not needed anymore - using actual CoC background image
  }

  createGrassBorder(worldWidth, worldHeight) {
    // Not needed anymore - border is in the background image
  }

  placeBuildings() {
    // Use the calibrated grid info
    const { center, tileWidth, tileHeight } = this.gridInfo;
    
    // Helper function to convert grid coordinates to isometric screen position
    const gridToIso = (gridX, gridY) => {
      // Isometric conversion: 
      // screenX = (gridX - gridY) * (tileWidth / 2)
      // screenY = (gridX + gridY) * (tileHeight / 2)
      return {
        x: center.x + (gridX - gridY) * (tileWidth / 2),
        y: center.y + (gridX + gridY) * (tileHeight / 2)
      };
    };
    
    // Building layout with ACTUAL CoC tile sizes
    // Grid coordinates are relative to center (0,0)
    const buildings = [
      // Interactive buildings (main navigation)
      { 
        type: 'townhall', 
        gridX: 0, 
        gridY: 0, 
        tileWidth: 4, // Town Hall is 4x4 tiles
        tileHeight: 4,
        scale: 1.4, // Custom scale multiplier
        name: 'Town Hall', 
        interactive: true 
      },
      { 
        type: 'barracks', 
        gridX: -8, 
        gridY: 2, 
        tileWidth: 3, // Barracks is 3x3 tiles
        tileHeight: 3,
        scale: 1.8, // Increased size for Barracks
        name: 'Barracks', 
        interactive: true 
      },
      { 
        type: 'builderhut', 
        gridX: 8, 
        gridY: 2, 
        tileWidth: 2, // Builder's Hut is 2x2 tiles
        tileHeight: 2,
        scale: 1.4,
        name: "Builder's Hut", 
        interactive: true 
      },
      { 
        type: 'laboratory', 
        gridX: -8, 
        gridY: -5, 
        tileWidth: 3, // Laboratory is 3x3 tiles
        tileHeight: 3,
        scale: 1.4,
        name: 'Laboratory', 
        interactive: true 
      },
      
      // Decorative resource buildings (3x3 tiles each)
      { 
        type: 'goldmine', 
        gridX: 10, 
        gridY: -3, 
        tileWidth: 3,
        tileHeight: 3,
        scale: 1.4,
        name: 'Gold Mine', 
        interactive: false 
      },
      { 
        type: 'goldmine', 
        gridX: 10, 
        gridY: 5, 
        tileWidth: 3,
        tileHeight: 3,
        scale: 1.4,
        name: 'Gold Mine', 
        interactive: false 
      },
      { 
        type: 'elixir', 
        gridX: -11, 
        gridY: -3, 
        tileWidth: 3,
        tileHeight: 3,
        scale: 1.4,
        name: 'Elixir Collector', 
        interactive: false 
      },
      { 
        type: 'elixir', 
        gridX: -11, 
        gridY: 5, 
        tileWidth: 3,
        tileHeight: 3,
        scale: 1.4,
        name: 'Elixir Collector', 
        interactive: false 
      },
      
      // Defensive buildings (3x3 tiles each)
      { 
        type: 'cannon', 
        gridX: -4, 
        gridY: -10, 
        tileWidth: 3,
        tileHeight: 3,
        scale: 1.4,
        name: 'Cannon', 
        interactive: false 
      },
      { 
        type: 'cannon', 
        gridX: 4, 
        gridY: -10, 
        tileWidth: 3,
        tileHeight: 3,
        scale: 1.4,
        name: 'Cannon', 
        interactive: false 
      },
      { 
        type: 'archertower', 
        gridX: -4, 
        gridY: 11, 
        tileWidth: 3,
        tileHeight: 3,
        scale: 1.4,
        name: 'Archer Tower', 
        interactive: false 
      },
      { 
        type: 'archertower', 
        gridX: 4, 
        gridY: 11, 
        tileWidth: 3,
        tileHeight: 3,
        scale: 1.4,
        name: 'Archer Tower', 
        interactive: false 
      },
      { 
        type: 'armycamp', 
        gridX: 0, 
        gridY: 12, 
        tileWidth: 5,
        tileHeight: 5,
        scale: 1.0, // Reduced size for Army Camp
        name: 'Army Camp', 
        interactive: false 
      },
    ];
    
    buildings.forEach((data) => {
      // Convert grid position to isometric screen position
      const pos = gridToIso(data.gridX, data.gridY);
      
      const building = this.add.image(pos.x, pos.y, data.type);
      
      // In isometric view, the visual size needs to account for both width and height
      // A 3x3 building should span 3 tiles diagonally in both directions
      // Target size in pixels for the building
      const targetWidthPx = data.tileWidth * tileWidth * data.scale; // Use individual scale
      const targetHeightPx = data.tileHeight * tileHeight * data.scale;
      
      // Scale sprite to fit tile dimensions
      const scaleX = targetWidthPx / building.width;
      const scaleY = targetHeightPx / building.height;
      const scale = Math.min(scaleX, scaleY);
      
      building.setScale(scale);
      building.setOrigin(0.5, 0.75); // Bottom-center for depth effect (adjusted anchor)
      building.setDepth(pos.y); // Depth based on Y position
      
      // Store building data
      building.setData('buildingType', data.type);
      building.setData('buildingName', data.name);
      building.setData('interactive', data.interactive);
      building.setData('gridPos', { x: data.gridX, y: data.gridY });
      building.setData('baseScale', scale);
      building.setData('tileSize', { width: data.tileWidth, height: data.tileHeight });
      
      if (data.interactive) {
        building.setInteractive({ useHandCursor: true });
        
        // Hover effects (CoC style)
        building.on('pointerover', () => {
          building.setTint(0xFFFFAA);
          this.tweens.add({
            targets: building,
            scaleX: scale * 1.1,
            scaleY: scale * 1.1,
            duration: 150,
            ease: 'Power2'
          });
        });
        
        building.on('pointerout', () => {
          building.clearTint();
          this.tweens.add({
            targets: building,
            scaleX: scale,
            scaleY: scale,
            duration: 150,
            ease: 'Power2'
          });
        });
        
        building.on('pointerdown', () => {
          this.onBuildingClick(building);
        });
      }
      
      this.buildings.push(building);
    });
    
    // Place walls (1x1 tiles each)
    this.placeWalls(gridToIso);
  }

  placeWalls(gridToIso) {
    // Wall positions around village perimeter (1x1 tiles)
    const wallPositions = [];
    
    // Top wall (diagonal line)
    for (let i = -12; i <= 12; i++) {
      wallPositions.push({ x: i, y: -14 });
    }
    
    // Bottom wall (diagonal line)
    for (let i = -12; i <= 12; i++) {
      wallPositions.push({ x: i, y: 15 });
    }
    
    // Left wall (diagonal line)
    for (let i = -13; i <= 14; i++) {
      wallPositions.push({ x: -14, y: i });
    }
    
    // Right wall (diagonal line)
    for (let i = -13; i <= 14; i++) {
      wallPositions.push({ x: 14, y: i });
    }
    
    const { tileWidth, tileHeight } = this.gridInfo;
    
    wallPositions.forEach(gridPos => {
      const pos = gridToIso(gridPos.x, gridPos.y);
      
      const wall = this.add.image(pos.x, pos.y, 'wall');
      
      // Scale wall to 1 tile size (increased multiplier)
      const scale = Math.min(tileWidth, tileHeight) / wall.width * 1.4; // Increased from 0.7 to 1.4
      wall.setScale(scale);
      wall.setOrigin(0.5, 0.7);
      wall.setDepth(pos.y);
      wall.setAlpha(0.9);
    });
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
    this.input.on('wheel', (pointer, gameObjects, deltaX, deltaY, deltaZ) => {
      const zoomAmount = deltaY > 0 ? -0.1 : 0.1;
      const newZoom = Phaser.Math.Clamp(
        this.cameras.main.zoom + zoomAmount,
        0.8,  // Min zoom
        2.5   // Max zoom
      );
      
      this.cameras.main.setZoom(newZoom);
    });
  }

  onBuildingClick(building) {
    const buildingType = building.getData('buildingType');
    const buildingName = building.getData('buildingName');
    const tileSize = building.getData('tileSize');
    
    console.log(`Clicked: ${buildingName} (${buildingType}) - ${tileSize.width}x${tileSize.height} tiles`);
    
    // Get current scale for animation
    const currentScale = building.scaleX;
    
    // Bounce animation
    this.tweens.add({
      targets: building,
      scaleX: currentScale * 1.15,
      scaleY: currentScale * 1.15,
      duration: 100,
      yoyo: true,
      ease: 'Power2',
      onComplete: () => {
        // Emit event to React (Phase 4)
        this.game.events.emit('buildingClicked', buildingType);
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
