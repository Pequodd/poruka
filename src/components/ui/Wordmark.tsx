'use client';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

type Geo = { fs: number; left: number; top: number; visible: number; capH: number };

const useIso = typeof window === 'undefined' ? useEffect : useLayoutEffect;

/** «ПОРУКА» fitted exactly to the container width (ink bounds), bottom-cropped by `crop` of the cap height. Letters rise on view. */
export function Wordmark({ text = 'ПОРУКА', color = 'var(--text-on-ink)', crop = 0.12 }: { text?: string; color?: string; crop?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const [g, setG] = useState<Geo | null>(null);
  const [up, setUp] = useState(false);

  useIso(() => {
    const el = ref.current;
    if (!el) return;
    let dead = false;
    const fit = () => {
      if (dead) return;
      const w = el.clientWidth;
      if (!w) return;
      const family = getComputedStyle(el).fontFamily;
      const c = document.createElement('canvas').getContext('2d')!;
      c.font = `500 100px ${family}`;
      const hasLS = 'letterSpacing' in c;
      if (hasLS) (c as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = '-6px';
      const m = c.measureText(text);
      let inkW = m.actualBoundingBoxLeft + m.actualBoundingBoxRight;
      if (!hasLS) inkW -= 6 * (text.length - 1);
      const k = w / inkW;
      const A = m.fontBoundingBoxAscent, D = m.fontBoundingBoxDescent, cap = m.actualBoundingBoxAscent;
      const half = (100 - (A + D)) / 2;
      const capTop = (half + A - cap) * k;
      const capH = cap * k;
      setG({ fs: 100 * k, left: m.actualBoundingBoxLeft * k, top: -capTop, visible: capH * (1 - crop), capH });
    };
    fit();
    document.fonts?.ready.then(fit);
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => { dead = true; ro.disconnect(); };
  }, [text, crop]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setUp(true); io.disconnect(); } }, { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} role="img" aria-label={text} style={{ position: 'relative', width: '100%', height: g ? g.visible : '15vw', overflow: 'hidden', fontFamily: 'var(--font-sans)' }}>
      {g && (
        <div aria-hidden="true" style={{ position: 'absolute', left: g.left, top: g.top, display: 'flex', whiteSpace: 'nowrap', fontSize: g.fs, lineHeight: 1, letterSpacing: '-0.06em', fontWeight: 500, color }}>
          {text.split('').map((ch, i) => (
            <span key={i} style={{ display: 'inline-block', transform: up ? 'none' : `translateY(${g.capH * 1.1}px)`, transition: `transform var(--dur-reveal) var(--ease) ${i * 60}ms` }}>{ch}</span>
          ))}
        </div>
      )}
    </div>
  );
}
