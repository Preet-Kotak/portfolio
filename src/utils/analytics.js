/**
 * analytics.js
 * Thin wrapper around react-ga4.
 *
 * Measurement ID is read from VITE_GA_MEASUREMENT_ID (set in .env).
 * If the variable is missing (local dev without .env) every call is a no-op,
 * so the rest of the app never has to guard against undefined.
 */
import ReactGA_module from 'react-ga4';
// react-ga4's CJS build wraps the class under .default in production bundles.
// Unwrap it so ReactGA.initialize always exists regardless of bundler behaviour.
const ReactGA = ReactGA_module?.default ?? ReactGA_module;

const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;

let initialized = false;

/** Call once at app startup. */
export function initAnalytics() {
  if (!MEASUREMENT_ID) return;
  ReactGA.initialize(MEASUREMENT_ID);
  initialized = true;
}

/** Track a virtual page-view (useful if the app ever becomes multi-"page"). */
export function trackPageView(path = window.location.pathname) {
  if (!initialized) return;
  ReactGA.send({ hitType: 'pageview', page: path });
}

/**
 * Track a custom event.
 * @param {string} category  – e.g. 'Navigation'
 * @param {string} action    – e.g. 'Building Clicked'
 * @param {string} [label]   – e.g. 'townhall'
 */
export function trackEvent(category, action, label) {
  if (!initialized) return;
  ReactGA.event({ category, action, label });
}
