import { useState } from 'react';
import PhaserGame from './components/phaser/PhaserGame';
import Modal from './components/modals/Modal';

function App() {
  const [activeModal, setActiveModal] = useState(null);

  const handleBuildingClick = (buildingType) => {
    console.log('Building clicked in React App:', buildingType);
    setActiveModal(buildingType);
    console.log('Modal state updated to:', buildingType);
  };

  const handleCloseModal = () => {
    console.log('Closing modal');
    setActiveModal(null);
  };

  return (
    <div className="w-full h-screen overflow-hidden bg-[#92C463]">
      <PhaserGame onBuildingClick={handleBuildingClick} />
      
      {/* Test Modal - Phase 4 Proof of Concept */}
      <Modal isOpen={activeModal !== null} onClose={handleCloseModal}>
        <h2 className="text-3xl font-bold text-[#F5A623] mb-4">
          Building Clicked!
        </h2>
        <p className="text-xl text-gray-200">
          You clicked: <span className="text-[#FFD700] font-semibold">{activeModal}</span>
        </p>
        <p className="text-sm text-gray-400 mt-4">
          Phase 4 Complete: Building interactivity works! 🎉
        </p>
        <div className="mt-6 pt-4 border-t border-[#F5A623]/30">
          <p className="text-sm text-gray-300">
            ✅ Buildings are interactive<br />
            ✅ Phaser emits events to React<br />
            ✅ Modal system is functional<br />
            ✅ Close with Escape, X button, or click outside
          </p>
        </div>
      </Modal>
    </div>
  );
}

export default App;
