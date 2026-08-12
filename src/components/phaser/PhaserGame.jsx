import { useEffect, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import Phaser from 'phaser';
import VillageScene from '../../scenes/VillageScene';

const BG_W = 1200;
const BG_H = 824;

function getViewportWidth() {
  return document.documentElement.clientWidth || window.innerWidth;
}

function PhaserGame({ onBuildingClick, modalOpen }) {
  const gameRef      = useRef(null);
  const containerRef = useRef(null);
  const onClickRef   = useRef(onBuildingClick);
  useEffect(() => { onClickRef.current = onBuildingClick; }, [onBuildingClick]);

  useEffect(() => {
    if (!containerRef.current) return;

    const w = getViewportWidth();
    const h = Math.round(w * BG_H / BG_W);
    containerRef.current.style.height = `${h}px`;

    gameRef.current = new Phaser.Game({
      type:            Phaser.AUTO,
      parent:          containerRef.current,
      backgroundColor: '#92C463',
      scene:           [VillageScene],
      scale: {
        mode:       Phaser.Scale.NONE,
        width:      w,
        height:     h,
        autoCenter: Phaser.Scale.NO_CENTER,
      },
      input: {
        touch: { capture: false },
      },
      render: {
        antialias:       true,
        roundPixels:     false,
        powerPreference: 'low-power',
        resolution:      Math.min(window.devicePixelRatio || 1, 2),
      },
      fps: {
        target:     60,
        smoothStep: true,
      },
    });

    gameRef.current.events.on('buildingClicked', (buildingType) => {
      onClickRef.current?.(buildingType);
    });

    let resizeTimer = null;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!gameRef.current || !containerRef.current) return;
        const nw = getViewportWidth();
        const nh = Math.round(nw * BG_H / BG_W);
        containerRef.current.style.height = `${nh}px`;
        gameRef.current.scale.resize(nw, nh);
        gameRef.current.events.emit('canvasResized', nw, nh);
      }, 150);
    };
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  useEffect(() => {
    gameRef.current?.events.emit('setModalOpen', modalOpen);
  }, [modalOpen]);

  return (
    <div
      ref={containerRef}
      style={{ position: 'relative', width: '100%', overflow: 'hidden' }}
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
