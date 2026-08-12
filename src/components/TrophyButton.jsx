import PropTypes from 'prop-types';

/**
 * Trophy button — CoC-style HUD element, top-left.
 * Square button using the trophy image, with a separate
 * grey translucent pill to the right showing the CF rating.
 */
function TrophyButton({ cfRating, onClick }) {
  return (
    <div style={{
      position:    'fixed',
      top:         '10px',
      left:        '10px',
      zIndex:      40,
      display:     'flex',
      alignItems:  'center',
      gap:         '0px',
    }}>
      {/* ── Square image button ── */}
      <button
        onClick={onClick}
        title="Open Trophy Room"
        className="hud-btn"
        style={{
          padding:      0,
          border:       'none',
          background:   'transparent',
          cursor:       'pointer',
          outline:      'none',
          userSelect:   'none',
          borderRadius: '10px',
          overflow:     'hidden',
          display:      'block',
          flexShrink:   0,
          boxShadow:    '0 4px 0 rgba(0,0,0,0.5), 0 6px 14px rgba(0,0,0,0.45)',
          transition:   'filter 0.1s, transform 0.1s, box-shadow 0.1s',
        }}
        onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.15)'; }}
        onMouseLeave={e => {
          e.currentTarget.style.filter    = '';
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
        <img
          src="/assets/throphy-sq.png"
          alt="Trophy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(1.2) saturate(1.3) contrast(1.05)' }}
        />
      </button>

      {/* ── Dark translucent rating pill ── */}
      <div style={{
        background:     'rgba(20,20,20,0.72)',
        backdropFilter: 'blur(4px)',
        borderRadius:   '0 10px 10px 0',
        padding:        '6px 10px',
        minWidth:       '40px',
        textAlign:      'center',
        /* alternating white/black border — top & right white, bottom & left black */
        borderTop:      '1.5px solid rgba(255,255,255,0.55)',
        borderRight:    '1.5px solid rgba(255,255,255,0.55)',
        borderBottom:   '1.5px solid rgba(0,0,0,0.8)',
        borderLeft:     'none',
        boxShadow:      '0 2px 8px rgba(0,0,0,0.5)',
      }}>
        <span style={{
          fontSize:      '14px',
          fontWeight:    900,
          color:         '#FFFFFF',
          textShadow:    '0 1px 3px rgba(0,0,0,0.7)',
          letterSpacing: '0.02em',
          lineHeight:    1,
          fontFamily:    'system-ui, -apple-system, sans-serif',
        }}>
          {cfRating === null ? '…' : cfRating === 'err' ? '—' : cfRating}
        </span>
      </div>
    </div>
  );
}

TrophyButton.propTypes = {
  cfRating: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onClick:  PropTypes.func.isRequired,
};

TrophyButton.defaultProps = {
  cfRating: null,
};

export default TrophyButton;
