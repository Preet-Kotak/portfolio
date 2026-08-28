/**
 * HeroSection — Task 11.4
 * Ports .landing from portfolio.html with CoC gold palette.
 * All text from about.js — zero hardcoding.
 */
import about from '../../data/about';
import WaveDivider from './WaveDivider';

const STYLES = `
  .pro-landing {
    font-family: "Fira Code", monospace;
    min-height: 105vh;
    position: relative;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    /* wave + arrow space at bottom */
    padding-bottom: 120px;
    background: var(--light-parch-grad);
    /* offset the fixed nav so flex centre is truly centred in visible area */
    padding-top: 74px;
    /* compensate so the content block sits in the visual centre */
    margin-top: 0;
  }

  /* Inner content wrapper gets negative top margin equal to half the nav
     height so the flex centre aligns with viewport centre, not page centre */
  .pro-landing__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: -37px;
  }

  .pro-landing__tagline {
    color: var(--gold);
    display: block;
    font-size: 18px;
    margin-bottom: 8px;
    letter-spacing: 0.04em;
  }

  .pro-landing__name {
    font-size: clamp(32px, 6vw, 56px);
    text-shadow: rgba(0,0,0,0.12) 1.95px 1.95px 2.6px;
    color: var(--dark-text);
    margin: 0;
    line-height: 1.15;
  }

  .pro-landing__hr {
    width: 35vw;
    height: 2px;
    background-color: var(--gold);
    border: none;
    margin: 20px auto;
    animation: proFadeInWidth 2s ease forwards;
  }

  @keyframes proFadeInWidth {
    from { width: 0; }
    to   { width: 35vw; }
  }

  .pro-landing__roles {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .pro-landing__role {
    font-size: clamp(18px, 3.5vw, 32px);
    color: var(--dark-text);
    line-height: 1.3;
  }

  /* Double-chevron scroll arrow */
  .pro-goldArrows {
    position: absolute;
    bottom: 15%;
    left: 50%;
    transform: translateX(-50%);
    animation: proMoveDown 2s ease forwards;
    transition: transform 250ms ease;
    cursor: pointer;
    background: none;
    border: none;
    padding: 0;
  }

  .pro-goldArrows:hover {
    transform: scale(1.15) translateX(-43%);
  }

  @keyframes proMoveDown {
    from { margin-bottom: 60px; opacity: 0; }
    to   { margin-bottom: 0;    opacity: 1; }
  }

  /* Left social icons column */
  .pro-socialCol {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: absolute;
    left: 5%;
    /* sit well above the wave */
    bottom: 140px;
  }

  .pro-socialCol__bar {
    border-left: 3px solid var(--coc-green);
    height: 20vh;
  }

  .pro-socialIcon {
    color: var(--dark-text);
    text-decoration: none;
    transition: color 250ms ease, transform 250ms ease;
    padding-top: 8px;
    font-size: 20px;
    font-family: "Fira Code", monospace;
    font-weight: 700;
    line-height: 1;
  }

  .pro-socialIcon:hover {
    color: var(--gold);
    transform: scale(1.15);
  }

  /* Reduced-motion overrides */
  @media (prefers-reduced-motion: reduce) {
    .pro-landing__hr  { animation: none; width: 35vw; }
    .pro-goldArrows   { animation: none; }
  }

  /* Mobile */
  @media only screen and (max-width: 768px) {
    .pro-landing {
      min-height: 95vh;
      padding-bottom: 90px;
    }

    .pro-landing__content { margin-top: -20px; }

    .pro-landing__hr { width: 80vw; }

    @keyframes proFadeInWidth {
      from { width: 0; }
      to   { width: 80vw; }
    }

    .pro-goldArrows { bottom: 10%; }

    /* Social icons row centred above the wave on mobile */
    .pro-socialCol {
      flex-direction: row;
      left: 50%;
      bottom: 140px;
      transform: translateX(-50%);
    }

    .pro-socialCol__bar { display: none; }

    .pro-socialIcon {
      padding: 0 14px;
      padding-top: 0;
    }
  }
`;

/* Simple SVG icons — no external library */
function GitHubIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.572C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
    </svg>
  );
}

export default function HeroSection() {
  const scrollToAbout = () => {
    const target = document.querySelector('#about');
    if (!target) return;
    const navHeight = 74;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <>
      <style>{STYLES}</style>

      <section className="pro-landing" id="hero">
        {/* Text stack + hr + roles — wrapped so margin-top centres them */}
        <div className="pro-landing__content">
          <div>
            <span className="pro-landing__tagline">{about.tagline}</span>
            <h1 className="pro-landing__name">{about.name}</h1>
          </div>

          <hr className="pro-landing__hr" />

          <ul className="pro-landing__roles">
            {about.roles.map(role => (
              <li key={role} className="pro-landing__role">{role}</li>
            ))}
          </ul>
        </div>

        {/* Double-chevron scroll arrow */}
        <button
          className="pro-goldArrows"
          onClick={scrollToAbout}
          aria-label="Scroll to About section"
        >
          <svg width="34" height="38" viewBox="0 0 40 45" fill="none">
            <path d="M2 22L20.4737 41L38 22" stroke="#C88A00" strokeWidth="5"/>
            <path d="M2 2L20.4737 22L38 2"  stroke="#C88A00" strokeWidth="5"/>
          </svg>
        </button>

        {/* Left social icons column */}
        <div className="pro-socialCol">
          <div className="pro-socialCol__bar" />
          <a
            href={about.githubUrl}
            className="pro-socialIcon"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
          >
            <GitHubIcon />
          </a>
          <a
            href={about.linkedinUrl}
            className="pro-socialIcon"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
          >
            <LinkedInIcon />
          </a>
        </div>

        <WaveDivider direction="to-dark" />
      </section>
    </>
  );
}
