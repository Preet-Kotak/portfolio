import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal, { C } from './Modal';
import ModalArrow from './ModalArrow';
import about from '../../data/about';

/* ── Hex avatar ─────────────────────────────────────────────────────── */
function HexAvatar({ size = 80 }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div style={{
        position:   'absolute',
        inset:      0,
        clipPath:   'polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)',
        background: `linear-gradient(180deg, ${C.goldLight} 0%, ${C.goldDark} 100%)`,
      }} />
      <div style={{
        position:   'absolute',
        inset:      '4px',
        clipPath:   'polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)',
        overflow:   'hidden',
        background: C.bgPanel,
      }}>
        <img
          src={about.avatar}
          alt={about.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.parentElement.innerHTML =
              '<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:2rem;">👨‍💻</div>';
          }}
        />
      </div>
    </div>
  );
}

/* ── Bio card ───────────────────────────────────────────────────────── */
function BioCard({ title, lines }) {
  return (
    <div style={{
      flex:         1,
      borderRadius: '10px',
      padding:      '14px 15px',
      background:   C.bgPanel,
      border:       `1px solid ${C.bgDark}`,
      boxShadow:    'inset 0 2px 4px rgba(0,0,0,0.08), inset 0 -1px 0 rgba(255,255,255,0.5)',
      minHeight:    '90px',
    }}>
      <div style={{
        fontSize:      '9px',
        fontWeight:    800,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color:         C.textGold,
        marginBottom:  '7px',
        borderBottom:  `1px solid ${C.bgDark}`,
        paddingBottom: '5px',
      }}>
        {title}
      </div>
      {lines.map((line, i) => (
        <div key={i} style={{
          fontSize:     '11.5px',
          lineHeight:   '1.7',
          color:        C.textSub,
          marginBottom: i < lines.length - 1 ? '4px' : 0,
        }}>
          {line}
        </div>
      ))}
    </div>
  );
}

/* ── Green action button ─────────────────────────────────────────────── */
function ActionBtn({ label, href, external }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '8px 20px',
        borderRadius:   '10px',
        textDecoration: 'none',
        background:     `linear-gradient(180deg, ${C.btnGreenHi} 0%, ${C.btnGreen} 55%, ${C.btnGreenShadow} 100%)`,
        border:         `2px solid ${C.btnGreenBorder}`,
        boxShadow:      `0 4px 0 ${C.btnGreenShadow}, 0 6px 12px rgba(0,0,0,0.25)`,
        fontSize:       '11px',
        fontWeight:     800,
        color:          '#FFFFFF',
        letterSpacing:  '0.05em',
        cursor:         'pointer',
        userSelect:     'none',
        transition:     'all 0.08s',
        textTransform:  'uppercase',
        minWidth:       '100px',
        textShadow:     '0 1px 2px rgba(0,0,0,0.4)',
      }}
      onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)'; }}
      onMouseLeave={e => {
        e.currentTarget.style.filter    = '';
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = `0 4px 0 ${C.btnGreenShadow}, 0 6px 12px rgba(0,0,0,0.25)`;
      }}
      onMouseDown={e => {
        e.currentTarget.style.transform = 'translateY(3px)';
        e.currentTarget.style.boxShadow = `0 1px 0 ${C.btnGreenShadow}`;
      }}
      onMouseUp={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = `0 4px 0 ${C.btnGreenShadow}, 0 6px 12px rgba(0,0,0,0.25)`;
      }}
    >
      {label}
    </a>
  );
}

/* ── Main ────────────────────────────────────────────────────────────── */
function AboutModal({ isOpen, onClose }) {
  const [cardPage, setCardPage] = useState(0);
  const cards = about.cards;
  const total  = cards.length;

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'ArrowLeft')  setCardPage(p => Math.max(0, p - 1));
      if (e.key === 'ArrowRight') setCardPage(p => Math.min(total - 1, p + 1));
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, total]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Player Profile">
      <div style={{ padding: '22px 18px 26px', display: 'flex', flexDirection: 'column', gap: '20px', background: C.bg }}>

        {/* avatar + name row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <HexAvatar size={92} />
          <div style={{ flex: 1 }}>
            <div style={{
              fontSize:      'clamp(18px, 4vw, 22px)',
              fontWeight:    900,
              color:         C.text,
              letterSpacing: '0.02em',
              lineHeight:    1.1,
              marginBottom:  '6px',
            }}>
              {about.name}
            </div>
            <div style={{
              display:       'inline-flex',
              alignItems:    'center',
              background:    `linear-gradient(180deg, ${C.btnGreenHi} 0%, ${C.btnGreen} 100%)`,
              border:        `1px solid ${C.btnGreenBorder}`,
              borderRadius:  '6px',
              padding:       '3px 10px',
              fontSize:      '10px',
              fontWeight:    800,
              color:         '#FFFFFF',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              marginBottom:  '6px',
              textShadow:    '0 1px 2px rgba(0,0,0,0.4)',
            }}>
              {about.tagline}
            </div>
            <div style={{ fontSize: '11px', color: C.textMuted, lineHeight: '1.5' }}>
              {about.email}
            </div>
          </div>
        </div>

        {/* bio card — paginated */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ModalArrow dir="left"  disabled={cardPage === 0}         onClick={() => setCardPage(p => p - 1)} />
          <BioCard {...cards[cardPage]} />
          <ModalArrow dir="right" disabled={cardPage === total - 1} onClick={() => setCardPage(p => p + 1)} />
        </div>

        {/* dot indicators */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '-8px' }}>
          {cards.map((_, i) => (
            <div
              key={i}
              onClick={() => setCardPage(i)}
              style={{
                width:        i === cardPage ? '18px' : '6px',
                height:       '6px',
                borderRadius: '3px',
                background:   i === cardPage ? C.gold : C.bgDark,
                cursor:       'pointer',
                transition:   'all 0.2s',
              }}
            />
          ))}
        </div>

        {/* action buttons */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
          {about.links.map((l) => (
            <ActionBtn key={l.label} label={l.label} href={l.href} external={l.external} />
          ))}
        </div>

      </div>
    </Modal>
  );
}

AboutModal.propTypes = { isOpen: PropTypes.bool.isRequired, onClose: PropTypes.func.isRequired };
HexAvatar.propTypes  = { size: PropTypes.number };
BioCard.propTypes    = { title: PropTypes.string.isRequired, lines: PropTypes.arrayOf(PropTypes.string).isRequired };
ActionBtn.propTypes  = { label: PropTypes.string.isRequired, href: PropTypes.string.isRequired, external: PropTypes.bool.isRequired };

export default AboutModal;
