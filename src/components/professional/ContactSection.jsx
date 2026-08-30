/**
 * ContactSection — Tasks 11.8 + 11.10 (merged)
 * Light parchment theme.
 * Desktop: contact links (left col) side-by-side with form (right col).
 * Mobile: stacked.
 */
import about from '../../data/about';
import ContactForm from './ContactForm';

const STYLES = `
  .pro-contact {
    background: var(--light-parch-grad);
    position: relative;
    overflow: clip;
    color: var(--dark-text);
    padding: 10vh 8vw 8vh;
    font-family: "Fira Code", monospace;
  }

  .pro-contact__heading {
    color: var(--gold);
    font-family: "Fira Code", monospace;
    text-decoration: underline;
    font-size: clamp(28px, 4vw, 56px);
    margin: 0 0 6vh;
    text-align: center;
  }

  /* Two-column layout on desktop */
  .pro-contact__body {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: start;
    max-width: 960px;
    margin: 0 auto;
  }

  /* Left col — contact links */
  .pro-contact__links {
    display: flex;
    flex-direction: column;
    gap: 28px;
    padding-top: 8px;
  }

  .pro-contact__option {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  .pro-contact__logo {
    color: var(--gold);
    font-size: 30px;
    width: 42px;
    text-align: center;
    flex-shrink: 0;
  }

  .pro-contact__text {
    color: var(--dark-text);
    text-decoration: underline;
    font-size: 18px;
    transition: color 200ms ease;
    word-break: break-all;
  }

  .pro-contact__option:hover .pro-contact__text {
    color: var(--gold);
  }

  /* Thin gold divider between cols on desktop */
  .pro-contact__divider {
    display: none;
  }

  @media only screen and (max-width: 768px) {
    .pro-contact { padding: 8vh 6vw 6vh; }
    .pro-contact__heading { font-size: 36px; }

    /* Stack on mobile */
    .pro-contact__body {
      grid-template-columns: 1fr;
      gap: 36px;
    }

    .pro-contact__links {
      align-items: center;
      text-align: center;
    }

    .pro-contact__option {
      flex-direction: column;
      gap: 6px;
    }

    .pro-contact__text { font-size: 16px; }
  }
`;

export default function ContactSection() {
  return (
    <section id="contact" className="pro-contact">
      <style>{STYLES}</style>

      <h2 className="pro-contact__heading">Get In Touch</h2>

      <div className="pro-contact__body">

        {/* Left — contact links */}
        <div className="pro-contact__links">
          <div className="pro-contact__option">
            <span className="pro-contact__logo" aria-hidden="true">✉</span>
            <a href={`mailto:${about.email}`}>
              <span className="pro-contact__text">{about.email}</span>
            </a>
          </div>

          <div className="pro-contact__option">
            <span className="pro-contact__logo" aria-hidden="true">in</span>
            <a href={about.linkedinUrl} target="_blank" rel="noopener noreferrer">
              <span className="pro-contact__text">LinkedIn</span>
            </a>
          </div>

          <div className="pro-contact__option">
            <span className="pro-contact__logo" aria-hidden="true">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/>
              </svg>
            </span>
            <a href={about.githubUrl} target="_blank" rel="noopener noreferrer">
              <span className="pro-contact__text">GitHub</span>
            </a>
          </div>
        </div>

        {/* Right — contact form */}
        <ContactForm />

      </div>
    </section>
  );
}


