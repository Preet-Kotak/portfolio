import PropTypes from 'prop-types';
import { C } from './Modal';

/**
 * Shared left/right navigation arrow used across all paginated modals.
 */
function ModalArrow({ dir, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'left' ? 'Previous' : 'Next'}
      style={{
        background:  disabled ? C.bgPanel : `linear-gradient(180deg, ${C.btnGreenHi} 0%, ${C.btnGreen} 55%, ${C.btnGreenShadow} 100%)`,
        border:      `2px solid ${disabled ? C.bgDark : C.btnGreenBorder}`,
        borderRadius:'8px',
        boxShadow:   disabled ? 'none' : `0 2px 0 ${C.btnGreenShadow}`,
        cursor:      disabled ? 'default' : 'pointer',
        padding:     '4px 8px',
        fontSize:    '18px',
        color:       disabled ? C.textMuted : '#FFFFFF',
        transition:  'all 0.1s',
        flexShrink:  0,
        lineHeight:  1,
        textShadow:  disabled ? 'none' : '0 1px 2px rgba(0,0,0,0.4)',
        minWidth:    '30px',
        textAlign:   'center',
      }}
      onMouseEnter={e => { if (!disabled) e.currentTarget.style.filter = 'brightness(1.1)'; }}
      onMouseLeave={e => { e.currentTarget.style.filter = ''; e.currentTarget.style.transform = ''; }}
      onMouseDown={e => { if (!disabled) { e.currentTarget.style.transform = 'translateY(2px)'; e.currentTarget.style.boxShadow = 'none'; }}}
      onMouseUp={e => { e.currentTarget.style.transform = ''; if (!disabled) e.currentTarget.style.boxShadow = `0 2px 0 ${C.btnGreenShadow}`; }}
    >
      {dir === 'left' ? '‹' : '›'}
    </button>
  );
}

ModalArrow.propTypes = {
  dir:      PropTypes.oneOf(['left', 'right']).isRequired,
  disabled: PropTypes.bool.isRequired,
  onClick:  PropTypes.func.isRequired,
};

export default ModalArrow;
