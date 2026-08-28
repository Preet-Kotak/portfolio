/**
 * ProNav — fixed top navigation bar for the Professional view.
 *
 * Mobile fixes:
 *  - The overlay <nav> is rendered via a React portal directly on <body>
 *    so it is never clipped by overflow:hidden on a parent div (iOS Safari bug).
 *  - body scroll is locked while the menu is open so the page behind doesn't move.
 *  - Logo "P" uses window.scrollTo(0,0) so it always reaches the very top
 *    regardless of paddingTop offsets on child elements.
 */
import { useState, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';
import PropTypes from 'prop-types';
import about from '../../data/about';

const NAV_LINKS = [
  { label: 'About',        href: '#about'        },
  { label: 'Projects',     href: '#projects'     },
  { label: 'Achievements', href: '#achievements' },
  { label: 'Contact',      href: '#contact'      },
];

const HEADER_STYLES = `
  .pro-header {
    font-family: "Fira Code", monospace;
    padding: 14px 0;
    background: var(--dark-brown-grad);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 200;
    border-bottom: 1px solid #5A3A18;
  }
  .pro-header__logo {
    padding-left: 25px;
    display: flex;
    align-items: center;
  }
  .pro-logo-mark {
    width: 46px;
    height: 46px;
    border-radius: 50%;
    background: #2C1A0E;
    border: 2px solid var(--gold);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gold);
    font-weight: bold;
    font-size: 18px;
    text-decoration: none;
    cursor: pointer;
    transition: box-shadow 200ms ease;
    overflow: hidden;
    padding: 0;
  }
  .pro-logo-mark:hover { box-shadow: 0 0 10px var(--gold); }
  .pro-logo-mark img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    border-radius: 50%;
  }

  /* Desktop nav (inline) */
  .pro-nav-desktop {
    display: flex;
    align-items: center;
    gap: 30px;
    padding-right: 25px;
  }
  .pro-navItem {
    color: white;
    font-size: 16px;
    text-decoration: none;
    transition: color 250ms ease, transform 250ms ease;
  }
  .pro-navItem:hover { color: var(--coc-green); transform: scale(1.1); }

  .pro-villageBtn {
    color: var(--gold);
    border: 2px solid var(--gold);
    padding: 5px 12px;
    border-radius: 10px;
    background: transparent;
    font-family: "Fira Code", monospace;
    font-size: 14px;
    cursor: pointer;
    transition: color 250ms ease, background 250ms ease;
    white-space: nowrap;
  }
  .pro-villageBtn:hover { color: #fff; background: var(--gold); }

  .pro-menuIcon {
    display: none;
    cursor: pointer;
    background: none;
    border: none;
    color: white;
    font-size: 28px;
    padding-right: 20px;
    line-height: 1;
    z-index: 201;
    position: relative;
  }

  @media only screen and (max-width: 768px) {
    .pro-menuIcon    { display: block; }
    .pro-nav-desktop { display: none; }
  }
`;

/* Mobile overlay — rendered via portal onto <body> to escape overflow:hidden */
const OVERLAY_STYLES = `
  .pro-nav-overlay {
    position: fixed;
    inset: 0;
    z-index: 199;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--dark-brown-grad);
    transition: clip-path 0.55s ease-out, -webkit-clip-path 0.55s ease-out,
                opacity 0.55s ease-out;
  }
  .pro-nav-overlay--closed {
    clip-path: circle(0px at calc(100% - 30px) 37px);
    -webkit-clip-path: circle(0px at calc(100% - 30px) 37px);
    pointer-events: none;
    opacity: 0;
  }
  .pro-nav-overlay--open {
    clip-path: circle(150vmax at calc(100% - 30px) 37px);
    -webkit-clip-path: circle(150vmax at calc(100% - 30px) 37px);
    pointer-events: auto;
    opacity: 1;
  }
  .pro-nav-overlay .pro-navItem {
    color: white;
    font-size: 28px;
    text-decoration: none;
    margin: 16px 0;
    font-family: "Fira Code", monospace;
    transition: color 200ms ease;
  }
  .pro-nav-overlay .pro-navItem:hover { color: var(--coc-green); }
  .pro-nav-overlay .pro-villageBtn {
    margin-top: 24px;
    font-size: 18px;
    padding: 10px 24px;
    color: var(--gold);
    border: 2px solid var(--gold);
    border-radius: 10px;
    background: transparent;
    font-family: "Fira Code", monospace;
    cursor: pointer;
    transition: color 200ms ease, background 200ms ease;
  }
  .pro-nav-overlay .pro-villageBtn:hover { color: #fff; background: var(--gold); }
`;

export default function ProNav({ onBack, onSwitchToGame }) {
  const [menuOpen, setMenuOpen] = useState(false);

  /* Lock body scroll while menu is open — prevents page-behind glitch on iOS */
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  const handleLogoClick = useCallback((e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleNavClick = useCallback((e, href) => {
    e.preventDefault();
    closeMenu();
    setTimeout(() => {
      const target = document.querySelector(href);
      if (!target) return;
      const navHeight = 74;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }, 50);
  }, [closeMenu]);

  const handleVillageClick = useCallback(() => {
    closeMenu();
    onSwitchToGame?.();
  }, [closeMenu, onSwitchToGame]);

  const overlayClass = `pro-nav-overlay ${menuOpen ? 'pro-nav-overlay--open' : 'pro-nav-overlay--closed'}`;

  return (
    <>
      <style>{HEADER_STYLES}</style>
      <style>{OVERLAY_STYLES}</style>

      {/* ── Fixed header bar ──────────────────────────────────── */}
      <header className="pro-header">
        <div className="pro-header__logo">
          <a
            href="#top"
            className="pro-logo-mark"
            onClick={handleLogoClick}
            aria-label="Scroll to top"
          >
            <img src={about.profilePhoto} alt={about.name} />
          </a>
        </div>

        {/* Hamburger — mobile only, sits above overlay (z-index 201) */}
        <button
          className="pro-menuIcon"
          onClick={() => setMenuOpen(o => !o)}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
        >
          {menuOpen ? '✕' : '☰'}
        </button>

        {/* Desktop inline nav */}
        <nav className="pro-nav-desktop" aria-label="Main navigation">
          {NAV_LINKS.map(({ label, href }) => (
            <a key={href} href={href} className="pro-navItem"
              onClick={e => handleNavClick(e, href)}>
              {label}
            </a>
          ))}
          <button className="pro-villageBtn" onClick={handleVillageClick}>
            ⚔️ Enter the Village
          </button>
        </nav>
      </header>

      {/* ── Mobile overlay — portalled to <body> ─────────────── */}
      {createPortal(
        <nav className={overlayClass} aria-label="Mobile navigation" aria-hidden={!menuOpen}>
          {NAV_LINKS.map(({ label, href }) => (
            <a key={href} href={href} className="pro-navItem"
              onClick={e => handleNavClick(e, href)}>
              {label}
            </a>
          ))}
          <button className="pro-villageBtn" onClick={handleVillageClick}>
            ⚔️ Enter the Village
          </button>
        </nav>,
        document.body
      )}
    </>
  );
}

ProNav.propTypes = {
  onBack:         PropTypes.func,
  onSwitchToGame: PropTypes.func,
};
