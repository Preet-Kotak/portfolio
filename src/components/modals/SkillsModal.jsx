import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal, { C, useMobile } from './Modal';
import ModalArrow from './ModalArrow';
import skills from '../../data/skills';

/* ── Single skill tile ──────────────────────────────────────────────── */
function SkillTile({ name, logo, mobile }) {
  const [imgFailed, setImgFailed] = useState(false);
  const showImg = logo && !imgFailed;
  const sz = mobile ? '56px' : '72px';

  return (
    <div
      title={name}
      style={{
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        width:          sz,
        height:         sz,
        borderRadius:   '10px',
        background:     C.header,
        border:         `2px solid ${C.bgDark}`,
        padding:        mobile ? '6px' : '8px',
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
          fontSize:   mobile ? '8px' : '9px',
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
  const mobile  = useMobile();
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
      <div style={{ padding: mobile ? '10px 10px 14px' : '14px 16px 20px', display: 'flex', flexDirection: 'column', gap: mobile ? '8px' : '12px', background: C.bg }}>

        {/* category tabs */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: mobile ? '4px' : '6px' }}>
          {skills.map((s, i) => (
            <button
              key={s.category}
              onClick={() => setPage(i)}
              style={{
                padding:       mobile ? '5px 6px' : '6px 8px',
                borderRadius:  '8px',
                border:        `2px solid ${i === page ? C.gold : C.bgDark}`,
                background:    i === page
                  ? `linear-gradient(180deg, ${C.btnGreenHi} 0%, ${C.btnGreen} 55%, ${C.btnGreenShadow} 100%)`
                  : C.bgPanel,
                color:         i === page ? '#FFFFFF' : C.textSub,
                fontSize:      mobile ? '9px' : '10px',
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
            gap:            mobile ? '7px' : '10px',
            justifyContent: 'center',
            height:         mobile ? '150px' : '180px',
            alignContent:   'center',
            padding:        '6px 0',
            overflow:       'hidden',
          }}>
            {current.items.map(({ name, logo }) => (
              <SkillTile key={name} name={name} logo={logo} mobile={mobile} />
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
SkillTile.propTypes   = { name: PropTypes.string.isRequired, logo: PropTypes.string, mobile: PropTypes.bool };

export default SkillsModal;
