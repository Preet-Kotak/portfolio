import { useRef, useState, useEffect } from 'react';

/**
 * useScrollFade — fires an IntersectionObserver once, then disconnects.
 * Returns [ref, isVisible].
 *
 * If prefers-reduced-motion is active the element is immediately marked
 * visible so no animation plays.
 *
 * @param {string} _direction - 'up' | 'down' | 'left' | 'right' (used by callers for CSS)
 * @param {number} threshold  - 0–1, default 0.15
 */
// eslint-disable-next-line no-unused-vars
export function useScrollFade(_direction = 'up', threshold = 0.15) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Respect reduced-motion preference — skip animation entirely.
    // setState here is intentional: we're syncing with a media query (external system).
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true); // eslint-disable-line react-hooks/set-state-in-effect
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [ref, isVisible];
}
