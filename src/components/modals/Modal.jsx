import { useEffect } from 'react';
import PropTypes from 'prop-types';

function Modal({ isOpen, onClose, children }) {
  // Handle Escape key press
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle overlay click (click outside modal)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
      style={{ backgroundColor: 'rgba(0, 0, 0, 0.85)' }}
      onClick={handleOverlayClick}
    >
      <div
        className="relative w-full max-w-lg mx-auto
                   bg-[#2C2416] rounded-xl shadow-2xl
                   border-2 border-[#F5A623]
                   max-h-[80vh] overflow-y-auto
                   outline outline-4 outline-[#8B4513]/60 outline-offset-2"
        style={{
          boxShadow: '0 0 0 2px #8B4513, 0 25px 60px rgba(0,0,0,0.7), inset 0 1px 0 rgba(245,166,35,0.15)'
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10
                     w-8 h-8 flex items-center justify-center
                     bg-[#8B4513] hover:bg-[#F5A623]
                     text-[#F5A623] hover:text-[#2C2416]
                     text-xl font-bold rounded-full
                     border border-[#F5A623]/50
                     transition-all duration-150 leading-none"
          aria-label="Close modal"
        >
          ✕
        </button>

        {/* Modal content */}
        <div className="p-6 text-gray-100">
          {children}
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  children: PropTypes.node.isRequired
};

export default Modal;
