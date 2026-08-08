import { useState, useEffect, useCallback } from 'react';
import PhaserGame from './components/phaser/PhaserGame';
import AboutModal        from './components/modals/AboutModal';
import SkillsModal       from './components/modals/SkillsModal';
import ProjectsModal     from './components/modals/ProjectsModal';
import AchievementsModal from './components/modals/AchievementsModal';
import TrophyRoomModal, { CF_HANDLE } from './components/modals/TrophyRoomModal';
import TrophyButton      from './components/TrophyButton';
import CvButton          from './components/CvButton';
import { C } from './components/modals/Modal';

// Map Phaser modalKey → which modal to open
// Add new entries here as more buildings become interactive
const MODAL_MAP = {
  about:      'about',
  barracks:   'barracks',
  builderhut: 'builderhut',
  laboratory: 'laboratory',
};

function App() {
  const [activeModal,  setActiveModal]  = useState(null);
  const [cfRating,     setCfRating]     = useState(null);
  const [resumeOpen,   setResumeOpen]   = useState(false);

  // Fetch CF rating once on mount for the trophy button display
  useEffect(() => {
    fetch(`https://codeforces.com/api/user.info?handles=${CF_HANDLE}`)
      .then(r => r.json())
      .then(json => {
        if (json.status === 'OK') {
          setCfRating(json.result[0].rating ?? 'N/A');
        } else {
          setCfRating('err');
        }
      })
      .catch(() => setCfRating('err'));
  }, []);

  const handleBuildingClick = useCallback((modalKey) => {
    const resolved = MODAL_MAP[modalKey] ?? null;
    setActiveModal(resolved);
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden bg-[#92C463]">
      <PhaserGame onBuildingClick={handleBuildingClick} modalOpen={activeModal !== null} />

      {/* ── Trophy button — top-left HUD ── */}
      <TrophyButton
        cfRating={cfRating}
        onClick={() => setActiveModal('trophy')}
      />

      {/* ── CV button — below trophy button ── */}
      <CvButton onClick={() => setResumeOpen(true)} />

      {/* ── Resume PDF lightbox ── */}
      {resumeOpen && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setResumeOpen(false); }}
          style={{
            position:       'fixed',
            inset:          0,
            zIndex:         100,
            background:     'rgba(0,0,0,0.88)',
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            padding:        '20px',
          }}
        >
          <button
            onClick={() => setResumeOpen(false)}
            aria-label="Close resume"
            style={{
              position:       'absolute',
              top:            '16px',
              right:          '20px',
              background:     'rgba(255,255,255,0.1)',
              border:         `1px solid ${C.textMuted}`,
              borderRadius:   '50%',
              width:          '34px',
              height:         '34px',
              color:          '#fff',
              fontSize:       '14px',
              cursor:         'pointer',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              fontWeight:     700,
            }}
          >
            ✕
          </button>
          <iframe
            src="assets/resume.pdf"
            title="Resume"
            style={{
              width:        'min(92vw, 860px)',
              height:       'min(88vh, 680px)',
              border:       `2px solid ${C.goldDark}`,
              borderRadius: '8px',
              background:   '#fff',
            }}
          />
          <div style={{ marginTop: '10px', fontSize: '11px', color: C.textMuted }}>
            Click outside to close
          </div>
        </div>
      )}

      {/* Town Hall → About */}
      <AboutModal
        isOpen={activeModal === 'about'}
        onClose={handleCloseModal}
      />

      {/* Barracks → Skills */}
      <SkillsModal
        isOpen={activeModal === 'barracks'}
        onClose={handleCloseModal}
      />

      {/* Builder's Hut → Projects */}
      <ProjectsModal
        isOpen={activeModal === 'builderhut'}
        onClose={handleCloseModal}
      />

      {/* Laboratory → Achievements */}
      <AchievementsModal
        isOpen={activeModal === 'laboratory'}
        onClose={handleCloseModal}
      />

      {/* Trophy Button → Trophy Room */}
      <TrophyRoomModal
        isOpen={activeModal === 'trophy'}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;
