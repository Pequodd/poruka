'use client';
import { useEffect } from 'react';
import { prefersReducedMotion } from '@/lib/hooks';

/**
 * v7 page runtime: switches the header to glass (html[data-look]) and drives blur-in reveals —
 * every [data-rv] element gets data-in once it enters the viewport. Hidden state only applies
 * when html[data-rv] is set, so content stays visible without JS.
 */
export function Look() {
  useEffect(() => {
    const html = document.documentElement;
    html.dataset.look = 'glass';
    html.dataset.rv = '1';
    const els = document.querySelectorAll<HTMLElement>('[data-rv]');
    if (prefersReducedMotion()) { els.forEach((e) => e.setAttribute('data-in', '')); return () => { delete html.dataset.look; delete html.dataset.rv; }; }
    const io = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.setAttribute('data-in', ''); io.unobserve(e.target); }
    }), { rootMargin: '0px 0px -12% 0px' });
    els.forEach((e) => io.observe(e));
    return () => { io.disconnect(); delete html.dataset.look; delete html.dataset.rv; };
  }, []);
  return null;
}
