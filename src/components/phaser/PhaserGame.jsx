import { useEffect, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import Phaser from 'phaser';
import VillageScene from '../../scenes/VillageScene';

// Background image native dimensions
const BG_W = 1200;
const BG_H = 824;

function PhaserGame({ onBuildingClick, modalOpen }) {
  const gameRef      = useRef(null);
  const containerRef = useRef(null);
  // Store handler in ref so the Phaser init effect never needs to re-run on prop change
  const onClickRef   = useRef(onBuildingClick);
  useEffect(() => { onClickRef.current = onBuildingClick; }, [onBuildingClick]);

  // ── Initialize Phaser once ──────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return;

    const w = window.innerWidth;
    const h = Math.round(w * BG_H / BG_W);
    containerRef.current.style.height = `${h}px`;

    gameRef.current = new Phaser.Game({
      type:            Phaser.AUTO,
      parent:          containerRef.current,
      backgroundColor: '#92C463',
      scene:           [VillageScene],
      scale: {
        mode:   Phaser.Scale.NONE,
        width:  w,
        height: h,
      },
    });

    // Route Phaser events to the latest prop via ref — no effect re-run needed
    gameRef.current.events.on('buildingClicked', (buildingType) => {
      onClickRef.current?.(buildingType);
    });

    let resizeTimer = null;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!gameRef.current || !containerRef.current) return;
        const nw = window.innerWidth;
        const nh = Math.round(nw * BG_H / BG_W);
        containerRef.current.style.height = `${nh}px`;
        gameRef.current.scale.resize(nw, nh);
        gameRef.current.events.emit('canvasResized', nw, nh);
      }, 150);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []); // no deps — safe because handler is accessed via ref

  // ── Pause / resume Phaser input when a modal opens / closes ────────
  useEffect(() => {
    gameRef.current?.events.emit('setModalOpen', modalOpen);
  }, [modalOpen]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%' }}
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
