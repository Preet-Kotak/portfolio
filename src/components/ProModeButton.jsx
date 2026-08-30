/**
 * ProModeButton — fixed bottom-right HUD button that switches to Professional view.
 * Matches the CoC wooden-button style used by TrophyButton, CvButton, MusicButton.
 */
import PropTypes from 'prop-types';

export default function ProModeButton({ onClick }) {
  return (
    <button
      onClick={onClick}
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
  );
}

ProModeButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};
