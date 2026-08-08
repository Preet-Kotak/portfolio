import { useEffect } from 'react';
import PropTypes from 'prop-types';

// Shared color tokens — same palette used across all CoC modals
export const C = {
  bg:            '#1A2340',
  bgLight:       '#223060',
  rim:           '#0A0F1E',
  gold:          '#F0C040',
  goldLight:     '#FFE480',
  goldDark:      '#8B6800',
  textGold:      '#F0C040',
  textSilver:    '#B8C8E8',
  textMuted:     '#6878A8',
  btnGold:       '#D49010',
  btnGoldHi:     '#F0C040',
  btnGoldShadow: '#6B4800',
};

/**
 * Base modal shell used by all CoC-themed modals.
 *
 * Provides:
 *  - Fixed overlay with click-outside-to-close
 *  - Escape key handler
 *  - Outer rim + gold rim + panel chrome
 *  - Gradient header bar with title and close button
 *  - Body wrapper (children rendered inside)
 *
 * Props:
 *  isOpen   — controls visibility
 *  onClose  — called when overlay, X button, or Escape is triggered
 *  title    — text shown in the header bar (uppercase)
 *  width    — optional CSS value for panel width (default: 'min(94vw, 440px)')
 *  children — modal body content
 */
function Modal({ isOpen, onClose, title, width = 'min(94vw, 440px)', children }) {
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  // Intentionally not locking body scroll — the game canvas handles its own
  // overflow and the modal is fixed-position, so no scroll lock is needed.

  if (!isOpen) return null;

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position:        'fixed',
        inset:           0,
        zIndex:          50,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        padding:         '16px',
        backgroundColor: 'rgba(0,0,0,0.45)',
      }}
    >
      {/* outer rim */}
      <div style={{
        width:        width,
        borderRadius: '18px',
        padding:      '3px',
        background:   C.rim,
        boxShadow:    '0 0 60px rgba(240,192,64,0.15), 0 32px 80px rgba(0,0,0,0.85)',
      }}>
        {/* gold rim */}
        <div style={{
          borderRadius: '16px',
          padding:      '2px',
          background:   `linear-gradient(180deg, ${C.goldLight} 0%, ${C.goldDark} 100%)`,
        }}>
          {/* panel */}
          <div style={{
            borderRadius: '14px',
            overflow:     'hidden',
            background:   C.bg,
            fontFamily:   'system-ui, -apple-system, sans-serif',
          }}>

            {/* header bar */}
            <div style={{
              background:     `linear-gradient(180deg, #0E1628 0%, ${C.bgLight} 100%)`,
              borderBottom:   `1px solid rgba(240,192,64,0.25)`,
              padding:        '12px 16px 10px',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
            }}>
              <span style={{
                color:         C.textGold,
                fontSize:      '11px',
                fontWeight:    800,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                flex:          1,
                textAlign:     'center',
              }}>
                {title}
              </span>
              <button
                onClick={onClose}
                aria-label="Close"
                style={{
                  width:          '26px',
                  height:         '26px',
                  borderRadius:   '50%',
                  border:         `1px solid ${C.textMuted}`,
                  background:     'rgba(255,255,255,0.05)',
                  color:          C.textSilver,
                  fontSize:       '12px',
                  cursor:         'pointer',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  fontWeight:     700,
                  flexShrink:     0,
                  transition:     'all 0.1s',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
                  e.currentTarget.style.color = '#fff';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                  e.currentTarget.style.color = C.textSilver;
                }}
              >
                ✕
              </button>
            </div>

            {/* body */}
            {children}

          </div>
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  isOpen:   PropTypes.bool.isRequired,
  onClose:  PropTypes.func.isRequired,
  title:    PropTypes.string.isRequired,
  width:    PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default Modal;
