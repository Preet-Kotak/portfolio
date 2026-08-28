/**
 * AboutSection — Task 11.5
 * Ports .about from portfolio.html with CoC gold palette.
 * All text from about.js — zero hardcoding.
 * useScrollFade applied to text column (slides in from right).
 */
import about from '../../data/about';
import { useScrollFade } from '../../hooks/useScrollFade';
import WaveDivider from './WaveDivider';

const STYLES = `
  .pro-about {
    display: flex;
    flex-wrap: wrap;
    padding-top: 14vh;
    padding-bottom: 10vh;
    padding-left: 6vw;
    padding-right: 6vw;
    justify-content: center;
    align-items: center;
    gap: 48px;
    background: var(--dark-brown-grad);
    position: relative;
    color: white;
    /* extra bottom space for the wave */
    padding-bottom: 120px;
  }

  .pro-about h2 {
    color: var(--gold);
    font-family: "Fira Code", monospace;
    text-decoration: underline;
    font-size: clamp(36px, 5vw, 60px);
    margin-bottom: 20px;
  }

  .pro-about__text {
    display: flex;
    flex-direction: column;
    max-width: 580px;
    /* scroll-fade handled via inline style */
  }

  .pro-about__body {
    font-family: "Fira Code", monospace;
    line-height: 1.75;
    font-size: clamp(13px, 1.4vw, 15px);
    color: #D8C8A8;
  }

  .pro-about__body p {
    margin-bottom: 1.1em;
  }

  .pro-about__body p:last-child {
    margin-bottom: 0;
  }

  .pro-about__specialText {
    color: var(--gold);
  }

  /* Photo */
  .pro-about__headshot {
    width: 240px;
    height: 240px;
    border-radius: 50%;
    border: 5px solid var(--gold);
    box-shadow: 0 20px 40px -10px rgba(200, 138, 0, 0.45);
    object-fit: cover;
    flex-shrink: 0;
    background: #2C1A0E;
  }

  /* Scroll-fade base state */
  .pro-about__text--hidden {
    opacity: 0;
    transform: translateX(40px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }

  .pro-about__text--visible {
    opacity: 1;
    transform: translateX(0);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }

  @media only screen and (max-width: 768px) {
    .pro-about {
      flex-direction: column-reverse;
      padding-top: 80px;
      padding-bottom: 80px;
      text-align: center;
      gap: 28px;
    }

    .pro-about h2 { font-size: 36px; }

    .pro-about__body {
      font-size: 13px;
      max-width: 88vw;
    }

    .pro-about__headshot {
      width: 180px;
      height: 180px;
    }

    /* slide from bottom on mobile instead of right */
    .pro-about__text--hidden {
      opacity: 0;
      transform: translateY(30px);
    }

    .pro-about__text--visible {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

/**
 * Splits a paragraph string and wraps special terms in a gold span.
 * Terms come from about.specialTerms — never hardcoded in the component.
 */
function HighlightedParagraph({ text, terms }) {
  if (!terms?.length) return <p className="pro-about__body">{text}</p>;

  // Build a regex from all terms (case-insensitive)
  const escaped = terms.map(t => t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <p>
      {parts.map((part, i) =>
        regex.test(part)
          ? <span key={i} className="pro-about__specialText">{part}</span>
          : part
      )}
    </p>
  );
}

export default function AboutSection() {
  const [textRef, textVisible] = useScrollFade('right', 0.15);

  const bioArray = Array.isArray(about.bio) ? about.bio : [about.bio];

  return (
    <>
      <style>{STYLES}</style>

      <section className="pro-about" id="about">
        {/* Text column — scroll-fade from right */}
        <div
          ref={textRef}
          className={`pro-about__text ${textVisible ? 'pro-about__text--visible' : 'pro-about__text--hidden'}`}
        >
          <h2>About Me</h2>
          <div className="pro-about__body">
            {bioArray.map((para, i) => (
              <HighlightedParagraph
                key={i}
                text={para}
                terms={about.specialTerms}
              />
            ))}
          </div>
        </div>

        {/* Headshot */}
        <img
          src={about.profilePhoto ?? '/assets/profile.jpg'}
          alt={about.name}
          className="pro-about__headshot"
        />

        <WaveDivider direction="to-light" />
      </section>
    </>
  );
}
