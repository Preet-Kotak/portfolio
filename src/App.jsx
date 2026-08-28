import { useState, useEffect, useCallback, useRef } from 'react';
import PhaserGame        from './components/phaser/PhaserGame';
import OrientationPrompt from './components/OrientationPrompt';
import AboutModal        from './components/modals/AboutModal';
import SkillsModal       from './components/modals/SkillsModal';
import ProjectsModal     from './components/modals/ProjectsModal';
import AchievementsModal from './components/modals/AchievementsModal';
import TrophyRoomModal, { CF_HANDLE } from './components/modals/TrophyRoomModal';
import PdfLightbox       from './components/modals/PdfLightbox';
import TrophyButton      from './components/TrophyButton';
import CvButton          from './components/CvButton';
import ChatButton        from './components/chat/ChatButton';
import ChatPanel         from './components/chat/ChatPanel';
import TutorialOverlay   from './components/tutorial/TutorialOverlay';
import useTutorial       from './hooks/useTutorial';

const MODAL_MAP = {
  about:      'about',
  barracks:   'barracks',
  builderhut: 'builderhut',
  laboratory: 'laboratory',
};

function App() {
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
    setActiveModal(MODAL_MAP[modalKey] ?? null);
  }, []);

  const handleCloseModal = useCallback(() => {
    // Let tutorial know which modal just closed so it can advance the step
    onModalClosed(activeModal);
    setActiveModal(null);
  }, [activeModal, onModalClosed]);

  // Called by ChatPanel quick-actions / commands to open modals
  const handleChatOpenModal = useCallback((key) => {
    if (key === 'resume') {
      setResumeOpen(true);
    } else {
      setActiveModal(key);
    }
  }, []);

  return (
    <div style={{ width: '100%', overflowX: 'hidden' }}>
      <OrientationPrompt />
      <div style={{ position: 'relative', width: '100%' }}>
        <PhaserGame onBuildingClick={handleBuildingClick} modalOpen={activeModal !== null} phaserGameRef={phaserGameRef} />

        <div id="tutorial-trophy-btn">
          <TrophyButton cfRating={cfRating} onClick={() => setActiveModal('trophy')} />
        </div>
        <CvButton onClick={() => setResumeOpen(true)} />

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
        />

        {resumeOpen && (
          <PdfLightbox pdfPath="assets/resume.pdf" title="Resume" onClose={() => setResumeOpen(false)} />
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
    </div>
  );
}

export default App;
