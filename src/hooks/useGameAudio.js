/**
 * useGameAudio — central audio manager for the CoC portfolio.
 *
 * Owns:
 *  - intro music  (plays once on first gamified entry)
 *  - home music   (looping background, starts after intro ends)
 *  - modal-open SFX
 *  - modal-close SFX
 *  - notification SFX  (chat bot reply)
 *
 * All SFX respect the musicOn toggle — if the user muted, nothing plays.
 * Background music uses .muted so position is preserved on unmute.
 */

import { useState, useRef, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'coc_music_on';

// Preload a short SFX into an Audio object and return it.
function makeSfx(src, volume = 0.7) {
  const a = new Audio(src);
  a.volume = volume;
  return a;
}

export default function useGameAudio() {
  // ── Persistent preference ─────────────────────────────────────
  const [musicOn, setMusicOn] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved === null ? true : saved === 'true';
  });
  const musicOnRef = useRef(musicOn);
  useEffect(() => { musicOnRef.current = musicOn; }, [musicOn]);

  // ── Music tracks ──────────────────────────────────────────────
  const introAudioRef  = useRef(null);
  const homeAudioRef   = useRef(null);
  const hasPlayedIntro = useRef(false);

  // ── SFX — created lazily on first use so no requests fire until needed ──
  const sfxOpenRef  = useRef(null);
  const sfxCloseRef = useRef(null);
  const sfxNotifRef = useRef(null);

  const getSfx = (ref, src, volume) => {
    if (!ref.current) ref.current = makeSfx(src, volume);
    return ref.current;
  };

  // ── Internal: play a one-shot SFX if music is on ─────────────
  const playSfx = useCallback((audio) => {
    if (!musicOnRef.current) return;
    try {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch { /* ignore */ }
  }, []);

  // ── Public: named SFX triggers ────────────────────────────────
  const playModalOpen  = useCallback(() =>
    playSfx(getSfx(sfxOpenRef,  'assets/sounds/modal-open.mp3',  0.65)),
  [playSfx]);

  const playModalClose = useCallback(() =>
    playSfx(getSfx(sfxCloseRef, 'assets/sounds/modal-close.mp3', 0.6)),
  [playSfx]);

  const playNotification = useCallback(() =>
    playSfx(getSfx(sfxNotifRef, 'assets/sounds/notification.mp3', 0.7)),
  [playSfx]);

  // ── Music toggle ──────────────────────────────────────────────
  const toggleMusic = useCallback(() => {
    setMusicOn(prev => {
      const next = !prev;
      localStorage.setItem(STORAGE_KEY, String(next));
      musicOnRef.current = next;
      if (introAudioRef.current) introAudioRef.current.muted = !next;
      if (homeAudioRef.current)  homeAudioRef.current.muted  = !next;
      return next;
    });
  }, []);

  // ── Start music when user enters gamified mode ────────────────
  const startGameMusic = useCallback(() => {
    if (hasPlayedIntro.current) {
      // Returning visit — skip intro, go straight to home music
      if (!homeAudioRef.current) {
        const home = new Audio('assets/sounds/coc-home.mp3');
        home.volume = 0.5;
        home.loop   = true;
        home.muted  = !musicOnRef.current;
        homeAudioRef.current = home;
        home.play().catch(() => {});
      } else {
        homeAudioRef.current.muted = !musicOnRef.current;
        if (!homeAudioRef.current.muted) homeAudioRef.current.play().catch(() => {});
      }
      return false; // no intro — caller should go straight to 'game'
    }

    // First visit — play intro then chain home music
    hasPlayedIntro.current = true;
    const intro = new Audio('assets/sounds/coc-intro.mp3');
    intro.volume = 0.85;
    intro.muted  = !musicOnRef.current;
    introAudioRef.current = intro;

    intro.addEventListener('ended', () => {
      const home = new Audio('assets/sounds/coc-home.mp3');
      home.volume = 0.5;
      home.loop   = true;
      home.muted  = !musicOnRef.current;
      homeAudioRef.current = home;
      home.play().catch(() => {});
    }, { once: true });

    intro.play().catch(() => {});
    return true; // intro playing — caller should show IntroScreen
  }, []);

  return {
    musicOn,
    toggleMusic,
    startGameMusic,
    playModalOpen,
    playModalClose,
    playNotification,
  };
}
