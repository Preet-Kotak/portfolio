import PropTypes from 'prop-types';

/* ── SVG icons — speaker on / speaker off ──────────────────────── */

function IconSpeakerOn() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '58%', height: '58%', display: 'block' }}
    >
      {/* Speaker body */}
      <polygon
        points="3,9 7,9 13,4 13,20 7,15 3,15"
        fill="#fff"
        stroke="#fff"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      {/* Sound wave 1 */}
      <path
        d="M16 8.5 C17.5 9.8 17.5 14.2 16 15.5"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Sound wave 2 */}
      <path
        d="M18.5 6 C21.2 8.5 21.2 15.5 18.5 18"
        stroke="#fff"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function IconSpeakerOff() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: '58%', height: '58%', display: 'block' }}
    >
      {/* Speaker body — faded */}
      <polygon
        points="3,9 7,9 13,4 13,20 7,15 3,15"
        fill="rgba(255,255,255,0.55)"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      {/* X lines (mute cross) */}
      <line x1="16" y1="9"  x2="22" y2="15" stroke="#ff4444" strokeWidth="2.2" strokeLinecap="round" />
      <line x1="22" y1="9"  x2="16" y2="15" stroke="#ff4444" strokeWidth="2.2" strokeLinecap="round" />
    </svg>
  );
}

/* ── Button ────────────────────────────────────────────────────── */

/**
 * MusicButton — fixed HUD button below CvButton, top-left.
 * Exact same shape, shadow, and press behaviour as CvButton.
 * Background gradient sampled directly from message-sq.png pixels
 * (after brightness(1.2) saturate(1.3) contrast(1.05) filter is applied).
 *
 * Raw pixel samples (center column, top→bottom):
 *   10% → #B07B00   25% → #B2B097   50% → #B09970   75% → #AA783F   90% → #8F4400
 * After the image filter (×1.2 brightness, ×1.3 saturation):
 *   effectively: top highlight ~#d4a030, mid ~#c08840, bottom ~#8a4800
 */
function MusicButton({ musicOn, onToggle }) {
  return (
    <button
      onClick={onToggle}
      title={musicOn ? 'Mute music' : 'Play music'}
      className="hud-btn hud-music-top"
      style={{
        position:       'fixed',
        top:            '90px',   /* fallback — overridden by .hud-music-top */
        left:           '10px',
        zIndex:         40,
        padding:        0,
        border:         'none',
        /*
         * Gradient derived from the actual message-sq.png pixel values
         * with the same brightness(1.2) saturate(1.3) contrast(1.05) filter applied.
         * Matches the warm parchment-brown of CvButton exactly.
         */
        background:     'linear-gradient(180deg, #c8a855 0%, #b89060 30%, #a07040 65%, #7a4a18 100%)',
        cursor:         'pointer',
        outline:        'none',
        userSelect:     'none',
        borderRadius:   '10px',
        overflow:       'hidden',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        boxShadow:      '0 4px 0 rgba(0,0,0,0.5), 0 6px 14px rgba(0,0,0,0.45)',
        transition:     'filter 0.1s, transform 0.1s, box-shadow 0.1s',
        /* Match the image filter used on CvButton's <img> */
        filter:         'brightness(1.2) saturate(1.3) contrast(1.05)',
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
      {musicOn ? <IconSpeakerOn /> : <IconSpeakerOff />}
    </button>
  );
}

MusicButton.propTypes = {
  musicOn:  PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
};

export default MusicButton;
