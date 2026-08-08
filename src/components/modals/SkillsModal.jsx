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
        borderRadius:   '10px',
        background:     C.header,
        border:         `2px solid ${C.bgDark}`,
        padding:        '8px',
        transition:     'border-color 0.15s, box-shadow 0.15s',
        cursor:         'default',
        boxShadow:      'inset 0 1px 0 rgba(255,255,255,0.6)',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = C.gold;
        e.currentTarget.style.boxShadow   = `0 0 8px rgba(200,138,0,0.3), inset 0 1px 0 rgba(255,255,255,0.6)`;
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = C.bgDark;
        e.currentTarget.style.boxShadow   = 'inset 0 1px 0 rgba(255,255,255,0.6)';
      }}
    >
      {showImg ? (
        <img
          src={`/assets/skills/${logo}`}
          alt={name}
          onError={() => setImgFailed(true)}
          style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block' }}
        />
      ) : (
        <span style={{
          fontSize:   '9px',
          fontWeight: 700,
          color:      C.textSub,
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
      <div style={{ padding: '14px 16px 20px', display: 'flex', flexDirection: 'column', gap: '12px', background: C.bg }}>

        {/* category tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
          {skills.map((s, i) => (
            <button
              key={s.category}
              onClick={() => setPage(i)}
              style={{
                padding:       '6px 8px',
                borderRadius:  '8px',
                border:        `2px solid ${i === page ? C.gold : C.bgDark}`,
                background:    i === page
                  ? `linear-gradient(180deg, ${C.btnGreenHi} 0%, ${C.btnGreen} 55%, ${C.btnGreenShadow} 100%)`
                  : C.bgPanel,
                color:         i === page ? '#FFFFFF' : C.textSub,
                fontSize:      '10px',
                fontWeight:    800,
                cursor:        'pointer',
                transition:    'all 0.15s',
                letterSpacing: '0.04em',
                textAlign:     'center',
                whiteSpace:    'nowrap',
                overflow:      'hidden',
                textOverflow:  'ellipsis',
                boxShadow:     i === page ? `0 2px 0 ${C.btnGreenShadow}` : 'inset 0 1px 0 rgba(255,255,255,0.5)',
                textShadow:    i === page ? '0 1px 2px rgba(0,0,0,0.4)' : 'none',
              }}
            >
              {s.icon} {s.category}
            </button>
          ))}
        </div>

        {/* skill grid with arrows */}
        <div style={{
          background:   C.bgPanel,
          borderRadius: '10px',
          border:       `1px solid ${C.bgDark}`,
          boxShadow:    'inset 0 2px 4px rgba(0,0,0,0.1)',
          display:      'flex',
          alignItems:   'center',
          gap:          '4px',
          padding:      '4px',
        }}>
          <ModalArrow dir="left"  disabled={page === 0}         onClick={() => setPage(p => p - 1)} />
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

        {/* dot indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
          {skills.map((_, i) => (
            <div
              key={i}
              onClick={() => setPage(i)}
              style={{
                width:        i === page ? '18px' : '6px',
                height:       '6px',
                borderRadius: '3px',
                background:   i === page ? C.gold : C.bgDark,
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
