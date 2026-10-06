'use client';
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/hooks';

/** Lazy three.js seal; mounts when the canvas nears the viewport, after fonts are ready (ring text is drawn on a canvas). */
export function Seal3D({ className, center }: { className?: string; center?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    let dead = false;
    let api: { dispose: () => void } | null = null;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      Promise.all([import('@/lib/sealScene'), document.fonts?.ready]).then(([{ mountSeal }]) => {
        if (dead || !ref.current) return;
        try { api = mountSeal(ref.current, prefersReducedMotion(), center); } catch { /* no WebGL */ }
      });
    }, { rootMargin: '200px 0px' });
    io.observe(el);
    return () => { dead = true; io.disconnect(); api?.dispose(); };
  }, [center]);
  return <canvas ref={ref} className={className} aria-label="Печать «Порука»: ручаемся за результат" role="img" style={{ display: 'block', width: '100%', height: '100%', cursor: 'pointer' }} />;
}
