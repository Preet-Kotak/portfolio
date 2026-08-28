import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

// Shared hook — avoids each modal duplicating resize logic
export function useMobile() {
  const [mobile, setMobile] = useState(() => window.innerWidth < 1024);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth < 1024);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return mobile;
}

// CoC UI color palette — warm grey/beige light theme matching in-game modals
export const C = {
  // Modal surfaces
  bg:            '#EDE8DC',   // main panel body — warm light grey
  bgPanel:       '#D8D0C0',   // inset panel / section background
  bgDark:        '#C8C0B0',   // darker inset / separator
  rim:           '#8C7A5A',   // outer wooden rim
  rimLight:      '#B8A070',   // highlight on rim
  header:        '#F5F0E8',   // header bar background

  // Text
  text:          '#2C1A0E',   // primary text — dark brown
  textSub:       '#5A4030',   // secondary text
  textMuted:     '#8A7A6A',   // muted / placeholder text
  textWhite:     '#FFFFFF',

  // Accents
  gold:          '#C88A00',   // gold accent (borders, active states)
  goldLight:     '#E8B040',   // highlight gold
  goldDark:      '#7A5200',   // shadow gold

  // Buttons — green CoC style
  btnGreen:      '#5AB820',   // green button mid
  btnGreenHi:    '#80D830',   // green button top highlight
  btnGreenShadow:'#2A6000',   // green button bottom shadow
  btnGreenBorder:'#3A8010',   // green button border

  // Buttons — gold CoC style (secondary)
  btnGold:       '#D49010',
  btnGoldHi:     '#F0C040',
  btnGoldShadow: '#6B4800',

  // Close button
  btnRed:        '#CC2222',
  btnRedHi:      '#EE4444',
  btnRedShadow:  '#880000',

  // Status / misc
  green:         '#3A9E20',
  textGold:      '#8A6000',   // gold-toned text on light bg
  textSilver:    '#6A6A7A',   // silver-toned text on light bg
};

/**
 * Base modal shell — CoC light warm-grey theme.
 * On mobile (<1024px) everything is scaled down to leave breathing room.
 */
function Modal({ isOpen, onClose, title, width = 'min(94vw, 440px)', children }) {
  const mobile = useMobile();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

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
        padding:         mobile ? '8px' : '16px',
        backgroundColor: 'rgba(0,0,0,0.55)',
      }}
    >
      {/* wooden outer rim */}
      <div style={{
        width:        mobile ? 'min(98vw, 400px)' : width,
        borderRadius: '14px',
        padding:      '3px',
        background:   `linear-gradient(180deg, ${C.rimLight} 0%, ${C.rim} 60%, #5A3E20 100%)`,
        boxShadow:    '0 8px 40px rgba(0,0,0,0.7), 0 2px 0 rgba(255,255,255,0.15) inset',
      }}>
        {/* inner light border */}
        <div style={{
          borderRadius: '12px',
          padding:      '2px',
          background:   `linear-gradient(180deg, #E0D8C8 0%, #B0A890 100%)`,
        }}>
          {/* panel body */}
          <div style={{
            borderRadius: '10px',
            overflow:     'hidden',
            background:   C.bg,
            fontFamily:   '"Segoe UI", system-ui, -apple-system, sans-serif',
            maxHeight:    mobile ? 'calc(100dvh - 24px)' : 'calc(100dvh - 48px)',
            display:      'flex',
            flexDirection:'column',
          }}>

            {/* header bar */}
            <div style={{
              background:     C.header,
              borderBottom:   `2px solid ${C.bgDark}`,
              padding:        mobile ? '7px 10px' : '10px 14px',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
              gap:            '8px',
              flexShrink:     0,
            }}>
              {/* spacer to balance close button */}
              <div style={{ width: mobile ? '26px' : '30px', flexShrink: 0 }} />

              <span style={{
                color:         C.text,
                fontSize:      mobile ? '11px' : '13px',
                fontWeight:    900,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                flex:          1,
                textAlign:     'center',
              }}>
                {title}
              </span>

              {/* Red X close button */}
              <button
                onClick={onClose}
                aria-label="Close"
                style={{
                  width:          mobile ? '26px' : '30px',
                  height:         mobile ? '26px' : '30px',
                  borderRadius:   '7px',
                  border:         `2px solid #AA1111`,
                  background:     `linear-gradient(180deg, ${C.btnRedHi} 0%, ${C.btnRed} 55%, ${C.btnRedShadow} 100%)`,
                  boxShadow:      `0 3px 0 #550000, 0 4px 8px rgba(0,0,0,0.4)`,
                  color:          '#FFFFFF',
                  fontSize:       mobile ? '11px' : '13px',
                  cursor:         'pointer',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  fontWeight:     900,
                  flexShrink:     0,
                  transition:     'filter 0.1s',
                  lineHeight:     1,
                }}
                onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.15)'; }}
                onMouseLeave={e => {
                  e.currentTarget.style.filter    = '';
                  e.currentTarget.style.transform = '';
                  e.currentTarget.style.boxShadow = `0 3px 0 #550000, 0 4px 8px rgba(0,0,0,0.4)`;
                }}
                onMouseDown={e => {
                  e.currentTarget.style.transform  = 'translateY(3px)';
                  e.currentTarget.style.boxShadow  = '0 0px 0 #550000';
                }}
                onMouseUp={e => {
                  e.currentTarget.style.transform  = '';
                  e.currentTarget.style.boxShadow  = `0 3px 0 #550000, 0 4px 8px rgba(0,0,0,0.4)`;
                }}
              >
                ✕
              </button>
            </div>

            {/* body — scrollable on small screens */}
            <div style={{ overflowY: 'auto', flex: 1, WebkitOverflowScrolling: 'touch' }}>
              {children}
            </div>

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
