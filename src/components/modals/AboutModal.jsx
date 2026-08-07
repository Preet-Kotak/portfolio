import { useEffect } from 'react';
import PropTypes from 'prop-types';

const C = {
  bg:           '#1A2340',
  bgLight:      '#223060',
  bgStripe:     '#141C33',
  gold:         '#F0C040',
  goldLight:    '#FFE480',
  goldDark:     '#8B6800',
  rim:          '#0A0F1E',
  textWhite:    '#FFFFFF',
  textSilver:   '#B8C8E8',
  textGold:     '#F0C040',
  textMuted:    '#6878A8',
  btnGold:      '#D49010',
  btnGoldHi:    '#F0C040',
  btnGoldShadow:'#6B4800',
};

/* ── Hex avatar (no badge) ── */
function HexAvatar({ size = 80 }) {
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <div style={{
        position: 'absolute', inset: 0,
        clipPath: 'polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)',
        background: `linear-gradient(180deg, ${C.goldLight} 0%, ${C.goldDark} 100%)`,
      }} />
      <div style={{
        position: 'absolute', inset: '4px',
        clipPath: 'polygon(50% 0%,93% 25%,93% 75%,50% 100%,7% 75%,7% 25%)',
        overflow: 'hidden',
        background: C.bgStripe,
      }}>
        <img
          src="assets/profile.jpg"
          alt="Preet"
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

/* ── Glassmorphism bio card ── */
function BioCard({ title, lines }) {
  return (
    <div style={{
      minWidth:        'min(58vw, 170px)',
      flexShrink:      0,
      scrollSnapAlign: 'start',
      borderRadius:    '12px',
      padding:         '16px 15px',
      background:      'rgba(255,255,255,0.05)',
      backdropFilter:  'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      border:          '1px solid rgba(255,255,255,0.1)',
      boxShadow:       'inset 0 1px 0 rgba(255,255,255,0.08)',
    }}>
      <div style={{
        fontSize:      '9px',
        fontWeight:    800,
        letterSpacing: '0.14em',
        textTransform: 'uppercase',
        color:         C.gold,
        marginBottom:  '7px',
        borderBottom:  '1px solid rgba(240,192,64,0.2)',
        paddingBottom: '5px',
      }}>
        {title}
      </div>
      {lines.map((line, i) => (
        <div key={i} style={{
          fontSize:    '11.5px',
          lineHeight:  '1.7',
          color:       C.textSilver,
          marginBottom: i < lines.length - 1 ? '4px' : 0,
        }}>
          {line}
        </div>
      ))}
    </div>
  );
}

/* ── Gold action button ── */
function ActionBtn({ label, href, external }) {
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      style={{
        flex:           1,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '13px 6px',
        borderRadius:   '10px',
        textDecoration: 'none',
        background:     `linear-gradient(180deg, ${C.btnGoldHi} 0%, ${C.btnGold} 55%, #A06800 100%)`,
        border:         `2px solid ${C.goldLight}`,
        boxShadow:      `0 5px 0 ${C.btnGoldShadow}, 0 8px 16px rgba(0,0,0,0.4)`,
        fontSize:       'clamp(11px, 2.5vw, 13px)',
        fontWeight:     800,
        color:          '#1A0A00',
        letterSpacing:  '0.05em',
        cursor:         'pointer',
        userSelect:     'none',
        transition:     'all 0.08s',
        textTransform:  'uppercase',
      }}
      onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.12)'; }}
      onMouseLeave={e => {
        e.currentTarget.style.filter = '';
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = `0 5px 0 ${C.btnGoldShadow}, 0 8px 16px rgba(0,0,0,0.4)`;
      }}
      onMouseDown={e => {
        e.currentTarget.style.transform = 'translateY(4px)';
        e.currentTarget.style.boxShadow = `0 1px 0 ${C.btnGoldShadow}`;
      }}
      onMouseUp={e => {
        e.currentTarget.style.transform = '';
        e.currentTarget.style.boxShadow = `0 5px 0 ${C.btnGoldShadow}, 0 8px 16px rgba(0,0,0,0.4)`;
      }}
    >
      {label}
    </a>
  );
}

/* ── Main ── */
function AboutModal({ isOpen, onClose }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    if (isOpen) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  if (!isOpen) return null;

  const cards = [
    {
      title: 'About',
      lines: [
        'B.Tech CSE @ SVNIT Surat (CGPA 7.95)',
        'Full-stack developer & competitive programmer.',
        'Passionate about clean architecture and low-level systems.',
      ],
    },
    {
      title: 'Stack',
      lines: [
        'C/C++, JavaScript, Python, 8086 Assembly',
        'React, Node.js, Express, Tailwind, discord.py',
        'MongoDB, PostgreSQL, Redis, Supabase',
      ],
    },
    {
      title: 'Building',
      lines: [
        'Real-time auction platform (BidKar)',
        'CoC tournament Discord bot (5k+ lines)',
        '8086 Assembly calculator with custom math engine',
      ],
    },
    {
      title: 'Goals',
      lines: [
        'Ship projects people actually use',
        'Land a strong internship — open to opportunities',
      ],
    },
  ];

  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position:        'fixed',
        inset:           0,
        zIndex:          50,
        display:         'flex',
        alignItems:      'center',
        justifyContent:  'center',
        padding:         '16px',
        backgroundColor: 'rgba(0,0,0,0.88)',
      }}
    >
      {/* outer rim */}
      <div style={{
        width:        'min(94vw, 440px)',
        borderRadius: '18px',
        padding:      '3px',
        background:   C.rim,
        boxShadow:    '0 0 60px rgba(240,192,64,0.15), 0 32px 80px rgba(0,0,0,0.85)',
      }}>
        {/* gold rim */}
        <div style={{
          borderRadius: '16px',
          padding:      '2px',
          background:   `linear-gradient(180deg, ${C.goldLight} 0%, ${C.goldDark} 100%)`,
        }}>
          {/* panel */}
          <div style={{
            borderRadius: '14px',
            overflow:     'hidden',
            background:   C.bg,
            fontFamily:   'system-ui, -apple-system, sans-serif',
          }}>

            {/* header */}
            <div style={{
              background:     `linear-gradient(180deg, #0E1628 0%, ${C.bgLight} 100%)`,
              borderBottom:   `1px solid rgba(240,192,64,0.25)`,
              padding:        '12px 16px 10px',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'space-between',
            }}>
              <span style={{
                color:         C.textGold,
                fontSize:      '11px',
                fontWeight:    800,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                flex:          1,
                textAlign:     'center',
              }}>
                Player Profile
              </span>
              <button
                onClick={onClose}
                aria-label="Close"
                style={{
                  width:          '26px',
                  height:         '26px',
                  borderRadius:   '50%',
                  border:         `1px solid ${C.textMuted}`,
                  background:     'rgba(255,255,255,0.05)',
                  color:          C.textSilver,
                  fontSize:       '12px',
                  cursor:         'pointer',
                  display:        'flex',
                  alignItems:     'center',
                  justifyContent: 'center',
                  fontWeight:     700,
                  flexShrink:     0,
                  transition:     'all 0.1s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = C.textSilver; }}
              >
                ✕
              </button>
            </div>

            <div style={{ padding: '22px 18px 26px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

              {/* avatar + name row */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <HexAvatar size={92} />
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize:      'clamp(18px, 4vw, 22px)',
                    fontWeight:    900,
                    color:         C.textWhite,
                    letterSpacing: '0.02em',
                    lineHeight:    1.1,
                    marginBottom:  '6px',
                  }}>
                    Preetkumar Kotak
                  </div>
                  <div style={{
                    display:      'inline-flex',
                    alignItems:   'center',
                    background:   'rgba(240,192,64,0.12)',
                    border:       `1px solid rgba(240,192,64,0.3)`,
                    borderRadius: '4px',
                    padding:      '3px 8px',
                    fontSize:     '10px',
                    fontWeight:   700,
                    color:        C.textGold,
                    letterSpacing:'0.08em',
                    textTransform:'uppercase',
                    marginBottom: '6px',
                  }}>
                    Build · Break · Fix · Repeat
                  </div>
                  <div style={{ fontSize: '11px', color: C.textMuted, lineHeight: '1.5' }}>
                    preetdkotak@gmail.com
                  </div>
                </div>
              </div>

              {/* bio cards — horizontal scroll, no visible scrollbar */}
              <div style={{
                display:                 'flex',
                gap:                     '8px',
                overflowX:               'auto',
                scrollSnapType:          'x mandatory',
                WebkitOverflowScrolling: 'touch',
                // hide scrollbar cross-browser
                scrollbarWidth:          'none',
                msOverflowStyle:         'none',
                paddingBottom:           '2px',
              }}>
                {cards.map((c) => <BioCard key={c.title} {...c} />)}
              </div>

              {/* buttons */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <ActionBtn label="GitHub"    href="https://github.com/Preet-Kotak"                                    external />
                <ActionBtn label="LinkedIn"  href="https://www.linkedin.com/in/preet-kotak-8538b033a"               external />
                <ActionBtn label="Codeforces" href="https://codeforces.com/profile/Preet-Kotak"                     external />
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

AboutModal.propTypes = { isOpen: PropTypes.bool.isRequired, onClose: PropTypes.func.isRequired };
HexAvatar.propTypes  = { size: PropTypes.number };
BioCard.propTypes    = { title: PropTypes.string.isRequired, lines: PropTypes.arrayOf(PropTypes.string).isRequired };
ActionBtn.propTypes  = { label: PropTypes.string.isRequired, href: PropTypes.string.isRequired, external: PropTypes.bool.isRequired };

export default AboutModal;
