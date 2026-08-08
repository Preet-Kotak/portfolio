import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal, { C } from './Modal';
import ModalArrow from './ModalArrow';
import skills from '../../data/skills';

/* ── Single skill tile ──────────────────────────────────────────────── */
function SkillTile({ name, logo }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImg = logo && !imgFailed;

  return (
    <div
      title={name}
      style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        width:          '72px',
        height:         '72px',
        borderRadius:   '12px',
        background:     '#FFFFFF',
        border:         '2px solid rgba(255,255,255,0.15)',
        padding:        '8px',
        transition:     'border-color 0.15s, box-shadow 0.15s',
        cursor:         'default',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(240,192,64,0.6)';
        e.currentTarget.style.boxShadow   = '0 0 10px rgba(240,192,64,0.2)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
        e.currentTarget.style.boxShadow   = 'none';
      }}
    >
      {showImg ? (
        <img
          src={`assets/skills/${logo}`}
          alt={name}
          onError={() => setImgFailed(true)}
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
      ) : (
        <span style={{
          fontSize:  '9.5px',
          fontWeight: 700,
          color:      '#333333',
          textAlign:  'center',
          lineHeight: '1.3',
          wordBreak:  'break-word',
        }}>
          {name}
        </span>
      )}
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────────────────── */
function SkillsModal({ isOpen, onClose }) {
  const [page, setPage] = useState(0);
  const total   = skills.length;
  const current = skills[page];

  // Arrow key navigation
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  setPage(p => Math.max(0, p - 1));
      if (e.key === 'ArrowRight') setPage(p => Math.min(total - 1, p + 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, total]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Barracks — Skills">
      <div style={{ padding: '14px 16px 20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>

        {/* ── category tabs — fixed 2-per-row grid ── */}
        <div style={{
          display:               'grid',
          gridTemplateColumns:   'repeat(2, 1fr)',
          gap:                   '6px',
        }}>
          {skills.map((s, i) => (
            <button
              key={s.category}
              onClick={() => setPage(i)}
              style={{
                padding:       '5px 8px',
                borderRadius:  '6px',
                border:        `1px solid ${i === page ? C.gold : 'rgba(255,255,255,0.1)'}`,
                background:    i === page ? 'rgba(240,192,64,0.12)' : 'rgba(255,255,255,0.03)',
                color:         i === page ? C.textGold : C.textMuted,
                fontSize:      '10px',
                fontWeight:    i === page ? 800 : 500,
                cursor:        'pointer',
                transition:    'all 0.15s',
                letterSpacing: '0.04em',
                textAlign:     'center',
                whiteSpace:    'nowrap',
                overflow:      'hidden',
                textOverflow:  'ellipsis',
              }}
            >
              {s.icon} {s.category}
            </button>
          ))}
        </div>

        {/* ── page content: arrows + logo grid — fixed height so modal never shakes ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>

          <ModalArrow dir="left"  disabled={page === 0}         onClick={() => setPage(p => p - 1)} />
          {/* logo grid — fixed height regardless of item count */}
          <div style={{
            flex:           1,
            display:        'flex',
            flexWrap:       'wrap',
            gap:            '10px',
            justifyContent: 'center',
            height:         '180px',
            alignContent:   'center',
            padding:        '8px 0',
            overflow:       'hidden',
          }}>
            {current.items.map(({ name, logo }) => (
              <SkillTile key={name} name={name} logo={logo} />
            ))}
          </div>
          <ModalArrow dir="right" disabled={page === total - 1} onClick={() => setPage(p => p + 1)} />

        </div>

        {/* ── page indicator dots ── */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
          {skills.map((_, i) => (
            <div
              key={i}
              onClick={() => setPage(i)}
              style={{
                width:        i === page ? '18px' : '6px',
                height:       '6px',
                borderRadius: '3px',
                background:   i === page ? C.gold : C.textMuted,
                cursor:       'pointer',
                transition:   'all 0.2s',
              }}
            />
          ))}
        </div>

      </div>
    </Modal>
  );
}

SkillsModal.propTypes = { isOpen: PropTypes.bool.isRequired, onClose: PropTypes.func.isRequired };
SkillTile.propTypes   = { name: PropTypes.string.isRequired, logo: PropTypes.string };

export default SkillsModal;
