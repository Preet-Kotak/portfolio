import Phaser from 'phaser';

export default class VillageScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VillageScene' });
  }

  preload() {
    // Load test image - we'll use Phaser's built-in logo for now
    // Later this will be replaced with actual CoC-style sprites
    this.load.setBaseURL('https://labs.phaser.io');
    this.load.image('logo', 'assets/sprites/phaser3-logo.png');
  }

  create() {
    // Display test image in center of scene
    const logo = this.add.image(400, 300, 'logo');
    
    // Add a simple text label
    this.add.text(400, 500, 'Village Scene Loaded', {
      fontSize: '24px',
      color: '#F5A623'
    }).setOrigin(0.5);

    // Set up camera bounds for village world size (2000x1500)
    this.cameras.main.setBounds(0, 0, 2000, 1500);
    
    // Center camera on the logo initially
    this.cameras.main.centerOn(400, 300);
  }

  update() {
    // Game loop - will be used for animations later
  }
}
