'use client';
import { useEffect, type RefObject } from 'react';

/**
 * Scroll progress of a section, rAF-throttled.
 * 'pin'  — 0 when the section top hits the viewport top, 1 when its bottom hits the viewport bottom (sticky stages).
 * 'pass' — 0 when the top enters at the bottom of the viewport, 1 when the bottom leaves at the top.
 */
export function useProgress(ref: RefObject<HTMLElement | null>, mode: 'pin' | 'pass', cb: (p: number, el: HTMLElement) => void, deps: unknown[] = []) {
  useEffect(() => {
    let raf = 0;
    const f = () => {
      raf = 0;
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect(), vh = innerHeight;
      const p = mode === 'pin' ? -r.top / Math.max(1, r.height - vh) : (vh - r.top) / (r.height + vh);
      cb(Math.max(0, Math.min(1, p)), el);
    };
    const q = () => { if (!raf) raf = requestAnimationFrame(f); };
    f();
    addEventListener('scroll', q, { passive: true });
    addEventListener('resize', q);
    return () => { cancelAnimationFrame(raf); removeEventListener('scroll', q); removeEventListener('resize', q); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
