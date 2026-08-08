import { useEffect, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import Phaser from 'phaser';
import VillageScene from '../../scenes/VillageScene';

function PhaserGame({ onBuildingClick, modalOpen }) {
  const gameRef      = useRef(null);
  const containerRef = useRef(null);

  // ── Initialize Phaser once ─────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    const config = {
      type:   Phaser.AUTO,
      parent: containerRef.current,
      backgroundColor: '#92C463',
      scene:  [VillageScene],
      scale: {
        mode:   Phaser.Scale.NONE,
        width:  window.innerWidth,
        height: window.innerHeight,
      },
    };

    gameRef.current = new Phaser.Game(config);

    const handleBuildingClick = (buildingType) => {
      if (onBuildingClick) onBuildingClick(buildingType);
    };
    gameRef.current.events.on('buildingClicked', handleBuildingClick);

    // Debounced resize — only fires when browser window actually resizes
    let lastW = window.innerWidth;
    let lastH = window.innerHeight;
    let resizeTimer = null;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        if (gameRef.current && (w !== lastW || h !== lastH)) {
          lastW = w; lastH = h;
          gameRef.current.scale.resize(w, h);
        }
      }, 150);
    };
    window.addEventListener('resize', handleResize);

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

  // ── Pause / resume Phaser input when a modal opens / closes ───────
  useEffect(() => {
    if (!gameRef.current) return;
    // Emit to the scene so it can toggle its input manager
    gameRef.current.events.emit('setModalOpen', modalOpen);
  }, [modalOpen]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full"
      style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
    />
  );
}

PhaserGame.propTypes = {
  onBuildingClick: PropTypes.func,
  modalOpen:       PropTypes.bool,
};

PhaserGame.defaultProps = {
  modalOpen: false,
};

export default memo(PhaserGame);
