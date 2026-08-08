import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal, { C } from './Modal';
import ModalArrow from './ModalArrow';
import achievements from '../../data/achievements';

/* ── PDF Lightbox ───────────────────────────────────────────────────── */
function PdfLightbox({ pdfPath, onClose }) {
  return (
    <div
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      style={{
        position:       'fixed',
        inset:          0,
        zIndex:         100,
        background:     'rgba(0,0,0,0.85)',
        display:        'flex',
        flexDirection:  'column',
        alignItems:     'center',
        justifyContent: 'center',
        padding:        '20px',
      }}
    >
      <button
        onClick={onClose}
        aria-label="Close certificate"
        style={{
          position:       'absolute',
          top:            '16px',
          right:          '20px',
          background:     'rgba(255,255,255,0.1)',
          border:         `1px solid ${C.textMuted}`,
          borderRadius:   '50%',
          width:          '34px',
          height:         '34px',
          color:          '#fff',
          fontSize:       '14px',
          cursor:         'pointer',
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'center',
          fontWeight:     700,
        }}
      >
        ✕
      </button>
      <iframe
        src={pdfPath}
        title="Certificate"
        style={{
          width:        'min(90vw, 800px)',
          height:       'min(85vh, 600px)',
          border:       `2px solid ${C.goldDark}`,
          borderRadius: '8px',
          background:   '#fff',
        }}
      />
      <div style={{ marginTop: '10px', fontSize: '11px', color: C.textMuted }}>
        Click outside to close
      </div>
    </div>
  );
}

/* ── Achievement card ───────────────────────────────────────────────── */
function AchievementCard({ achievement, onViewCert }) {
  const { title, subtitle, icon, description, color, href, certificate, placeholder } = achievement;

  return (
    <div style={{
      borderRadius: '10px',
      padding:      '18px 16px',
      background:   placeholder ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.04)',
      border:       `1px solid ${placeholder ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.09)'}`,
      opacity:      placeholder ? 0.5 : 1,
      display:      'flex',
      gap:          '14px',
      alignItems:   'flex-start',
      minHeight:    '120px',
    }}>

      {/* icon bubble */}
      <div style={{
        width:          '48px',
        height:         '48px',
        borderRadius:   '50%',
        background:     placeholder ? 'rgba(255,255,255,0.05)' : `${color}18`,
        border:         `2px solid ${placeholder ? 'rgba(255,255,255,0.08)' : color + '55'}`,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        fontSize:       '20px',
        flexShrink:     0,
      }}>
        {icon}
      </div>

      {/* text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '14px', fontWeight: 800, color: placeholder ? C.textMuted : '#FFFFFF' }}>
            {title}
          </span>
          <span style={{
            fontSize:      '9px',
            fontWeight:    700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color:         placeholder ? C.textMuted : color,
          }}>
            {subtitle}
          </span>
        </div>

        <div style={{
          fontSize:     '11.5px',
          lineHeight:   '1.6',
          color:        C.textSilver,
          marginBottom: (!placeholder && (href || certificate)) ? '12px' : 0,
        }}>
          {description}
        </div>

        {!placeholder && (
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {href && (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding:        '4px 12px',
                  borderRadius:   '6px',
                  textDecoration: 'none',
                  fontSize:       '10px',
                  fontWeight:     800,
                  letterSpacing:  '0.06em',
                  textTransform:  'uppercase',
                  background:     `linear-gradient(180deg, ${C.btnGoldHi} 0%, ${C.btnGold} 55%, #A06800 100%)`,
                  border:         `1px solid ${C.goldLight}`,
                  boxShadow:      `0 3px 0 ${C.btnGoldShadow}`,
                  color:          '#1A0A00',
                  cursor:         'pointer',
                  minWidth:       '130px',
                  textAlign:      'center',
                }}
                onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.filter = ''; }}
              >
                View Project
              </a>
            )}
            {certificate?.pdfPath && (
              <button
                onClick={() => onViewCert(certificate.pdfPath)}
                style={{
                  padding:        '4px 12px',
                  borderRadius:   '6px',
                  fontSize:       '10px',
                  fontWeight:     800,
                  letterSpacing:  '0.06em',
                  textTransform:  'uppercase',
                  background:     'rgba(255,255,255,0.06)',
                  border:         '1px solid rgba(184,200,232,0.2)',
                  color:          C.textSilver,
                  cursor:         'pointer',
                  transition:     'background 0.1s',
                  minWidth:       '130px',
                  textAlign:      'center',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }}
              >
                📄 View Certificate
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────────────────── */
function AchievementsModal({ isOpen, onClose }) {
  const [page,      setPage]      = useState(0);
  const [activePdf, setActivePdf] = useState(null);
  const total = achievements.length;

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
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Laboratory — Achievements">
        <div style={{ padding: '14px 14px 18px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {/* arrows + card */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ModalArrow dir="left"  disabled={page === 0}         onClick={() => setPage(p => p - 1)} />
            <div style={{ flex: 1 }}>
              <AchievementCard achievement={achievements[page]} onViewCert={setActivePdf} />
            </div>
            <ModalArrow dir="right" disabled={page === total - 1} onClick={() => setPage(p => p + 1)} />
          </div>

          {/* dot indicators */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
            {achievements.map((_, i) => (
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

      {activePdf && (
        <PdfLightbox pdfPath={activePdf} onClose={() => setActivePdf(null)} />
      )}
    </>
  );
}

AchievementsModal.propTypes  = { isOpen: PropTypes.bool.isRequired, onClose: PropTypes.func.isRequired };
AchievementCard.propTypes    = { achievement: PropTypes.object.isRequired, onViewCert: PropTypes.func.isRequired };
PdfLightbox.propTypes        = { pdfPath: PropTypes.string.isRequired, onClose: PropTypes.func.isRequired };

export default AchievementsModal;
