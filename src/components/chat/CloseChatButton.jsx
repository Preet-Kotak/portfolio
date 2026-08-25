import PropTypes from 'prop-types';

/**
 * Close chat button — rendered inside ChatPanel as a relative element.
 * No fixed positioning — parent positions it just outside the panel's right edge.
 * Aspect ratio of close_chat.png: 70x120
 */
function CloseChatButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      title="Close Chat"
      aria-label="Close chat"
      className="close-chat-btn"
      style={{
        padding:      0,
        border:       'none',
        background:   'transparent',
        cursor:       'pointer',
        outline:      'none',
        userSelect:   'none',
        borderRadius: '6px',
        overflow:     'hidden',
        display:      'block',
        boxShadow:    '0 4px 0 rgba(0,0,0,0.5), 0 6px 14px rgba(0,0,0,0.5)',
        transition:   'filter 0.1s, transform 0.1s, box-shadow 0.1s',
        flexShrink:   0,
      }}
      onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.18)'; }}
      onMouseLeave={e => {
        e.currentTarget.style.filter    = '';
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = '0 4px 0 rgba(0,0,0,0.5), 0 6px 14px rgba(0,0,0,0.5)';
      }}
      onMouseDown={e => {
        e.currentTarget.style.transform  = 'translateY(4px)';
        e.currentTarget.style.boxShadow  = '0 0px 0 rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.4)';
      }}
      onMouseUp={e => {
        e.currentTarget.style.transform  = '';
        e.currentTarget.style.boxShadow  = '0 4px 0 rgba(0,0,0,0.5), 0 6px 14px rgba(0,0,0,0.5)';
      }}
    >
      <img
        src="/assets/close_chat.png"
        alt="Close"
        style={{
          width:          '100%',
          height:         '100%',
          objectFit:      'cover',
          display:        'block',
          imageRendering: 'pixelated',
        }}
      />
    </button>
  );
}

CloseChatButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default CloseChatButton;
