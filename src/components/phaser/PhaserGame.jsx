import { useEffect, useRef } from 'react';
import Phaser from 'phaser';
import VillageScene from '../../scenes/VillageScene';

function PhaserGame() {
  const gameRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // CoC-style full-screen configuration
    const config = {
      type: Phaser.AUTO,
      parent: containerRef.current,
      backgroundColor: '#92C463', // CoC grass green
      scene: [VillageScene],
      scale: {
        mode: Phaser.Scale.RESIZE, // Full responsive like CoC
        autoCenter: Phaser.Scale.CENTER_BOTH,
        width: window.innerWidth,
        height: window.innerHeight
      },
      physics: {
        default: 'arcade',
        arcade: {
          debug: false
        }
      }
    };

    // Initialize Phaser game instance
    gameRef.current = new Phaser.Game(config);

    // Handle window resize (like CoC)
    const handleResize = () => {
      if (gameRef.current) {
        gameRef.current.scale.resize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', handleResize);
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="w-full h-full"
      style={{ 
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0
      }}
    />
  );
}

export default PhaserGame;
