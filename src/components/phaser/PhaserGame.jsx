import { useEffect, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import Phaser from 'phaser';
import VillageScene from '../../scenes/VillageScene';

function PhaserGame({ onBuildingClick }) {
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
        mode: Phaser.Scale.NONE, // Don't auto-resize — prevents zoom reset when modal opens
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

    // Subscribe to building click events from Phaser
    const handleBuildingClick = (buildingType) => {
      console.log('Building clicked in Phaser:', buildingType);
      
      // Pass event to parent component if callback provided
      if (onBuildingClick) {
        onBuildingClick(buildingType);
      }
    };

    gameRef.current.events.on('buildingClicked', handleBuildingClick);

    // Handle true window resize (browser window dragged) — debounced to avoid
    // modal-triggered layout shifts firing this. Only fires when dimensions actually change.
    let lastW = window.innerWidth;
    let lastH = window.innerHeight;
    let resizeTimer = null;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        if (gameRef.current && (w !== lastW || h !== lastH)) {
          lastW = w;
          lastH = h;
          gameRef.current.scale.resize(w, h);
        }
      }, 150);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup on unmount
    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      if (gameRef.current) {
        gameRef.current.events.off('buildingClicked', handleBuildingClick);
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [onBuildingClick]);

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

PhaserGame.propTypes = {
  onBuildingClick: PropTypes.func
};

export default memo(PhaserGame);
