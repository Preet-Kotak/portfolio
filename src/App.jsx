import { useState, useCallback } from 'react';
import PhaserGame from './components/phaser/PhaserGame';
import AboutModal from './components/modals/AboutModal';

function App() {
  const [activeModal, setActiveModal] = useState(null);

  const handleBuildingClick = useCallback((buildingType) => {
    setActiveModal(buildingType);
  }, []);

  const handleCloseModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden bg-[#92C463]">
      <PhaserGame onBuildingClick={handleBuildingClick} />

      {/* Phase 5: About Modal — opens when Town Hall is clicked */}
      <AboutModal
        isOpen={activeModal === 'about'}
        onClose={handleCloseModal}
      />
    </div>
  );
}

export default App;
