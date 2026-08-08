import { useState, useCallback } from 'react';
import PhaserGame from './components/phaser/PhaserGame';
import AboutModal       from './components/modals/AboutModal';
import SkillsModal      from './components/modals/SkillsModal';
import ProjectsModal    from './components/modals/ProjectsModal';
import AchievementsModal from './components/modals/AchievementsModal';

// Map Phaser modalKey → which modal to open
// Add new entries here as more buildings become interactive
const MODAL_MAP = {
  about:      'about',
  barracks:   'barracks',
  builderhut: 'builderhut',
  laboratory: 'laboratory',
};

function App() {
  const [activeModal, setActiveModal] = useState(null);

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
    </div>
  );
}

export default App;
