/**
 * AchievementsSection — Task 11.7
 * New section displaying achievement badges and a "Back to Village" exit.
 * All data from achievements.js — zero hardcoding.
 * useScrollFade('up') applied to the badge grid.
 */
import achievements from '../../data/achievements';
import { useScrollFade } from '../../hooks/useScrollFade';
import WaveDivider from './WaveDivider';

const STYLES = `
  .as-section {
    background: var(--dark-brown-grad);
    position: relative;
    padding: 10vh 6vw 120px;
    color: white;
    overflow: clip;
  }

  .as-heading {
    color: var(--gold);
    font-family: "Fira Code", monospace;
    text-decoration: underline;
    font-size: clamp(24px, 3.5vw, 44px);
    margin: 0 0 6vh;
  }

  /* Badge grid */
  .as-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
    gap: 24px;
    /* scroll-fade state set via class */
  }

  .as-grid--hidden {
    opacity: 0;
    transform: translateY(36px);
    transition: opacity 0.65s ease, transform 0.65s ease;
  }
  .as-grid--visible {
    opacity: 1;
    transform: translateY(0);
    transition: opacity 0.65s ease, transform 0.65s ease;
  }

  /* Individual badge card — light parchment card on dark background */
  .as-badge {
    background: #F5F0E4;
    border: none;
    border-radius: 15px;
    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.35);
    padding: 28px 24px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    text-decoration: none;
    color: inherit;
    transition: transform 220ms ease, box-shadow 220ms ease;
  }
  .as-badge:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 36px rgba(0, 0, 0, 0.5);
  }
  /* Placeholder badges — greyed out, non-interactive */
  .as-badge--placeholder {
    opacity: 0.45;
    cursor: default;
    pointer-events: none;
  }

  .as-badge__icon {
    font-size: 36px;
    line-height: 1;
  }

  .as-badge__title {
    font-family: "Oswald", "Fira Code", sans-serif;
    font-size: clamp(18px, 2vw, 24px);
    color: var(--dark-text);
    margin: 4px 0 0;
  }

  .as-badge__subtitle {
    font-family: "Fira Code", monospace;
    font-size: 12px;
    color: var(--muted-text);
    letter-spacing: 0.04em;
  }

  .as-badge__desc {
    font-family: "Fira Code", monospace;
    font-size: 11.5px;
    color: var(--dark-text);
    line-height: 1.65;
    margin-top: 4px;
  }

  .as-badge__cert {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-top: 8px;
    font-family: "Fira Code", monospace;
    font-size: 11px;
    color: var(--gold);
    text-decoration: underline;
    pointer-events: auto;
    transition: color 180ms;
  }
  .as-badge__cert:hover { color: var(--dark-text); }

  @media only screen and (max-width: 768px) {
    .as-section { padding: 8vh 5vw 100px; }
    .as-grid {
      grid-template-columns: 1fr;
    }
  }
`;

export default function AchievementsSection() {
  const [gridRef, gridVisible] = useScrollFade('up');

  return (
    <>
      <style>{STYLES}</style>

      <section className="as-section" id="achievements">
        <h2 className="as-heading">Achievements</h2>

        <div
          ref={gridRef}
          className={`as-grid ${gridVisible ? 'as-grid--visible' : 'as-grid--hidden'}`}
        >
          {achievements.map((a) => {
            const Tag = a.href && !a.placeholder ? 'a' : 'div';
            const linkProps = Tag === 'a'
              ? { href: a.href, target: '_blank', rel: 'noopener noreferrer' }
              : {};

            return (
              <Tag
                key={a.id}
                className={`as-badge${a.placeholder ? ' as-badge--placeholder' : ''}`}
                style={{ borderTop: `4px solid ${a.color}` }}
                {...linkProps}
              >
                <span className="as-badge__icon" aria-hidden="true">{a.icon}</span>
                <h3 className="as-badge__title">{a.title}</h3>
                <p className="as-badge__subtitle">{a.subtitle}</p>
                {a.description && (
                  <p className="as-badge__desc">{a.description}</p>
                )}
                {a.certificate?.pdfPath && (
                  <a
                    href={`/${a.certificate.pdfPath}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="as-badge__cert"
                    onClick={e => e.stopPropagation()}
                  >
                    📄 View Certificate
                  </a>
                )}
              </Tag>
            );
          })}
        </div>

        <WaveDivider direction="to-light" />
      </section>
    </>
  );
}
