import PropTypes from 'prop-types';
import { C } from './Modal';

/**
 * Shared left/right navigation arrow used across all paginated modals.
 * White when a page exists in that direction, grey when at the edge.
 */
function ModalArrow({ dir, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === 'left' ? 'Previous' : 'Next'}
      style={{
        background: 'none',
        border:     'none',
        cursor:     disabled ? 'default' : 'pointer',
        padding:    '4px 6px',
        fontSize:   '22px',
        color:      disabled ? C.textMuted : '#FFFFFF',
        transition: 'color 0.15s',
        flexShrink: 0,
        lineHeight: 1,
      }}
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
