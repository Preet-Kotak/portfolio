import { useState, useEffect, useCallback, useRef } from 'react';
import PhaserGame        from './components/phaser/PhaserGame';
import LandingPage       from './components/LandingPage';
import IntroScreen       from './components/IntroScreen';
import ProfessionalPage  from './components/professional/ProfessionalPage';
import AboutModal        from './components/modals/AboutModal';
import SkillsModal       from './components/modals/SkillsModal';
import ProjectsModal     from './components/modals/ProjectsModal';
import AchievementsModal from './components/modals/AchievementsModal';
import TrophyRoomModal, { CF_HANDLE } from './components/modals/TrophyRoomModal';
import ContactFormModal from './components/modals/ContactFormModal';
import PdfLightbox       from './components/modals/PdfLightbox';
import TrophyButton      from './components/TrophyButton';
import CvButton          from './components/CvButton';
import MusicButton       from './components/MusicButton';
import ChatButton        from './components/chat/ChatButton';
import ChatPanel         from './components/chat/ChatPanel';
import TutorialOverlay   from './components/tutorial/TutorialOverlay';
import useTutorial       from './hooks/useTutorial';
import useGameAudio      from './hooks/useGameAudio';

// Always show landing on fresh page load — never skip it via localStorage.
// localStorage is only used to remember the choice within the same session
// so returning visitors still see the landing (intended behaviour for a portfolio).
const MODAL_MAP = {
  about:      'about',
  barracks:   'barracks',
  builderhut: 'builderhut',
  laboratory: 'laboratory',
  contact:    'contact',
};

function App() {
  // ── Landing: which version is active ──────────────────────────
  const [version, setVersion] = useState(null); // null | 'intro' | 'game' | 'pro'

  // ── Centralised audio ─────────────────────────────────────────
  const {
    musicOn,
    toggleMusic,
    startGameMusic,
    playModalOpen,
    playModalClose,
    playNotification,
  } = useGameAudio();

  const handleChooseGame = useCallback(() => {
    const playingIntro = startGameMusic();
    setVersion(playingIntro ? 'intro' : 'game');
  }, [startGameMusic]);

  const handleChoosePro = useCallback(() => {
    // Show the cinematic intro, then load the professional page (no audio)
    setVersion('pro-intro');
  }, []);

  const handleIntroDone = useCallback(() => {
    setVersion('game');
  }, []);

  // ── Game state ────────────────────────────────────────────────
  const [activeModal, setActiveModal] = useState(null);
  const [cfRating,    setCfRating]    = useState(null);
  const [resumeOpen,  setResumeOpen]  = useState(false);
  const [chatOpen,    setChatOpen]    = useState(false);
  const phaserGameRef = useRef(null);

  const { step, isActive, advance, skip, onModalClosed } = useTutorial();

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
    playModalOpen();
    setActiveModal(MODAL_MAP[modalKey] ?? null);
  }, [playModalOpen]);

  const handleCloseModal = useCallback(() => {
    playModalClose();
    onModalClosed(activeModal);
    setActiveModal(null);
  }, [activeModal, onModalClosed, playModalClose]);

  // Called by ChatPanel quick-actions / commands to open modals
  const handleChatOpenModal = useCallback((key) => {
    if (key === 'resume') {
      playModalOpen();
      setResumeOpen(true);
    } else {
      playModalOpen();
      setActiveModal(key);
    }
  }, [playModalOpen]);

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      {/* ── Landing screen ─────────────────────────────────────── */}
      {version === null && (
        <LandingPage
          onChooseGame={handleChooseGame}
          onChoosePro={handleChoosePro}
        />
      )}

      {/* ── Cinematic name intro (game path) ───────────────────── */}
      {version === 'intro' && (
        <IntroScreen onDone={handleIntroDone} />
      )}

      {/* ── Cinematic name intro (professional path, no audio) ─── */}
      {version === 'pro-intro' && (
        <IntroScreen onDone={() => setVersion('pro')} />
      )}

      {/* ── Professional page (Phase 11) ─────────────────────── */}
      {version === 'pro' && (
        <ProfessionalPage
          onBack={() => setVersion(null)}
          onSwitchToGame={handleChooseGame}
        />
      )}

      {/* ── Gamified village (existing CoC experience) ─────────── */}
      {version === 'game' && (
        <div style={{ position: 'relative', width: '100%' }}>
          <PhaserGame onBuildingClick={handleBuildingClick} modalOpen={activeModal !== null} phaserGameRef={phaserGameRef} />

          <div id="tutorial-trophy-btn">
            <TrophyButton cfRating={cfRating} onClick={() => { playModalOpen(); setActiveModal('trophy'); }} />
          </div>
          <CvButton onClick={() => { playModalOpen(); setResumeOpen(true); }} />
          <MusicButton musicOn={musicOn} onToggle={toggleMusic} />

          {/* Chat toggle button — only show open button when closed */}
          {!chatOpen && (
            <div id="tutorial-chat-btn">
              <ChatButton onClick={() => setChatOpen(true)} />
            </div>
          )}

          {/* Chat panel — slides in from left */}
          <ChatPanel
            isOpen={chatOpen}
            onClose={() => setChatOpen(false)}
            onOpenModal={handleChatOpenModal}
            onBotReply={playNotification}
          />

          {resumeOpen && (
            <PdfLightbox pdfPath="assets/resume.pdf" title="Resume" onClose={() => { playModalClose(); setResumeOpen(false); }} />
          )}

          <AboutModal        isOpen={activeModal === 'about'}      onClose={handleCloseModal} />
          <SkillsModal       isOpen={activeModal === 'barracks'}   onClose={handleCloseModal} />
          <ProjectsModal     isOpen={activeModal === 'builderhut'} onClose={handleCloseModal} />
          <AchievementsModal isOpen={activeModal === 'laboratory'} onClose={handleCloseModal} />
          <TrophyRoomModal   isOpen={activeModal === 'trophy'}     onClose={handleCloseModal} />

          {/* Tutorial overlay — rendered on top of everything, hidden while a modal is open */}
          {isActive && !activeModal && (
            <TutorialOverlay
              step={step}
              advance={advance}
              skip={skip}
              gameRef={phaserGameRef}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default App;
