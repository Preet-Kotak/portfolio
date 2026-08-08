import PropTypes from 'prop-types';
import { C } from './Modal';

/**
 * Shared full-screen PDF lightbox.
 * Used by AchievementsModal (certificates) and App (resume).
 */
function PdfLightbox({ pdfPath, title, onClose }) {
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position:       'fixed',
        inset:          0,
        zIndex:         100,
        background:     'rgba(0,0,0,0.75)',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '20px',
      }}
    >
      <button
        onClick={onClose}
        aria-label="Close"
        style={{
          position:       'absolute',
          top:            '16px',
          right:          '20px',
          background:     `linear-gradient(180deg, ${C.btnRedHi} 0%, ${C.btnRed} 55%, ${C.btnRedShadow} 100%)`,
          border:         '2px solid #AA1111',
          borderRadius:   '8px',
          boxShadow:      '0 3px 0 #550000',
          width:          '34px',
          height:         '34px',
          color:          '#fff',
          fontSize:       '14px',
          cursor:         'pointer',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontWeight:     900,
        }}
      >
        ✕
      </button>
      <iframe
        src={pdfPath}
        title={title}
        style={{
          width:        'min(92vw, 860px)',
          height:       'min(88vh, 680px)',
          border:       `3px solid ${C.rim}`,
          borderRadius: '8px',
          background:   '#fff',
        }}
      />
      <div style={{ marginTop: '10px', fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
        Click outside to close
      </div>
    </div>
  );
}

PdfLightbox.propTypes = {
  pdfPath: PropTypes.string.isRequired,
  title:   PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PdfLightbox;
