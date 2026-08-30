/**
 * IntroScreen — Bond / Nolan style cinematic name reveal.
 *
 * Each line:
 *  1. Fades in softly (opacity 0 → 1, 800ms)
 *  2. A sharp horizontal light streak sweeps left → right across the text
 *  3. Lines stagger — line 2 starts after line 1's streak, line 3 after line 2's
 *
 * After all three lines are visible + streaked, hold briefly, then fade out → onDone().
 *
 * Font: Cormorant SC — elegant engraved serif, loads from Google Fonts.
 * Fallback: Georgia, Times New Roman.
 */

import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

/* ── per-line timing (ms from mount) ───────────────────────── */
const LINES = [
  { text: 'KOTAK',       fadeAt: 200  },
  { text: 'PREETKUMAR',  fadeAt: 1000 },
  { text: 'DIPENKUMAR',  fadeAt: 1800 },
];

const FADE_DUR    = 700;   // ms — each line fades in
const HOLD_AFTER  = 1000;  // ms pause after last line before fade-out
const FADEOUT_DUR = 800;   // ms — whole screen fades out

const lastLine     = LINES[LINES.length - 1];
const screenFadeAt = lastLine.fadeAt + FADE_DUR + HOLD_AFTER;
const doneAt       = screenFadeAt + FADEOUT_DUR + 100;

export default function IntroScreen({ onDone }) {
  const wrapRef   = useRef(null);
  const lineRefs  = useRef(LINES.map(() => null));

  useEffect(() => {
    const timers = [];

    LINES.forEach(({ fadeAt }, i) => {
      timers.push(setTimeout(() => {
        const el = lineRefs.current[i];
        if (!el) return;
        el.style.opacity   = '1';
        el.style.transform = 'none';
      }, fadeAt));
    });

    /* fade whole screen out */
    timers.push(setTimeout(() => {
      if (wrapRef.current) wrapRef.current.style.opacity = '0';
    }, screenFadeAt));

    /* fire done */
    timers.push(setTimeout(onDone, doneAt));

    return () => {
      timers.forEach(clearTimeout);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* Google Font — Cinzel (bold Roman caps, cinematic) */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Cinzel:wght@700;900&display=swap"
        rel="stylesheet"
      />

      <div
        ref={wrapRef}
        style={{
          position:        'fixed',
          inset:           0,
          zIndex:          9999,
          backgroundColor: '#000',
          display:         'flex',
          flexDirection:   'column',
          alignItems:      'center',
          justifyContent:  'center',
          gap:             'clamp(4px, 1.8vw, 20px)',
          transition:      `opacity ${FADEOUT_DUR}ms ease`,
          opacity:         1,
          userSelect:      'none',
          overflow:        'hidden',
        }}
      >
        {LINES.map(({ text }, i) => (
          <div
            key={text}
            ref={el => { lineRefs.current[i] = el; }}
            style={{
              opacity:       0,
              transform:     'translateY(6px)',
              transition:    `opacity ${FADE_DUR}ms ease, transform ${FADE_DUR}ms ease`,
              fontFamily:    '"Cinzel", "Georgia", "Times New Roman", serif',
              fontWeight:    900,
              fontSize:      'clamp(28px, 9vw, 82px)',
              letterSpacing: '0.18em',
              color:         '#FFFFFF',
              textTransform: 'uppercase',
              textAlign:     'center',
              textShadow:    '0 0 60px rgba(255,255,255,0.08)',
              whiteSpace:    'nowrap',
              lineHeight:    1.1,
            }}
          >
            {text}
          </div>
        ))}

        {/* thin rule under the name */}
        <div
          style={{
            width:      'clamp(120px, 28vw, 320px)',
            height:     '1px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent)',
            marginTop:  'clamp(6px, 1.5vw, 18px)',
            opacity:    0,
            animation:  `introRule 0.8s ease ${LINES[LINES.length - 1].fadeAt + FADE_DUR}ms forwards`,
          }}
        />
      </div>

      <style>{`
        @keyframes introRule {
          from { opacity: 0; transform: scaleX(0.3); }
          to   { opacity: 1; transform: scaleX(1); }
        }
      `}</style>
    </>
  );
}

IntroScreen.propTypes = {
  onDone: PropTypes.func.isRequired,
};
