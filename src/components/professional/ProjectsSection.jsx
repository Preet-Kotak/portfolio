/**
 * ProjectsSection — Stacking Cards (CodyHouse pattern)
 *
 * Each card is position:sticky with the same top value.
 * As you scroll, earlier cards scale down while new ones slide on top.
 * Once all cards are stacked, normal scroll resumes.
 *
 * Key facts from research:
 *  - Cards MUST be direct children of the list/container
 *  - No wrapper divs with overflow:hidden on any ancestor
 *  - translateY(i * margin) offsets each card so they look stacked
 *  - scroll progress per card = (containerTop - cardTop) measures how
 *    far past sticky the container has scrolled
 */
import { useEffect, useRef } from 'react';
import projects from '../../data/projects';
import WaveDivider from './WaveDivider';

const NAV_H      = 74;
const CARD_TOP   = NAV_H + 24;   // px from top of viewport where cards pin
const MARGIN_Y   = 12;           // vertical offset between stacked cards (px)

const STYLES = `
  .ps-section {
    background: var(--light-parch-grad);
    position: relative;
    padding-bottom: 8vh;
  }

  .ps-heading-row {
    padding: 6vh 8vw 3vh;
  }
  .ps-heading {
    color: var(--gold);
    font-family: "Fira Code", monospace;
    text-decoration: underline;
    font-size: clamp(24px, 3.5vw, 44px);
    margin: 0;
  }

  /* The list provides the total scroll height for all cards */
  .ps-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  /* Every card pins at the same top — they stack on each other */
  .ps-item {
    position: sticky;
    top: ${CARD_TOP}px;
    transform-origin: center top;
    /* translateY set by JS to offset each card in the stack */
    padding: 0 5vw;
    padding-bottom: 20px;
  }

  .ps-card {
    border-radius: 18px;
    background: #F5F0E4;
    box-shadow: 0 10px 40px rgba(44,26,14,0.18);
    overflow: hidden;
  }

  .ps-card__inner {
    display: flex;
    align-items: center;
    gap: 5vw;
    padding: 4vh 4vw;
    min-height: 360px;
  }

  .ps-card__img {
    flex-shrink: 0;
    width: min(360px, 40vw);
    aspect-ratio: 4 / 3;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 8px 24px rgba(44,26,14,0.12);
    background: #e0d8c4;
  }
  .ps-card__img img {
    width: 100%; height: 100%;
    object-fit: cover;
    display: block;
  }
  .ps-card__placeholder {
    width: 100%; height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--muted-text);
    font-family: "Fira Code", monospace;
    font-size: 13px;
    text-align: center;
    padding: 16px;
    background: linear-gradient(135deg, #e8dfc8, #f5f0e4);
  }

  .ps-card__info {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  .ps-card__eyebrow {
    font-family: "Fira Code", monospace;
    font-size: 11px;
    color: var(--muted-text);
    letter-spacing: 0.08em;
    text-transform: uppercase;
    margin: 0;
  }
  .ps-card__title-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
  }
  .ps-card__title {
    font-family: "Oswald", "Fira Code", sans-serif;
    font-size: clamp(22px, 2.6vw, 38px);
    color: var(--dark-text);
    margin: 0;
    line-height: 1.1;
  }
  .ps-card__wip {
    background: var(--coc-green);
    color: #fff;
    font-family: "Fira Code", monospace;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.06em;
    padding: 2px 8px;
    border-radius: 8px;
    text-transform: uppercase;
    white-space: nowrap;
  }
  .ps-card__desc {
    color: var(--dark-text);
    font-family: "Fira Code", monospace;
    line-height: 1.75;
    font-size: clamp(11px, 1vw, 13px);
    margin: 0;
  }
  .ps-card__gold { color: var(--gold); }
  .ps-card__tech {
    color: var(--muted-text);
    font-family: "Fira Code", monospace;
    font-size: 11px;
    margin: 0;
  }
  .ps-card__links {
    display: flex;
    gap: 16px;
    align-items: center;
    flex-wrap: wrap;
  }
  .ps-card__link {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--gold);
    font-family: "Oswald", "Fira Code", sans-serif;
    font-size: 14px;
    text-decoration: none;
    transition: color 200ms, transform 200ms;
  }
  .ps-card__link:hover { color: var(--dark-text); transform: scale(1.06); }
  .ps-card__done-dot { color: var(--coc-green); font-size: 11px; }

  @media only screen and (max-width: 768px) {
    .ps-card__inner {
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 3vh 4vw;
      min-height: unset;
    }
    .ps-card__img { width: min(260px, 76vw); }
    .ps-card__info { align-items: center; text-align: center; }
    .ps-card__links { justify-content: center; }
  }
`;

function HighlightedText({ text, terms }) {
  if (!terms?.length) return <>{text}</>;
  const escaped = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(regex);
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part)
          ? <span key={i} className="ps-card__gold">{part}</span>
          : part
      )}
    </>
  );
}

function GHIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.572C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

export default function ProjectsSection() {
  const listRef  = useRef(null);
  const itemRefs = useRef([]);
  const total    = projects.length;

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;

    // Measure card height once (all cards same height)
    const firstItem = itemRefs.current[0];
    if (!firstItem) return;
    const cardHeight = firstItem.offsetHeight;

    const animate = () => {
      const containerTop = list.getBoundingClientRect().top;

      itemRefs.current.forEach((item, i) => {
        if (!item) return;

        // How far past the sticky point has this card scrolled?
        // containerTop starts positive (before section), goes negative as we scroll.
        // Each card "sticks" once the container has scrolled i cards worth.
        const scrolling = CARD_TOP - containerTop - i * (cardHeight + MARGIN_Y);

        if (scrolling > 0) {
          // Card is pinned — scale it down as subsequent cards stack on top
          const scale = (cardHeight - scrolling * 0.05) / cardHeight;
          item.style.transform = `translateY(${MARGIN_Y * i}px) scale(${Math.max(scale, 0.85)})`;
        } else {
          // Card hasn't reached sticky point yet — just offset it vertically
          item.style.transform = `translateY(${MARGIN_Y * i}px)`;
        }
      });
    };

    // Use IntersectionObserver to only run scroll listener when section is visible
    let scrollListener = null;

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        if (scrollListener) return;
        scrollListener = () => { window.requestAnimationFrame(animate); };
        window.addEventListener('scroll', scrollListener, { passive: true });
        animate(); // run once immediately
      } else {
        if (!scrollListener) return;
        window.removeEventListener('scroll', scrollListener);
        scrollListener = null;
      }
    });

    observer.observe(list);
    animate(); // init

    return () => {
      observer.disconnect();
      if (scrollListener) window.removeEventListener('scroll', scrollListener);
    };
  }, [total]);

  return (
    <>
      <style>{STYLES}</style>

      <section className="ps-section" id="projects">

        <div className="ps-heading-row">
          <h2 className="ps-heading">Projects</h2>
        </div>

        <ul className="ps-list" ref={listRef}>
          {projects.map((p, i) => (
            <li
              key={i}
              className="ps-item"
              ref={el => { itemRefs.current[i] = el; }}
              style={{ zIndex: i + 1 }}
            >
              <div className="ps-card">
                <div className="ps-card__inner">
                  <div className="ps-card__img">
                    {p.image
                      ? <img src={`/${p.image}`} alt={p.title} />
                      : <div className="ps-card__placeholder">{p.title}</div>
                    }
                  </div>

                  <div className="ps-card__info">
                    <p className="ps-card__eyebrow">Project {String(i + 1).padStart(2, '0')}</p>

                    <div className="ps-card__title-row">
                      <h3 className="ps-card__title">{p.title}</h3>
                      {p.isWIP && <span className="ps-card__wip">WIP</span>}
                    </div>

                    <p className="ps-card__desc">
                      <HighlightedText text={p.description} terms={p.highlights} />
                    </p>

                    <p className="ps-card__tech">{'> '}{p.tech.join(' · ')}</p>

                    <div className="ps-card__links">
                      {!p.isWIP && <span className="ps-card__done-dot">●</span>}
                      {p.githubUrl && (
                        <a href={p.githubUrl} className="ps-card__link"
                          target="_blank" rel="noopener noreferrer">
                          <GHIcon /> Source Code
                        </a>
                      )}
                      {p.liveUrl && (
                        <a href={p.liveUrl} className="ps-card__link"
                          target="_blank" rel="noopener noreferrer">
                          ↗ Live Demo
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>

      </section>

      <div style={{ position: 'relative', background: 'var(--light-parch-grad)', height: '82px' }}>
        <WaveDivider direction="to-dark" />
      </div>
    </>
  );
}
