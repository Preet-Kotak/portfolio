import { useEffect, useRef, memo } from 'react';
import PropTypes from 'prop-types';
import Phaser from 'phaser';
import VillageScene from '../../scenes/VillageScene';

const BG_W = 1200;
const BG_H = 824;

function getViewportWidth() {
  return document.documentElement.clientWidth || window.innerWidth;
}

function PhaserGame({ onBuildingClick, modalOpen, phaserGameRef }) {
  const gameRef      = useRef(null);
  const containerRef = useRef(null);
  const onClickRef   = useRef(onBuildingClick);
  useEffect(() => { onClickRef.current = onBuildingClick; }, [onBuildingClick]);

  useEffect(() => {
    if (!containerRef.current) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 3);

    const cssW = getViewportWidth();
    const cssH = Math.round(cssW * BG_H / BG_W);
    // Physical pixel dimensions — this is what Phaser/WebGL uses for its viewport
    const physW = Math.round(cssW * dpr);
    const physH = Math.round(cssH * dpr);

    containerRef.current.style.height = `${cssH}px`;

    gameRef.current = new Phaser.Game({
      type:            Phaser.AUTO,
      parent:          containerRef.current,
      backgroundColor: '#4a5a10',
      scene:           [VillageScene],
      // Give Phaser the physical pixel size so WebGL viewport is native-res
      width:  physW,
      height: physH,
      scale: {
        mode:       Phaser.Scale.NONE,
        autoCenter: Phaser.Scale.NO_CENTER,
      },
      // Store CSS dimensions before any scene runs so VillageScene.create() can read them
      callbacks: {
        preBoot: (game) => {
          game.registry.set('cssWidth',  cssW);
          game.registry.set('cssHeight', cssH);
          game.registry.set('dpr',       dpr);
        },
      },
      input: {
        touch: { capture: false },
      },
      render: {
        antialias:       true,
        roundPixels:     true,
        powerPreference: 'low-power',
      },
      fps: {
        target:     60,
        smoothStep: true,
      },
    });

    // Expose game instance to parent via ref
    if (phaserGameRef) phaserGameRef.current = gameRef.current;

    // After Phaser creates the canvas, pin its CSS size to the logical (CSS) size.
    // This makes the canvas physically large (crisp) but visually the right size.
    const applyCSSSize = (cW, cH) => {
      const canvas = containerRef.current?.querySelector('canvas');
      if (!canvas) return;
      canvas.style.width  = `${cW}px`;
      canvas.style.height = `${cH}px`;
    };

    gameRef.current.events.once('ready', () => applyCSSSize(cssW, cssH));

    gameRef.current.events.on('buildingClicked', (buildingType) => {
      onClickRef.current?.(buildingType);
    });

    let resizeTimer = null;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!gameRef.current || !containerRef.current) return;
        const nCssW = getViewportWidth();
        const nCssH = Math.round(nCssW * BG_H / BG_W);
        const nPhysW = Math.round(nCssW * dpr);
        const nPhysH = Math.round(nCssH * dpr);
        containerRef.current.style.height = `${nCssH}px`;
        // Resize Phaser at physical resolution, then re-pin CSS size
        gameRef.current.scale.resize(nPhysW, nPhysH);
        gameRef.current.registry.set('cssWidth',  nCssW);
        gameRef.current.registry.set('cssHeight', nCssH);
        applyCSSSize(nCssW, nCssH);
        gameRef.current.events.emit('canvasResized', nCssW, nCssH);
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
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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
  phaserGameRef:   PropTypes.object,
};

PhaserGame.defaultProps = {
  modalOpen: false,
};

export default memo(PhaserGame);
