import PropTypes from 'prop-types';

/**
 * CV / Resume button — fixed below the Trophy button, top-left HUD.
 * Uses the message.png image asset, square with rounded corners.
 */
function CvButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      title="View Resume"
      className="hud-btn hud-cv-top"
      style={{
        position:     'fixed',
        top:          '50px',   /* fallback — overridden by .hud-cv-top */
        left:         '10px',
        zIndex:       40,
        padding:      0,
        border:       'none',
        background:   'transparent',
        cursor:       'pointer',
        outline:      'none',
        userSelect:   'none',
        borderRadius: '10px',
        overflow:     'hidden',
        display:      'block',
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
        src="/assets/message-sq.png"
        alt="Resume"
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', filter: 'brightness(1.2) saturate(1.3) contrast(1.05)' }}
      />
    </button>
  );
}

CvButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default CvButton;
