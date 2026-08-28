import { useRef, useState, useEffect } from 'react';

/**
 * useScrollFade — fires an IntersectionObserver once, then disconnects.
 * Returns [ref, isVisible].
 *
 * If prefers-reduced-motion is active the element is immediately marked
 * visible so no animation plays.
 *
 * @param {string} direction - 'up' | 'down' | 'left' | 'right'
 * @param {number} threshold - 0–1, default 0.15
 */
export function useScrollFade(direction = 'up', threshold = 0.15) {
  const ref = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Respect reduced-motion preference — skip animation entirely
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
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
