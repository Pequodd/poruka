'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from '@/lib/hooks';
import { Letters } from './Letters';
import v from './V7.module.css';
import s from './HeroAlt.module.css';

/**
 * Hero, variant 6 «Сцепка»: «Дизайн» top-left, «и разработка сайтов.» bottom-right, and a chain of glass links
 * stretched diagonally between them — «Порука» as the bond between design and development.
 */
export function HeroChain() {
  const canvas = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    let api: { setActive: (on: boolean) => void; dispose: () => void } | null = null;
    let dead = false;
    import('@/lib/chainScene').then(({ mountChain }) => {
      if (dead || !canvas.current) return;
      try { api = mountChain(canvas.current, prefersReducedMotion(), matchMedia('(max-width: 767px)').matches ? 7 : 9); } catch { /* no WebGL — type only */ }
    });
    const io = new IntersectionObserver(([e]) => api?.setActive(e.isIntersecting));
    io.observe(el);
    return () => { dead = true; io.disconnect(); api?.dispose(); };
  }, []);
  return (
    <section className={s.chainHero} data-orbit="0 -4 1.02 0 0" data-orbit-m="0 -10 1.05 0 0">
      <canvas ref={canvas} className={s.chainCanvas} aria-hidden="true" />
      <h1 className={s.chainTitle} aria-label="Дизайн и разработка сайтов">
        <span className={s.chainA} aria-hidden="true"><Letters text="Дизайн" from={0} /></span>
        <span className={s.chainB} aria-hidden="true">
          <span><Letters text="и разработка" from={6} /></span>
          <span><Letters text="сайтов" from={17} tail={<span className={`${v.ltr} ${v.seal}`} style={{ ['--i' as string]: 23 }}>.</span>} /></span>
        </span>
      </h1>
      <div className={s.chainFoot}>
        <p className={s.chainLead} style={{ ['--d' as string]: '1100ms' }} data-hero>Связываем дизайн и разработку в одну работу — от исследования и прототипа до запуска и поддержки.</p>
        <div className={v.heroBtns} style={{ ['--d' as string]: '1250ms' }} data-hero>
          <a className={v.ctaMain} href="#contact">Обсудить проект<span className={v.ctaIcon} aria-hidden="true">↗</span></a>
          <Link className={v.ctaInk} href="/portfolio/">Смотреть кейсы</Link>
        </div>
      </div>
    </section>
  );
}
