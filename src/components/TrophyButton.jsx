import PropTypes from 'prop-types';

/**
 * Trophy button — fixed top-left HUD element.
 * Shows 🏆 icon + Codeforces rating.
 * Click opens the Trophy Room modal.
 */
function TrophyButton({ cfRating, onClick }) {
  return (
    <button
      onClick={onClick}
      title="Open Trophy Room"
      style={{
        position:       'fixed',
        top:            '16px',
        left:           '16px',
        zIndex:         40,
        display:        'flex',
        alignItems:     'center',
        gap:            '9px',
        padding:        '10px 18px 10px 14px',
        borderRadius:   '12px',
        cursor:         'pointer',
        border:         '2px solid #C87A00',
        background:     'linear-gradient(180deg, #FFD94A 0%, #E08800 55%, #B36300 100%)',
        boxShadow:      '0 5px 0 #7A3E00, 0 8px 18px rgba(0,0,0,0.55)',
        userSelect:     'none',
        transition:     'filter 0.1s',
        outline:        'none',
        fontFamily:     'system-ui, -apple-system, sans-serif',
      }}
      onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.12)'; }}
      onMouseLeave={e => {
        e.currentTarget.style.filter    = '';
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '0 5px 0 #7A3E00, 0 8px 18px rgba(0,0,0,0.55)';
      }}
      onMouseDown={e => {
        e.currentTarget.style.transform  = 'translateY(4px)';
        e.currentTarget.style.boxShadow  = '0 1px 0 #7A3E00, 0 2px 6px rgba(0,0,0,0.5)';
      }}
      onMouseUp={e => {
        e.currentTarget.style.transform  = '';
        e.currentTarget.style.boxShadow  = '0 5px 0 #7A3E00, 0 8px 18px rgba(0,0,0,0.55)';
      }}
    >
      {/* Trophy icon */}
      <span style={{
        fontSize:   '22px',
        lineHeight: 1,
        filter:     'drop-shadow(0 1px 2px rgba(0,0,0,0.45))',
      }}>
        🏆
      </span>

      {/* Rating */}
      <span style={{
        fontSize:      '16px',
        fontWeight:    900,
        color:         '#1A0A00',
        letterSpacing: '0.04em',
        lineHeight:    1,
        minWidth:      '32px',
        textAlign:     'center',
        textShadow:    '0 1px 0 rgba(255,255,255,0.35)',
      }}>
        {cfRating === null ? '…' : cfRating === 'err' ? '—' : cfRating}
      </span>
    </button>
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
