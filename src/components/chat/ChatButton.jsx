import PropTypes from 'prop-types';

/**
 * Chat open button — fixed left side, vertically centered.
 * Uses chat_button.png. Sized via .chat-btn CSS class to match HUD buttons.
 * Uses 50svh (small viewport height) to prevent jitter on mobile when
 * the browser address bar shows/hides.
 */
function ChatButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      title="Open Chat"
      aria-label="Open chat"
      className="chat-btn"
      style={{
        position:     'fixed',
        left:         '10px',
        /* 50svh = stable viewport center — doesn't shift when mobile browser
           chrome appears/disappears. Falls back to 50% on older browsers. */
        top:          'calc(50svh - 0px)',
        transform:    'translateY(-50%)',
        zIndex:       40,
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
        transition:   'filter 0.1s, box-shadow 0.1s',
        animation:    'chatPulse 2.5s ease-in-out infinite',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.filter    = 'brightness(1.18)';
        e.currentTarget.style.animation = 'none';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.filter    = '';
        e.currentTarget.style.animation = 'chatPulse 2.5s ease-in-out infinite';
      }}
      onMouseDown={e => {
        e.currentTarget.style.boxShadow = '0 0px 0 rgba(0,0,0,0.5), 0 2px 6px rgba(0,0,0,0.4)';
        e.currentTarget.style.animation = 'none';
      }}
      onMouseUp={e => {
        e.currentTarget.style.boxShadow = '0 4px 0 rgba(0,0,0,0.5), 0 6px 14px rgba(0,0,0,0.5)';
      }}
    >
      <img
        src="/assets/chat_button.png"
        alt="Chat"
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

ChatButton.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default ChatButton;
