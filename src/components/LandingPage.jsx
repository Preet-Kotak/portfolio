/**
 * LandingPage — entry screen, styled identically to the CoC modals.
 *
 * Flow:
 *  1. Always show the choice panel first (portrait or landscape, mobile or desktop).
 *  2. If user picks "Gamified" while on portrait mobile → show rotate prompt.
 *     Once they rotate to landscape the game loads automatically.
 *  3. Professional version has no rotation requirement (Phase 11).
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { C, useMobile } from './modals/Modal';

/* ─── orientation helper ─────────────────────────────────────── */
function isPortraitMobile() {
  // screen.orientation is the most reliable on mobile browsers
  if (window.screen?.orientation?.type) {
    const type = window.screen.orientation.type;
    const portrait = type.startsWith('portrait');
    // Only counts as "mobile portrait" if it's actually a small screen
    return portrait && Math.min(window.innerWidth, window.innerHeight) < 600;
  }
  // Fallback: compare dimensions
  return window.innerWidth < window.innerHeight && window.innerWidth < 600;
}

/* ─── CoC 3D button (matches AboutModal ActionBtn exactly) ────── */
function CocBtn({ label, onClick, variant = 'green', disabled = false }) {
  const mobile = useMobile();

  const variants = {
    green: {
      bg:     `linear-gradient(180deg, ${C.btnGreenHi} 0%, ${C.btnGreen} 55%, ${C.btnGreenShadow} 100%)`,
      border: `2px solid ${C.btnGreenBorder}`,
      shadow: `0 4px 0 ${C.btnGreenShadow}, 0 6px 12px rgba(0,0,0,0.25)`,
      press:  `0 1px 0 ${C.btnGreenShadow}`,
    },
    gold: {
      bg:     `linear-gradient(180deg, ${C.btnGoldHi} 0%, ${C.btnGold} 55%, ${C.btnGoldShadow} 100%)`,
      border: `2px solid #B87800`,
      shadow: `0 4px 0 ${C.btnGoldShadow}, 0 6px 12px rgba(0,0,0,0.25)`,
      press:  `0 1px 0 ${C.btnGoldShadow}`,
    },
  };

  const v = variants[variant];

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        width:          '100%',
        padding:        mobile ? '7px 0' : '9px 0',
        borderRadius:   '10px',
        border:         v.border,
        background:     disabled
          ? `linear-gradient(180deg, #B0A898 0%, #908878 55%, #706858 100%)`
          : v.bg,
        boxShadow:      disabled
          ? `0 4px 0 #504840, 0 6px 12px rgba(0,0,0,0.2)`
          : v.shadow,
        fontSize:       mobile ? '10px' : '11px',
        fontWeight:     800,
        color:          '#FFFFFF',
        letterSpacing:  '0.06em',
        textTransform:  'uppercase',
        textShadow:     '0 1px 2px rgba(0,0,0,0.4)',
        cursor:         disabled ? 'default' : 'pointer',
        opacity:        disabled ? 0.75 : 1,
        userSelect:     'none',
        transition:     'filter 0.08s',
        fontFamily:     '"Segoe UI", system-ui, -apple-system, sans-serif',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter = 'brightness(1.1)'; }}
      onMouseLeave={e => {
        e.currentTarget.style.filter    = '';
        e.currentTarget.style.transform = '';
        if (!disabled) e.currentTarget.style.boxShadow = v.shadow;
      }}
      onMouseDown={e => {
        if (disabled) return;
        e.currentTarget.style.transform = 'translateY(3px)';
        e.currentTarget.style.boxShadow = v.press;
      }}
      onMouseUp={e => {
        if (disabled) return;
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = v.shadow;
      }}
    >
      {label}
    </button>
  );
}

/* ─── single version card ────────────────────────────────────── */
function VersionCard({ icon, title, desc, btnLabel, btnVariant, onClick, disabled, badge, mobile }) {
  return (
    <div style={{
      flex:          1,
      minWidth:      0,
      borderRadius:  '10px',
      background:    C.bgPanel,
      border:        `1px solid ${C.bgDark}`,
      boxShadow:     'inset 0 2px 4px rgba(0,0,0,0.08), inset 0 -1px 0 rgba(255,255,255,0.5)',
      padding:       mobile ? '12px 10px 14px' : '16px 14px 18px',
      display:       'flex',
      flexDirection: 'column',
      alignItems:    'center',
      gap:           mobile ? '8px' : '10px',
      position:      'relative',
    }}>
      {/* badge */}
      {badge && (
        <div style={{
          position:      'absolute',
          top:           '8px',
          right:         '8px',
          background:    `linear-gradient(135deg, ${C.goldLight} 0%, ${C.gold} 100%)`,
          color:         '#fff',
          fontSize:      '7px',
          fontWeight:    900,
          letterSpacing: '0.08em',
          padding:       '2px 6px',
          borderRadius:  '8px',
          textTransform: 'uppercase',
          boxShadow:     '0 2px 4px rgba(0,0,0,0.35)',
          textShadow:    '0 1px 2px rgba(0,0,0,0.4)',
          fontFamily:    '"Segoe UI", system-ui, sans-serif',
        }}>
          {badge}
        </div>
      )}

      {/* icon */}
      <div style={{ fontSize: mobile ? '36px' : '44px', lineHeight: 1, userSelect: 'none' }}>
        {icon}
      </div>

      {/* title */}
      <div style={{
        fontSize:      mobile ? '11px' : '13px',
        fontWeight:    900,
        letterSpacing: '0.08em',
        textTransform: 'uppercase',
        color:         C.text,
        textAlign:     'center',
        fontFamily:    '"Segoe UI", system-ui, sans-serif',
      }}>
        {title}
      </div>

      {/* desc */}
      <div style={{
        fontSize:   mobile ? '9.5px' : '10.5px',
        color:      C.textMuted,
        textAlign:  'center',
        lineHeight: 1.55,
        fontFamily: '"Segoe UI", system-ui, sans-serif',
        flex:       1,
      }}>
        {desc}
      </div>

      {/* button */}
      <div style={{ width: '100%', marginTop: 'auto' }}>
        <CocBtn
          label={disabled ? 'Coming Soon' : btnLabel}
          onClick={onClick}
          variant={btnVariant}
          disabled={disabled}
        />
      </div>
    </div>
  );
}

/* ─── rotate overlay ─────────────────────────────────────────── */
function RotateOverlay() {
  return (
    <>
      <style>{`
        @keyframes lp-rotatePhone {
          0%   { transform: rotate(0deg); }
          25%  { transform: rotate(-90deg); }
          75%  { transform: rotate(-90deg); }
          100% { transform: rotate(0deg); }
        }
        .lp-phone { animation: lp-rotatePhone 2.4s ease-in-out infinite; display: block; }
      `}</style>
      <div style={{
        position:        'fixed',
        inset:           0,
        zIndex:          9999,
        backgroundColor: '#1a1208',
        display:         'flex',
        flexDirection:   'column',
        alignItems:      'center',
        justifyContent:  'center',
        padding:         '32px',
        textAlign:       'center',
      }}>
        <span
          className="lp-phone"
          role="img"
          aria-label="rotate phone"
          style={{ fontSize: '64px', marginBottom: '22px', filter: 'drop-shadow(0 0 12px #F5A623aa)' }}
        >
          📱
        </span>

        <h2 style={{
          fontFamily:    '"Segoe UI", system-ui, sans-serif',
          fontWeight:    900,
          fontSize:      '18px',
          textTransform: 'uppercase',
          letterSpacing: '2px',
          color:         C.goldLight,
          margin:        '0 0 10px',
          textShadow:    '0 2px 6px rgba(0,0,0,0.8)',
        }}>
          Rotate Your Device
        </h2>

        <p style={{
          fontFamily: '"Segoe UI", system-ui, sans-serif',
          fontSize:   '14px',
          color:      '#D8D0C0',
          margin:     0,
          maxWidth:   '240px',
          lineHeight: 1.6,
        }}>
          Switch to landscape mode to enter the village, Chief!
        </p>

        <div style={{
          marginTop:    '24px',
          width:        '140px',
          height:       '2px',
          background:   `linear-gradient(90deg, transparent, ${C.goldLight}, transparent)`,
          borderRadius: '2px',
        }} />
      </div>
    </>
  );
}

/* ─── choice screen ──────────────────────────────────────────── */
function ChoiceScreen({ onChooseGame, onChoosePro }) {
  const mobile = useMobile();

  return (
    <div style={{
      position:        'fixed',
      inset:           0,
      zIndex:          9999,
      backgroundColor: 'rgba(0,0,0,0.82)',
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      padding:         mobile ? '8px' : '16px',
    }}>
      {/* ── wooden outer rim — exactly like Modal.jsx ── */}
      <div style={{
        width:        mobile ? 'min(98vw, 400px)' : 'min(94vw, 460px)',
        borderRadius: '14px',
        padding:      '3px',
        background:   `linear-gradient(180deg, ${C.rimLight} 0%, ${C.rim} 60%, #5A3E20 100%)`,
        boxShadow:    '0 8px 40px rgba(0,0,0,0.7), 0 2px 0 rgba(255,255,255,0.15) inset',
      }}>
        {/* inner light border */}
        <div style={{
          borderRadius: '12px',
          padding:      '2px',
          background:   'linear-gradient(180deg, #E0D8C8 0%, #B0A890 100%)',
        }}>
          {/* panel body */}
          <div style={{
            borderRadius: '10px',
            overflow:     'hidden',
            background:   C.bg,
            fontFamily:   '"Segoe UI", system-ui, -apple-system, sans-serif',
          }}>

            {/* ── header bar — same as Modal.jsx ── */}
            <div style={{
              background:     C.header,
              borderBottom:   `2px solid ${C.bgDark}`,
              padding:        mobile ? '7px 10px' : '10px 14px',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
            }}>
              <span style={{
                color:         C.text,
                fontSize:      mobile ? '11px' : '13px',
                fontWeight:    900,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>
                Welcome, Chief!
              </span>
            </div>

            {/* ── body ── */}
            <div style={{ padding: mobile ? '12px 12px 16px' : '18px 16px 22px', display: 'flex', flexDirection: 'column', gap: mobile ? '12px' : '16px' }}>

              {/* subtitle row */}
              <div style={{
                textAlign:  'center',
                fontSize:   mobile ? '10px' : '11px',
                color:      C.textMuted,
                fontWeight: 600,
                letterSpacing: '0.04em',
              }}>
                Choose your experience
              </div>

              {/* the two cards side by side */}
              <div style={{ display: 'flex', gap: mobile ? '10px' : '12px' }}>
                <VersionCard
                  icon="⚔️"
                  title="Gamified"
                  desc={`Clash of Clans themed\ninteractive village`}
                  btnLabel="Enter"
                  btnVariant="green"
                  onClick={onChooseGame}
                  disabled={false}
                  mobile={mobile}
                />
                <VersionCard
                  icon="💼"
                  title="Professional"
                  desc={`Clean, modern\nresume-style portfolio`}
                  btnLabel="Enter"
                  btnVariant="gold"
                  onClick={onChoosePro}
                  disabled={true}
                  badge="Phase 11"
                  mobile={mobile}
                />
              </div>

              {/* footer note */}
              <div style={{
                borderRadius: '8px',
                padding:      mobile ? '7px 10px' : '8px 12px',
                background:   C.bgPanel,
                border:       `1px solid ${C.bgDark}`,
                textAlign:    'center',
                fontSize:     mobile ? '9px' : '9.5px',
                color:        C.textMuted,
                letterSpacing:'0.03em',
              }}>
                You can switch versions anytime
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── main export ────────────────────────────────────────────── */
export default function LandingPage({ onChooseGame, onChoosePro }) {
  // 'choice' | 'rotate'
  const [screen, setScreen] = useState('choice');
  const [portrait, setPortrait] = useState(isPortraitMobile);

  // Track orientation changes
  useEffect(() => {
    const update = () => {
      const nowPortrait = isPortraitMobile();
      setPortrait(nowPortrait);
      // Auto-advance to game once user rotates to landscape
      if (!nowPortrait && screen === 'rotate') {
        onChooseGame();
      }
    };
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, [screen, onChooseGame]);

  const handleChooseGame = () => {
    if (portrait) {
      // On portrait mobile — ask them to rotate first
      setScreen('rotate');
    } else {
      onChooseGame();
    }
  };

  if (screen === 'rotate') return <RotateOverlay />;
  return <ChoiceScreen onChooseGame={handleChooseGame} onChoosePro={onChoosePro} />;
}

LandingPage.propTypes  = { onChooseGame: PropTypes.func.isRequired, onChoosePro: PropTypes.func.isRequired };
ChoiceScreen.propTypes = { onChooseGame: PropTypes.func.isRequired, onChoosePro: PropTypes.func.isRequired };
VersionCard.propTypes  = {
  icon: PropTypes.string.isRequired, title: PropTypes.string.isRequired,
  desc: PropTypes.string.isRequired, btnLabel: PropTypes.string.isRequired,
  btnVariant: PropTypes.string.isRequired, onClick: PropTypes.func,
  disabled: PropTypes.bool, badge: PropTypes.string, mobile: PropTypes.bool,
};
CocBtn.propTypes = {
  label: PropTypes.string.isRequired, onClick: PropTypes.func,
  variant: PropTypes.string, disabled: PropTypes.bool,
};
