'use client';
import { useEffect, useState, useSyncExternalStore } from 'react';

function subscribeMQ(q: string) {
  return (cb: () => void) => {
    const m = window.matchMedia(q);
    m.addEventListener('change', cb);
    return () => m.removeEventListener('change', cb);
  };
}

/** SSR-safe media query: returns `fallback` on the server and during hydration. */
export function useMediaQuery(q: string, fallback = false) {
  return useSyncExternalStore(subscribeMQ(q), () => window.matchMedia(q).matches, () => fallback);
}

export const MOBILE_Q = '(max-width: 767px)';
export const useIsMobile = () => useMediaQuery(MOBILE_Q);
export const useReducedMotion = () => useMediaQuery('(prefers-reduced-motion: reduce)');

/** Flips to true after `delay` ms — drives on-load reveals. */
export function useOn(delay = 200) {
  const [on, setOn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setOn(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return on;
}

export function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
