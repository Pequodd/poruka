'use client';
import { useEffect, useRef } from 'react';
import { asset } from '@/lib/asset';
import { useIsMobile, useReducedMotion } from '@/lib/hooks';
import { Placeholder } from '../ui/Placeholder';
import { BrowserFrame, DESKTOP_PH, MOBILE_PH } from './Frames';
import s from './Case.module.css';

const TOP = 80;
/** Page scroll per pixel of screenshot: 1 → the shot moves with the wheel, like scrolling the real site. */
const PACE = 1;

/**
 * A whole long page inside a browser frame. The stage is sticky (top 80, height 100vh − 120); the track is as long as
 * the screenshot needs (its scrollable height × PACE, at least 200vh), so long pages don't fly past.
 * Progress 0→1 over the track moves the screenshot from its top to its bottom; at 1 the stage bottom meets
 * the track bottom, so the next block follows with no gap. Reduced motion: static frame with native scroll.
 */
export function BrowserScroll({ url, src, mobileSrc, caption }: { url?: string; src?: string; mobileSrc?: string; caption: React.ReactNode }) {
  const mobile = useIsMobile();
  const rm = useReducedMotion();
  const track = useRef<HTMLDivElement>(null);
  const vp = useRef<HTMLDivElement>(null);
  const mover = useRef<HTMLDivElement>(null);
  const counter = useRef<HTMLSpanElement>(null);
  const shotSrc = mobile ? mobileSrc : src;

  useEffect(() => {
    if (rm) return;
    let raf = 0;
    const f = () => {
      raf = 0;
      const el = track.current, v = vp.current, m = mover.current;
      if (!el || !v || !m) return;
      const stageH = window.innerHeight - 120;
      const max = Math.max(0, m.offsetHeight - v.clientHeight);
      const want = Math.round(Math.max(window.innerHeight * 2, stageH + max * PACE));
      if (Math.abs(el.offsetHeight - want) > 2) el.style.height = `${want}px`;
      const r = el.getBoundingClientRect();
      const span = r.height - stageH;
      const p = span > 0 ? Math.max(0, Math.min(1, (TOP - r.top) / span)) : 0;
      m.style.transform = `translate3d(0, ${(-max * p).toFixed(1)}px, 0)`;
      if (counter.current) counter.current.textContent = `(${Math.round(p * 100)}%)`;
    };
    const q = () => { if (!raf) raf = requestAnimationFrame(f); };
    f();
    window.addEventListener('scroll', q, { passive: true });
    window.addEventListener('resize', q);
    const ro = new ResizeObserver(q);
    if (mover.current) ro.observe(mover.current);
    return () => { window.removeEventListener('scroll', q); window.removeEventListener('resize', q); ro.disconnect(); cancelAnimationFrame(raf); };
  }, [rm, mobile]);

  const shot = shotSrc ? (
    <img src={asset(shotSrc)} alt="" className={s.shot} loading="lazy" />
  ) : (
    <Placeholder ratio="auto" label={mobile ? MOBILE_PH : DESKTOP_PH} className={s.longPh}>
      {[1, 2, 3, 4, 5, 6, 7].map((i) => <span key={i} aria-hidden="true" className={`${s.mono} ${s.ruler}`} style={{ top: i * 400 }}>{i * 400} PX</span>)}
    </Placeholder>
  );

  if (rm)
    return (
      <div>
        {caption}
        <BrowserFrame url={url} className={s.staticFrame}>{shot}</BrowserFrame>
      </div>
    );

  return (
    <div>
      {caption}
      <div ref={track} className={s.track}>
        <div className={s.stage}>
          <div className={`${s.mono} ${s.counter}`}><span ref={counter}>(0%)</span></div>
          <BrowserFrame url={url} viewportRef={vp} className={s.stageFrame}>
            <div ref={mover} className={s.mover}>{shot}</div>
          </BrowserFrame>
        </div>
      </div>
    </div>
  );
}
