import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Modal, { C } from './Modal';
import ModalArrow from './ModalArrow';
import projects from '../../data/projects';

/* ── Status badge ───────────────────────────────────────────────────── */
function StatusBadge({ status }) {
  const isWip = status === 'wip';
  return (
    <div style={{
      display:       'inline-flex',
      alignItems:    'center',
      gap:           '4px',
      padding:       '2px 7px',
      borderRadius:  '4px',
      fontSize:      '9px',
      fontWeight:    800,
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
      background:    isWip ? 'rgba(200,138,0,0.12)' : 'rgba(58,158,32,0.12)',
      border:        `1px solid ${isWip ? 'rgba(200,138,0,0.4)' : 'rgba(58,158,32,0.4)'}`,
      color:         isWip ? C.textGold : C.green,
      flexShrink:    0,
    }}>
      {isWip ? '⚙️ Upgrading' : '✅ Done'}
    </div>
  );
}

/* ── Tech tag ───────────────────────────────────────────────────────── */
function TechTag({ name }) {
  return (
    <span style={{
      padding:      '2px 7px',
      borderRadius: '4px',
      background:   C.bgPanel,
      border:       `1px solid ${C.bgDark}`,
      fontSize:     '10px',
      color:        C.textSub,
      fontWeight:   600,
    }}>
      {name}
    </span>
  );
}

/* ── Project image ──────────────────────────────────────────────────── */
function ProjectImage({ project }) {
  const [imgError, setImgError] = useState(false);
  const clickUrl = project.liveUrl ?? project.links[0]?.href ?? null;
  const hasImage = project.image && !imgError;

  return (
    <div
      onClick={() => clickUrl && window.open(clickUrl, '_blank', 'noopener,noreferrer')}
      style={{
        height:         '140px',
        overflow:       'hidden',
        flexShrink:     0,
        cursor:         clickUrl ? 'pointer' : 'default',
        background:     hasImage ? C.bgDark : C.bgPanel,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        position:       'relative',
        borderBottom:   `1px solid ${C.bgDark}`,
      }}
    >
      {hasImage ? (
        <>
          <img
            src={project.image}
            alt={project.title}
            onError={() => setImgError(true)}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.2s' }}
            onMouseEnter={e => { if (clickUrl) e.currentTarget.style.transform = 'scale(1.03)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          />
          {project.liveUrl && (
            <div style={{
              position:      'absolute',
              bottom:        '6px',
              right:         '8px',
              background:    'rgba(0,0,0,0.55)',
              borderRadius:  '4px',
              padding:       '2px 7px',
              fontSize:      '9px',
              fontWeight:    700,
              color:         '#fff',
              pointerEvents: 'none',
            }}>
              🔗 Live Demo
            </div>
          )}
        </>
      ) : (
        <span style={{ fontSize: '13px', fontWeight: 700, color: C.textMuted, userSelect: 'none' }}>
          {project.title}
        </span>
      )}
    </div>
  );
}

/* ── Project card ───────────────────────────────────────────────────── */
function ProjectCard({ project }) {
  return (
    <div style={{
      borderRadius: '10px',
      overflow:     'hidden',
      background:   C.header,
      border:       `1px solid ${C.bgDark}`,
      boxShadow:    'inset 0 1px 0 rgba(255,255,255,0.7)',
    }}>
      <ProjectImage project={project} />

      <div style={{ padding: '12px 14px 14px' }}>

        {/* title + badge */}
        <div style={{
          display:        'flex',
          alignItems:     'flex-start',
          gap:            '8px',
          marginBottom:   '6px',
          justifyContent: 'space-between',
        }}>
          <div style={{ fontSize: '13px', fontWeight: 800, color: C.text, lineHeight: 1.2 }}>
            {project.title}
          </div>
          <StatusBadge status={project.status} />
        </div>

        {/* description */}
        <div style={{ fontSize: '11.5px', lineHeight: '1.65', color: C.textSub, marginBottom: '10px' }}>
          {project.description}
        </div>

        {/* tech tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
          {project.tech.map((t) => <TechTag key={t} name={t} />)}
        </div>

        {/* links */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {project.links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding:        '5px 14px',
                borderRadius:   '8px',
                textDecoration: 'none',
                fontSize:       '10px',
                fontWeight:     800,
                letterSpacing:  '0.06em',
                textTransform:  'uppercase',
                background:     `linear-gradient(180deg, ${C.btnGreenHi} 0%, ${C.btnGreen} 55%, ${C.btnGreenShadow} 100%)`,
                border:         `2px solid ${C.btnGreenBorder}`,
                boxShadow:      `0 3px 0 ${C.btnGreenShadow}`,
                color:          '#FFFFFF',
                cursor:         'pointer',
                transition:     'filter 0.1s',
                textShadow:     '0 1px 2px rgba(0,0,0,0.4)',
              }}
              onMouseEnter={e => { e.currentTarget.style.filter = 'brightness(1.1)'; }}
              onMouseLeave={e => { e.currentTarget.style.filter = ''; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 3px 0 ${C.btnGreenShadow}`; }}
              onMouseDown={e => { e.currentTarget.style.transform = 'translateY(2px)'; e.currentTarget.style.boxShadow = 'none'; }}
              onMouseUp={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = `0 3px 0 ${C.btnGreenShadow}`; }}
            >
              {link.label}
            </a>
          ))}
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                padding:        '5px 14px',
                borderRadius:   '8px',
                textDecoration: 'none',
                fontSize:       '10px',
                fontWeight:     800,
                letterSpacing:  '0.06em',
                textTransform:  'uppercase',
                background:     C.bgPanel,
                border:         `2px solid ${C.bgDark}`,
                color:          C.textSub,
                cursor:         'pointer',
                transition:     'background 0.1s',
                boxShadow:      'inset 0 1px 0 rgba(255,255,255,0.5)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background = C.bgDark; }}
              onMouseLeave={e => { e.currentTarget.style.background = C.bgPanel; }}
            >
              Live Demo
            </a>
          )}
        </div>

      </div>
    </div>
  );
}

/* ── Main ────────────────────────────────────────────────────────────── */
function ProjectsModal({ isOpen, onClose }) {
  const [page, setPage] = useState(0);
  const total           = projects.length;

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
    <Modal isOpen={isOpen} onClose={onClose} title="Builder's Hut — Projects" width="min(94vw, 480px)">
      <div style={{ padding: '14px 14px 18px', display: 'flex', flexDirection: 'column', gap: '10px', background: C.bg }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <ModalArrow dir="left"  disabled={page === 0}         onClick={() => setPage(p => p - 1)} />
          <div style={{ flex: 1 }}>
            <ProjectCard project={projects[page]} />
          </div>
          <ModalArrow dir="right" disabled={page === total - 1} onClick={() => setPage(p => p + 1)} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
          {projects.map((_, i) => (
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

ProjectsModal.propTypes = { isOpen: PropTypes.bool.isRequired, onClose: PropTypes.func.isRequired };
ProjectCard.propTypes   = { project: PropTypes.object.isRequired };
ProjectImage.propTypes  = { project: PropTypes.object.isRequired };
StatusBadge.propTypes   = { status: PropTypes.string.isRequired };
TechTag.propTypes       = { name: PropTypes.string.isRequired };

export default ProjectsModal;
