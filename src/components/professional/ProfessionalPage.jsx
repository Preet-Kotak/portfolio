/**
 * ProfessionalPage — Phase 11 main container.
 * Tasks completed: 11.2 (vars+waves) 11.3 (nav) 11.4 (hero) 11.5 (about)
 */
import PropTypes from 'prop-types';
import ProNav           from './ProNav';
import HeroSection      from './HeroSection';
import AboutSection     from './AboutSection';
import ProjectsSection  from './ProjectsSection';
import WaveDivider      from './WaveDivider';

const CSS_VARS = `
  :root {
    --gold:             #C88A00;
    --gold-light:       #E8B040;
    --coc-green:        #4a8c2a;
    --coc-green-light:  #5aaa36;
    --dark-brown-grad:  #2C1A0E;
    --light-parch-grad: linear-gradient(315deg, #D8C8A8 0%, #EDE8DC 74%);
    --dark-text:        #2C1A0E;
    --muted-text:       #8A7A6A;
  }
  .pro-page { max-width: 100%; min-width: 0; }
  .pro-page *, .pro-page *::before, .pro-page *::after {
    box-sizing: border-box;
    margin: 0;
  }
`;

export default function ProfessionalPage({ onBack, onSwitchToGame }) {
  return (
    <div className="pro-page">
      <style>{CSS_VARS}</style>

      {/* Shared SVG gradient defs — referenced by WaveDivider */}
      <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
        <defs>
          <linearGradient id="pro-darkGrad" x1="0" y1="0" x2="1" y2="0">
            <stop stopColor="#1a0e05" />
            <stop offset=".59" stopColor="#2C1A0E" />
            <stop offset="1"   stopColor="#3D2510" />
          </linearGradient>
          <linearGradient id="pro-lightGrad" x1="0" y1="1" x2="1" y2="0">
            <stop stopColor="#D8C8A8" />
            <stop offset=".8" stopColor="#EDE8DC" />
          </linearGradient>
        </defs>
      </svg>

      <ProNav onBack={onBack} onSwitchToGame={onSwitchToGame} />

      <main style={{ paddingTop: '74px' }}>

        {/* 11.4 — Hero */}
        <HeroSection />

        {/* 11.5 — About */}
        <AboutSection />

        {/* 11.6 — Projects */}
        <ProjectsSection />

        {/* 11.7 placeholder — Achievements */}
        <section id="achievements" style={{
          minHeight: '40vh', background: 'var(--dark-brown-grad)',
          position: 'relative', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontFamily: '"Fira Code",monospace',
          color: 'var(--gold-light)', fontSize: '16px', paddingBottom: '90px',
        }}>
          Achievements — coming soon
          <WaveDivider direction="to-light" />
        </section>

        {/* 11.8 placeholder — Contact */}
        <section id="contact" style={{
          minHeight: '40vh', background: 'var(--light-parch-grad)',
          position: 'relative', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontFamily: '"Fira Code",monospace',
          color: 'var(--dark-text)', fontSize: '16px', paddingBottom: '90px',
        }}>
          Contact — coming soon
          <WaveDivider direction="to-dark" />
        </section>

        {/* Temp Enter the Village button */}
        <div style={{
          background: 'var(--dark-brown-grad)', padding: '40px', textAlign: 'center',
        }}>
          <button
            onClick={onSwitchToGame}
            aria-label="Switch to the interactive village experience"
            style={{
              fontFamily: '"Fira Code",monospace', color: 'var(--gold)',
              border: '2px solid var(--gold)', background: 'transparent',
              padding: '8px 20px', borderRadius: '10px', cursor: 'pointer', fontSize: '14px',
            }}
          >
            ⚔️ Enter the Village
          </button>
        </div>

      </main>
    </div>
  );
}

ProfessionalPage.propTypes = {
  onBack:         PropTypes.func,
  onSwitchToGame: PropTypes.func,
};
