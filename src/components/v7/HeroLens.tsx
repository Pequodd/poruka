'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/hooks';
import { Letters } from './Letters';
import { useLoopVideo } from './useLoopVideo';
import v from './V7.module.css';
import s from './HeroAlt.module.css';

/**
 * Hero, variant 5 «Линза»: a paper screen with the giant title; the cursor is a round fluted-glass lens —
 * the loop shows only through it, as if you looked through the glass. On touch screens the lens drifts on its own.
 */
export function HeroLens() {
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  useLoopVideo(video);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let x = 0.62, y = 0.42, tx = x, ty = y, raf = 0, last = 0, auto = !matchMedia('(hover: hover)').matches, idle = 0;
    const set = () => { el.style.setProperty('--mx', `${(x * 100).toFixed(2)}%`); el.style.setProperty('--my', `${(y * 100).toFixed(2)}%`); };
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect();
      tx = (e.clientX - r.left) / r.width; ty = (e.clientY - r.top) / r.height; idle = 0;
    };
    const rm = prefersReducedMotion();
    const tick = (t: number) => {
      raf = requestAnimationFrame(tick);
      const dt = Math.min(0.05, (t - last) / 1000); last = t; idle += dt;
      if ((auto || idle > 4) && !rm) { tx = 0.55 + Math.sin(t / 2600) * 0.28; ty = 0.5 + Math.sin(t / 1900) * 0.22; }
      x += (tx - x) * 0.09; y += (ty - y) * 0.09; set();
    };
    set();
    el.addEventListener('pointermove', onMove);
    raf = requestAnimationFrame(tick);
    return () => { cancelAnimationFrame(raf); el.removeEventListener('pointermove', onMove); };
  }, []);
  return (
    <section ref={ref} className={s.lensHero} data-orbit="0 -4 1.02 0 0" data-orbit-m="0 -10 1.05 0 0">
      <div className={s.lensMedia} aria-hidden="true"><video ref={video} muted loop playsInline preload="auto" /></div>
      <span className={s.lensRing} aria-hidden="true" />
      <h1 className={s.lensTitle} aria-label="Дизайн и разработка сайтов">
        <span aria-hidden="true"><Letters text="Дизайн и" from={0} /></span>
        <span aria-hidden="true"><Letters text="разработка" from={8} /></span>
        <span aria-hidden="true"><Letters text="сайтов" from={18} tail={<span className={`${v.ltr} ${s.lensDot}`} style={{ ['--i' as string]: 24 }}>.</span>} /></span>
      </h1>
      <div className={s.lensFoot}>
        <p className={s.lensLead} style={{ ['--d' as string]: '1100ms' }} data-hero>Для малого и среднего бизнеса — от исследования и прототипа до запуска и поддержки. WordPress, 1С‑Битрикс, Next.js.</p>
        <div className={v.heroBtns} style={{ ['--d' as string]: '1250ms' }} data-hero>
          <a className={v.ctaMain} href="#contact">Обсудить проект<span className={v.ctaIcon} aria-hidden="true">↗</span></a>
          <Link className={v.ctaInk} href="/portfolio/">Смотреть кейсы</Link>
        </div>
      </div>
    </section>
  );
}
