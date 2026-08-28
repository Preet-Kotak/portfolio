/**
 * useTutorial — manages the tutorial flow.
 *
 * Steps:
 *  0  — welcome modal
 *  1  — highlight Town Hall  (About)
 *  2  — highlight Barracks   (Skills)
 *  3  — highlight Builder's Hut (Projects)
 *  4  — highlight Laboratory (Achievements)
 *  5  — highlight Chat button
 *  6  — highlight Trophy button
 *  (7 = done, resets to null)
 *
 * Timer: 1 minute for testing — change COOLDOWN_MS to 86400000 for 1-day prod.
 */

import { useState, useCallback, useEffect, useRef } from 'react';

const LS_KEY      = 'portfolio_tutorial_ts';
const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 1 day
const TOTAL_STEPS = 7;

function shouldShowTutorial() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return true;
    const last = parseInt(raw, 10);
    if (isNaN(last)) return true;
    return Date.now() - last >= COOLDOWN_MS;
  } catch {
    return true;
  }
}

function markTutorialSeen() {
  try {
    localStorage.setItem(LS_KEY, String(Date.now()));
  } catch { /* ignore */ }
}

export default function useTutorial() {
  const [step, setStep]   = useState(null);
  const timerRef          = useRef(null);

  useEffect(() => {
    // Guard: only run once on mount
    if (!shouldShowTutorial()) return;

    timerRef.current = setTimeout(() => {
      setStep(0);
    }, 1000); // 1 second after mount

    return () => clearTimeout(timerRef.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const advance = useCallback(() => {
    setStep(prev => {
      if (prev === null) return null;
      const next = prev + 1;
      if (next >= TOTAL_STEPS) {
        markTutorialSeen();
        return null;
      }
      return next;
    });
  }, []);

  const skip = useCallback(() => {
    markTutorialSeen();
    setStep(null);
  }, []);

  // Called by App when a building modal closes — advances only if on the matching step
  const onModalClosed = useCallback((modalKey) => {
    setStep(prev => {
      if (prev === null) return null;
      const stepForModal = {
        about:      1,
        barracks:   2,
        builderhut: 3,
        laboratory: 4,
      };
      if (stepForModal[modalKey] === prev) return prev + 1;
      return prev;
    });
  }, []);

  const isActive = step !== null && step < TOTAL_STEPS;

  return { step, isActive, advance, skip, onModalClosed };
}
