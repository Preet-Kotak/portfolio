import { lazy, Suspense, useState, useEffect, useCallback, useRef } from 'react';
import { initAnalytics, trackPageView, trackEvent } from './utils/analytics';
import about from './data/about';
import PhaserGame        from './components/phaser/PhaserGame';
import LandingPage       from './components/LandingPage';
import IntroScreen       from './components/IntroScreen';
import TrophyButton      from './components/TrophyButton';
import CvButton          from './components/CvButton';
import MusicButton       from './components/MusicButton';
import ChatButton        from './components/chat/ChatButton';
import ChatPanel         from './components/chat/ChatPanel';
import OrientationPrompt from './components/OrientationPrompt';
import useTutorial       from './hooks/useTutorial';
import useGameAudio      from './hooks/useGameAudio';

// Lazy-loaded heavy components
const ProfessionalPage  = lazy(() => import('./components/professional/ProfessionalPage'));
const AboutModal        = lazy(() => import('./components/modals/AboutModal'));
const SkillsModal       = lazy(() => import('./components/modals/SkillsModal'));
const ProjectsModal     = lazy(() => import('./components/modals/ProjectsModal'));
const AchievementsModal = lazy(() => import('./components/modals/AchievementsModal'));
const TrophyRoomModal   = lazy(() => import('./components/modals/TrophyRoomModal'));
const ContactFormModal  = lazy(() => import('./components/modals/ContactFormModal'));
const PdfLightbox       = lazy(() => import('./components/modals/PdfLightbox'));
const TutorialOverlay   = lazy(() => import('./components/tutorial/TutorialOverlay'));

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
  // ── Analytics ─────────────────────────────────────────────────
  useEffect(() => {
    initAnalytics();
    trackPageView('/');
  }, []);
  // ── Landing: which version is active ──────────────────────────
  // Persist mode across reloads. 'intro' is never saved — on reload
  // we go straight to 'game' to skip the cinematic.
  const [version, setVersionRaw] = useState(() => {
    const saved = localStorage.getItem('portfolioMode');
    return (saved === 'game' || saved === 'pro') ? saved : null;
  });

  const setVersion = useCallback((v) => {
    // Never persist 'intro' — treat it as 'game' for storage purposes
    const toSave = v === 'intro' ? 'game' : v;
    if (toSave === null) {
      localStorage.removeItem('portfolioMode');
    } else {
      localStorage.setItem('portfolioMode', toSave);
    }
    setVersionRaw(v);
  }, []);

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
  }, [startGameMusic, setVersion]);

  const handleChooseGameFromPro = useCallback(() => {
    startGameMusic();
    setVersion('intro');
  }, [startGameMusic, setVersion]);

  const handleChoosePro = useCallback(() => {
    setVersion('pro');
  }, [setVersion]);

  const handleIntroDone = useCallback(() => {
    setVersion('game');
  }, [setVersion]);

  // ── Game state ────────────────────────────────────────────────
  const [activeModal, setActiveModal] = useState(null);
  const [cfRating,    setCfRating]    = useState(null);
  const [resumeOpen,  setResumeOpen]  = useState(false);
  const [chatOpen,    setChatOpen]    = useState(false);
  const phaserGameRef = useRef(null);

  const { step, isActive, advance, skip, onModalClosed } = useTutorial();

  useEffect(() => {
    fetch(`https://codeforces.com/api/user.info?handles=${about.cfHandle}`)
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
    trackEvent('Navigation', 'Building Clicked', modalKey);
    setActiveModal(MODAL_MAP[modalKey] ?? null);
  }, [playModalOpen]);

  const handleCloseModal = useCallback(() => {
    playModalClose();
    trackEvent('Navigation', 'Modal Closed', activeModal ?? 'unknown');
    onModalClosed(activeModal);
    setActiveModal(null);
  }, [activeModal, onModalClosed, playModalClose]);

  // Called by ChatPanel quick-actions / commands to open modals
  const handleChatOpenModal = useCallback((key) => {
    if (key === 'resume') {
      playModalOpen();
      trackEvent('Navigation', 'Resume Opened', 'chat-command');
      setResumeOpen(true);
    } else {
      playModalOpen();
      trackEvent('Navigation', 'Modal Opened', key);
      setActiveModal(key);
    }
  }, [playModalOpen]);

  return (
    <div style={{ width: '100%', minWidth: 0 }}>
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

      {/* ── Professional page (Phase 11) ─────────────────────── */}
      {version === 'pro' && (
        <Suspense fallback={null}>
          <ProfessionalPage
            onBack={handleChooseGameFromPro}
            onSwitchToGame={handleChooseGameFromPro}
          />
        </Suspense>
      )}

      {/* ── Gamified village (existing CoC experience) ─────────── */}
      {version === 'game' && (
        <div style={{ position: 'relative', width: '100%' }}>
          <OrientationPrompt />
          <PhaserGame onBuildingClick={handleBuildingClick} modalOpen={activeModal !== null} phaserGameRef={phaserGameRef} />

          {/* Professional mode button — bottom-right, CoC HUD style */}
          <button
            onClick={handleChoosePro}
            title="Switch to Professional View"
            className="hud-pro-btn"
            style={{
              position:       'fixed',
              bottom:         '16px',
              right:          '16px',
              zIndex:         40,
              padding:        0,
              border:         'none',
              background:     'linear-gradient(180deg, #c8a855 0%, #b89060 30%, #a07040 65%, #7a4a18 100%)',
              cursor:         'pointer',
              outline:        'none',
              userSelect:     'none',
              borderRadius:   '10px',
              overflow:       'hidden',
              display:        'flex',
              flexDirection:  'column',
              alignItems:     'center',
              justifyContent: 'center',
              gap:            '4px',
              boxShadow:      '0 4px 0 rgba(0,0,0,0.5), 0 6px 14px rgba(0,0,0,0.45)',
              filter:         'brightness(1.2) saturate(1.3) contrast(1.05)',
              transition:     'filter 0.1s, transform 0.1s, box-shadow 0.1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.38) saturate(1.3) contrast(1.05)'; }}
            onMouseLeave={e => {
              e.currentTarget.style.filter    = 'brightness(1.2) saturate(1.3) contrast(1.05)';
              e.currentTarget.style.transform = '';
              e.currentTarget.style.boxShadow = '0 4px 0 rgba(0,0,0,0.5), 0 6px 14px rgba(0,0,0,0.45)';
            }}
            onMouseDown={e => {
              e.currentTarget.style.transform  = 'translateY(4px)';
              e.currentTarget.style.boxShadow  = '0 0px 0 rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.4)';
            }}
            onMouseUp={e => {
              e.currentTarget.style.transform  = '';
              e.currentTarget.style.boxShadow  = '0 4px 0 rgba(0,0,0,0.5), 0 6px 14px rgba(0,0,0,0.45)';
            }}
          >
            <span style={{ fontSize: '26px', lineHeight: 1 }}>💼</span>
            <span style={{
              fontFamily:    'system-ui, -apple-system, sans-serif',
              fontSize:      '9px',
              fontWeight:    900,
              color:         '#fff',
              textShadow:    '0 1px 3px rgba(0,0,0,0.7)',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              lineHeight:    1,
            }}>PRO</span>
          </button>

          <div id="tutorial-trophy-btn">
            <TrophyButton cfRating={cfRating} onClick={() => { playModalOpen(); trackEvent('Navigation', 'Modal Opened', 'trophy'); setActiveModal('trophy'); }} />
          </div>
          <CvButton onClick={() => { playModalOpen(); trackEvent('Navigation', 'Resume Opened', 'cv-button'); setResumeOpen(true); }} />
          <MusicButton musicOn={musicOn} onToggle={() => { trackEvent('Engagement', 'Music Toggle', musicOn ? 'off' : 'on'); toggleMusic(); }} />

          {/* Chat toggle button — only show open button when closed */}
          {!chatOpen && (
            <div id="tutorial-chat-btn">
              <ChatButton onClick={() => { trackEvent('Engagement', 'Chat Opened', 'chat-button'); setChatOpen(true); }} />
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
            <Suspense fallback={null}>
              <PdfLightbox pdfPath="assets/resume.pdf" title="Resume" onClose={() => { playModalClose(); setResumeOpen(false); }} />
            </Suspense>
          )}

          <Suspense fallback={null}>
            <AboutModal        isOpen={activeModal === 'about'}      onClose={handleCloseModal} />
            <SkillsModal       isOpen={activeModal === 'barracks'}   onClose={handleCloseModal} />
            <ProjectsModal     isOpen={activeModal === 'builderhut'} onClose={handleCloseModal} />
            <AchievementsModal isOpen={activeModal === 'laboratory'} onClose={handleCloseModal} />
            <TrophyRoomModal   isOpen={activeModal === 'trophy'}     onClose={handleCloseModal} />
            <ContactFormModal  isOpen={activeModal === 'contact'}    onClose={handleCloseModal} />
          </Suspense>

          {/* Tutorial overlay — rendered on top of everything, hidden while a modal is open */}
          {isActive && !activeModal && (
            <Suspense fallback={null}>
              <TutorialOverlay
                step={step}
                advance={advance}
                skip={skip}
                gameRef={phaserGameRef}
              />
            </Suspense>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
