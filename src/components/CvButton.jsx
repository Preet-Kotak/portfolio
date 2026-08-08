import PropTypes from 'prop-types';

/**
 * CV button — fixed below the Trophy button, top-left HUD.
 * Click opens the resume PDF lightbox.
 */
function CvButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      title="View Resume"
      style={{
        position:       'fixed',
        top:            '72px',
        left:           '16px',
        zIndex:         40,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '10px 14px',
        borderRadius:   '12px',
        cursor:         'pointer',
        border:         '2px solid #C87A00',
        background:     'linear-gradient(180deg, #FFD94A 0%, #E08800 55%, #B36300 100%)',
        boxShadow:      '0 5px 0 #7A3E00, 0 8px 18px rgba(0,0,0,0.55)',
        userSelect:     'none',
        outline:        'none',
        fontFamily:     'system-ui, -apple-system, sans-serif',
        transition:     'filter 0.1s',
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
      <span style={{
        fontSize:   '22px',
        lineHeight: 1,
        filter:     'drop-shadow(0 1px 2px rgba(0,0,0,0.45))',
      }}>
        📄
      </span>
    </button>
  );
}

CvButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default CvButton;
