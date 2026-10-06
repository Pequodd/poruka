'use client';
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/hooks';

type Api = { setStep: (i: number) => void; dispose: () => void };

/** Transparent three.js canvas; three is loaded lazily so it never blocks first paint. */
export function Process3D({ step, className, rootMargin = '400px 0px' }: { step: number; className?: string; rootMargin?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const api = useRef<Api | null>(null);
  const stepRef = useRef(step);
  stepRef.current = step;

  useEffect(() => {
    let dead = false;
    const el = ref.current;
    if (!el) return;
    // Mount once the section approaches the viewport.
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || api.current) return;
      io.disconnect();
      import('@/lib/processScene').then(({ mountProcess }) => {
        if (dead || !ref.current) return;
        try {
          api.current = mountProcess(ref.current, prefersReducedMotion());
          api.current.setStep(stepRef.current);
        } catch { /* no WebGL — leave the slot empty */ }
      });
    }, { rootMargin });
    io.observe(el);
    return () => { dead = true; io.disconnect(); api.current?.dispose(); api.current = null; };
  }, [rootMargin]);

  useEffect(() => { api.current?.setStep(step); }, [step]);

  return <canvas ref={ref} aria-hidden="true" className={className} style={{ display: 'block', width: '100%', height: '100%' }} />;
}
