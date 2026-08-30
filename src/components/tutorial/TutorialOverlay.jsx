/**
 * TutorialOverlay — CoC-styled first-visit tutorial.
 *
 * Step 0    : Welcome modal
 * Steps 1–4 : Building spotlights (Town Hall → Barracks → Builder's Hut → Laboratory)
 * Step 5    : Chat button spotlight
 * Step 6    : Trophy button spotlight
 *
 * Mobile (<1024px): compact tooltip pinned to bottom, smaller spotlight radius,
 * and a reduced camera-pan offset so the building stays in the upper ~45% of screen.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { C } from '../modals/Modal';

// ── Step definitions ───────────────────────────────────────────────────────────
const STEPS = [
  null, // 0 = welcome
  { buildingType: 'about',      domId: null,                 title: '🏰 Town Hall',    desc: 'Click it to open my profile!',                                    action: 'Click to open' },
  { buildingType: 'barracks',   domId: null,                 title: '⚔️ Barracks',     desc: 'Click the Barracks to see my skills and tech stack!',              action: 'Click to open' },
  { buildingType: 'builderhut', domId: null,                 title: "🔨 Builder's Hut", desc: "Click the Builder's Hut to browse my projects!",                  action: 'Click to open' },
  { buildingType: 'laboratory', domId: null,                 title: '🧪 Laboratory',   desc: 'Click it to see my achievements and certifications!',              action: 'Click to open' },
  { buildingType: null,         domId: 'tutorial-chat-btn',  title: '💬 Village Chat', desc: 'Ask me anything — projects, skills, stats, or just say hi!',       action: 'Got it'        },
  { buildingType: null,         domId: 'tutorial-trophy-btn',title: '🏆 Trophy Room',  desc: 'Live stats from Codeforces, LeetCode, and GitHub.',                action: 'Got it'        },
];

const TOTAL_STEPS = STEPS.length - 1; // 6

// ── Theme ──────────────────────────────────────────────────────────────────────
const GOLD_HI   = '#F0C040';
const GOLD_BDR  = '#C88A00';
const GREEN_BTN = 'linear-gradient(180deg,#80D830 0%,#5AB820 55%,#2A6000 100%)';
const SKIP_BG   = 'rgba(60,40,20,0.82)';

const isMobileWidth = () => window.innerWidth < 1024;

// ── Compact tooltip (used on both desktop and mobile, scales via props) ────────
function Tooltip({ title, desc, action, onAction, onSkip, stepNum, mobile }) {
  const isClickStep = action === 'Click to open';

  return (
    <div style={{
      position:      'fixed',
      bottom:        mobile ? '6px' : '15vh',
      left:          '50%',
      transform:     'translateX(-50%)',
      zIndex:        9999,
      width:         mobile ? 'min(96vw, 340px)' : 'min(92vw, 380px)',
      borderRadius:  '12px',
      padding:       '3px',
      background:    `linear-gradient(180deg, ${C.rimLight} 0%, ${C.rim} 60%, #5A3E20 100%)`,
      boxShadow:     '0 6px 30px rgba(0,0,0,0.75), 0 2px 0 rgba(255,255,255,0.15) inset',
      animation:     'tutTooltipIn 0.22s cubic-bezier(0.22,1,0.36,1) both',
    }}>
      <div style={{ borderRadius: '10px', padding: '2px', background: 'linear-gradient(180deg,#E0D8C8 0%,#B0A890 100%)' }}>
        <div style={{
          borderRadius: '9px',
          background:   C.bg,
          padding:      mobile ? '10px 12px 10px' : '16px 18px 14px',
          fontFamily:   '"Segoe UI", system-ui, -apple-system, sans-serif',
        }}>

          {/* step dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '4px', marginBottom: mobile ? '6px' : '10px' }}>
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <div key={i} style={{
                width:        i + 1 === stepNum ? '14px' : '5px',
                height:       '5px',
                borderRadius: '3px',
                background:   i + 1 === stepNum ? GOLD_BDR : C.bgDark,
                transition:   'all 0.2s',
              }} />
            ))}
          </div>

          {/* title */}
          <div style={{
            fontSize:      mobile ? '12px' : '14px',
            fontWeight:    900,
            color:         C.text,
            letterSpacing: '0.04em',
            textAlign:     'center',
            marginBottom:  mobile ? '3px' : '6px',
          }}>
            {title}
          </div>

          {/* description */}
          <div style={{
            fontSize:     mobile ? '11px' : '12px',
            color:        C.textSub,
            lineHeight:   '1.5',
            textAlign:    'center',
            marginBottom: mobile ? '10px' : '14px',
          }}>
            {desc}
          </div>

          {/* buttons */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', justifyContent: 'center' }}>
            <button
              onClick={onSkip}
              style={{
                padding:      mobile ? '5px 10px' : '6px 14px',
                borderRadius: '7px',
                border:       `1.5px solid ${C.bgDark}`,
                background:   SKIP_BG,
                color:        '#d4c8a8',
                fontSize:     mobile ? '9px' : '10px',
                fontWeight:   700,
                cursor:       'pointer',
                letterSpacing:'0.06em',
                textTransform:'uppercase',
                textShadow:   '0 1px 2px rgba(0,0,0,0.5)',
              }}
            >
              Skip
            </button>

            {!isClickStep && (
              <button
                onClick={onAction}
                style={{
                  padding:      mobile ? '6px 16px' : '7px 22px',
                  borderRadius: '8px',
                  border:       `2px solid #3A8010`,
                  background:   GREEN_BTN,
                  boxShadow:    `0 3px 0 #2A6000`,
                  color:        '#FFFFFF',
                  fontSize:     mobile ? '10px' : '11px',
                  fontWeight:   900,
                  cursor:       'pointer',
                  letterSpacing:'0.06em',
                  textTransform:'uppercase',
                  textShadow:   '0 1px 2px rgba(0,0,0,0.5)',
                }}
              >
                {action} →
              </button>
            )}
          </div>

          {isClickStep && (
            <div style={{
              textAlign:    'center',
              fontSize:     '9px',
              color:        C.textMuted,
              marginTop:    '6px',
              letterSpacing:'0.04em',
            }}>
              tap the highlighted building, or skip
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ── Welcome modal ──────────────────────────────────────────────────────────────
function WelcomeModal({ onStart, onSkip }) {
  const mobile = isMobileWidth();

  return (
    <div style={{
      position:        'fixed',
      inset:           0,
      zIndex:          9998,
      display:         'flex',
      alignItems:      'center',
      justifyContent:  'center',
      padding:         mobile ? '12px' : '20px',
      backgroundColor: 'rgba(0,0,0,0.7)',
      animation:       'tutFadeIn 0.3s ease both',
    }}>
      <div style={{
        width:        mobile ? 'min(96vw, 340px)' : 'min(92vw, 420px)',
        borderRadius: '14px',
        padding:      '3px',
        background:   `linear-gradient(180deg, ${C.rimLight} 0%, ${C.rim} 60%, #5A3E20 100%)`,
        boxShadow:    '0 8px 48px rgba(0,0,0,0.8), 0 2px 0 rgba(255,255,255,0.15) inset',
        animation:    'tutModalIn 0.3s cubic-bezier(0.22,1,0.36,1) both',
      }}>
        <div style={{ borderRadius: '12px', padding: '2px', background: 'linear-gradient(180deg,#E0D8C8 0%,#B0A890 100%)' }}>
          <div style={{
            borderRadius: '10px',
            background:   C.bg,
            overflow:     'hidden',
            fontFamily:   '"Segoe UI", system-ui, -apple-system, sans-serif',
          }}>

            {/* header */}
            <div style={{
              background:   C.header,
              borderBottom: `2px solid ${C.bgDark}`,
              padding:      mobile ? '10px 14px' : '12px 16px',
              textAlign:    'center',
            }}>
              <div style={{
                fontSize:      mobile ? '13px' : '15px',
                fontWeight:    900,
                color:         C.text,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
              }}>
                ⚔️ Welcome to the Village!
              </div>
            </div>

            {/* body */}
            <div style={{ padding: mobile ? '14px 16px 14px' : '22px 22px 20px' }}>
              <div style={{
                background:   C.bgPanel,
                border:       `1px solid ${C.bgDark}`,
                borderRadius: '10px',
                padding:      mobile ? '10px 12px' : '14px 16px',
                marginBottom: mobile ? '12px' : '18px',
                boxShadow:    'inset 0 2px 4px rgba(0,0,0,0.06)',
              }}>
                <div style={{ fontSize: mobile ? '12px' : '13px', fontWeight: 800, color: C.text, marginBottom: '6px' }}>
                  This is my interactive portfolio 🏰
                </div>
                <div style={{ fontSize: mobile ? '11px' : '12px', color: C.textSub, lineHeight: '1.6' }}>
                  Built as a Clash of Clans village — every building holds something about me.
                  {mobile ? ' ' : <><br /><br /></>}
                  Want a quick tour?
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                <button
                  onClick={onSkip}
                  style={{
                    padding:      mobile ? '7px 16px' : '8px 18px',
                    borderRadius: '9px',
                    border:       `1.5px solid ${C.bgDark}`,
                    background:   SKIP_BG,
                    color:        '#d4c8a8',
                    fontSize:     mobile ? '10px' : '11px',
                    fontWeight:   700,
                    cursor:       'pointer',
                    letterSpacing:'0.06em',
                    textTransform:'uppercase',
                    textShadow:   '0 1px 2px rgba(0,0,0,0.5)',
                  }}
                >
                  Skip
                </button>

                <button
                  onClick={onStart}
                  style={{
                    padding:      mobile ? '8px 22px' : '9px 28px',
                    borderRadius: '10px',
                    border:       `2px solid #3A8010`,
                    background:   GREEN_BTN,
                    boxShadow:    `0 4px 0 #2A6000, 0 6px 14px rgba(0,0,0,0.4)`,
                    color:        '#FFFFFF',
                    fontSize:     mobile ? '11px' : '12px',
                    fontWeight:   900,
                    cursor:       'pointer',
                    letterSpacing:'0.07em',
                    textTransform:'uppercase',
                    textShadow:   '0 1px 2px rgba(0,0,0,0.5)',
                  }}
                >
                  Start Tour ▶
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main TutorialOverlay ───────────────────────────────────────────────────────
function TutorialOverlay({ step, advance, skip, gameRef }) {
  const [spotPos, setSpotPos] = useState(null);
  const [mobile,  setMobile]  = useState(isMobileWidth);
  const rafRef = useRef(null);

  // Track mobile breakpoint
  useEffect(() => {
    const onResize = () => setMobile(isMobileWidth());
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // Get screen bbox of Trophy / Chat buttons
  const getDomPos = useCallback((id) => {
    let el;
    if (id === 'tutorial-trophy-btn') {
      el = document.querySelector('[title="Open Trophy Room"]');
    } else if (id === 'tutorial-chat-btn') {
      el = document.querySelector('[title="Open Chat"]');
    } else {
      el = document.getElementById(id);
    }
    if (!el) return null;
    const rect = el.getBoundingClientRect();
    // On mobile make the ring a bit tighter around small HUD buttons
    const rMult = mobile ? 1.1 : 0.9;
    return {
      x: rect.left + rect.width  / 2,
      y: rect.top  + rect.height / 2,
      r: Math.max(rect.width, rect.height) * rMult,
    };
  }, [mobile]);

  // Get Phaser building screen position
  const getPhaserBuildingPos = useCallback((buildingType) => {
    if (!gameRef?.current) return null;
    let pos = null;
    gameRef.current.events.emit('getTutorialBuildingPos', buildingType, (result) => {
      pos = result;
    });
    // On mobile clamp the radius so it doesn't eat the whole screen
    if (pos && mobile) {
      pos.r = Math.min(pos.r, window.innerWidth * 0.22);
    }
    return pos;
  }, [gameRef, mobile]);

  // Activate each step: pan camera + start polling spotlight
  useEffect(() => {
    if (step === null || step === 0 || step >= STEPS.length) {
      setSpotPos(null); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }
    const stepData = STEPS[step];
    if (!stepData) { setSpotPos(null); return; }

    // Pan to building, passing mobile flag so VillageScene can use a tighter offset
    if (stepData.buildingType && gameRef?.current) {
      gameRef.current.events.emit('tutorialPanToBuilding', stepData.buildingType, mobile);
    }

    const tick = () => {
      let pos = null;
      if (stepData.domId) {
        pos = getDomPos(stepData.domId);
      } else if (stepData.buildingType) {
        pos = getPhaserBuildingPos(stepData.buildingType);
      }
      if (pos) setSpotPos(pos);
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, [step, mobile, getDomPos, getPhaserBuildingPos, gameRef]);

  if (step === null) return null;
  if (step === 0) return <WelcomeModal onStart={advance} onSkip={skip} />;

  const stepData = STEPS[step];
  if (!stepData) return null;

  const isBuildingStep = Boolean(stepData.buildingType);

  return (
    <>
      {/* Dark overlay (solid for DOM steps, transparent for building steps) */}
      <div style={{
        position:        'fixed',
        inset:           0,
        zIndex:          9996,
        backgroundColor: isBuildingStep ? 'transparent' : 'rgba(0,0,0,0.62)',
        pointerEvents:   isBuildingStep ? 'none'        : 'all',
      }} />

      {/* Spotlight ring */}
      {spotPos && (
        <div style={{
          position:     'fixed',
          left:         spotPos.x - spotPos.r,
          top:          spotPos.y - spotPos.r,
          width:        spotPos.r * 2,
          height:       spotPos.r * 2,
          borderRadius: '50%',
          zIndex:       9997,
          pointerEvents:'none',
        }}>
          {/* Vignette darkness (building steps) */}
          {isBuildingStep && (
            <div style={{
              position:      'absolute',
              inset:         0,
              borderRadius:  '50%',
              boxShadow:     '0 0 0 9999px rgba(0,0,0,0.62)',
              pointerEvents: 'none',
            }} />
          )}
          {/* Animated gold glow */}
          <div style={{
            position:      'absolute',
            inset:         0,
            borderRadius:  '50%',
            boxShadow:     `0 0 0 4px ${GOLD_HI}, 0 0 0 8px rgba(240,192,64,0.45), 0 0 44px 18px rgba(240,192,64,0.28)`,
            animation:     'tutRingPulse 1.4s ease-in-out infinite',
            pointerEvents: 'none',
          }} />
        </div>
      )}

      {/* Tooltip */}
      <Tooltip
        title={stepData.title}
        desc={stepData.desc}
        action={stepData.action}
        onAction={advance}
        onSkip={skip}
        stepNum={step}
        mobile={mobile}
      />
    </>
  );
}

// ── PropTypes ──────────────────────────────────────────────────────────────────
TutorialOverlay.propTypes = {
  step:    PropTypes.number,
  advance: PropTypes.func.isRequired,
  skip:    PropTypes.func.isRequired,
  gameRef: PropTypes.object,
};

Tooltip.propTypes = {
  title:    PropTypes.string.isRequired,
  desc:     PropTypes.string.isRequired,
  action:   PropTypes.string.isRequired,
  onAction: PropTypes.func.isRequired,
  onSkip:   PropTypes.func.isRequired,
  stepNum:  PropTypes.number.isRequired,
  mobile:   PropTypes.bool,
};

WelcomeModal.propTypes = {
  onStart: PropTypes.func.isRequired,
  onSkip:  PropTypes.func.isRequired,
};

export default TutorialOverlay;
