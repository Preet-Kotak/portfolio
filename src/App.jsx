import { useState, useEffect, useCallback } from 'react';
import PhaserGame        from './components/phaser/PhaserGame';
import AboutModal        from './components/modals/AboutModal';
import SkillsModal       from './components/modals/SkillsModal';
import ProjectsModal     from './components/modals/ProjectsModal';
import AchievementsModal from './components/modals/AchievementsModal';
import TrophyRoomModal, { CF_HANDLE } from './components/modals/TrophyRoomModal';
import PdfLightbox       from './components/modals/PdfLightbox';
import TrophyButton      from './components/TrophyButton';
import CvButton          from './components/CvButton';

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
    <div style={{ width: '100vw', overflowX: 'hidden' }}>
      {/* PhaserGame sets its own height via JS to match bg aspect ratio */}
      <div style={{ position: 'relative', width: '100%' }}>
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
        <PdfLightbox
          pdfPath="assets/resume.pdf"
          title="Resume"
          onClose={() => setResumeOpen(false)}
        />
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
      </div>  {/* end game container */}
    </div>
  );
}

export default App;
