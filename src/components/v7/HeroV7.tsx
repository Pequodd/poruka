'use client';
import { useRef } from 'react';
import { asset } from '@/lib/asset';
import Link from 'next/link';
import { Letters } from './Letters';
import { useLoopVideo } from './useLoopVideo';
import { useProgress } from './useProgress';
import s from './V7.module.css';

/**
 * v7 hero: a looping fluted-glass video fills the screen; the giant title assembles letter by letter and is blended
 * with «difference», so the moving light shows through the glyphs inverted. Lead and CTAs sit right under it.
 */
export function HeroV7() {
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  useProgress(ref, 'pass', (p, el) => el.style.setProperty('--hp', Math.max(0, p * 2 - 1).toFixed(3)));

  // Background loop: vertical crop on phones; with reduced motion only the poster is shown. Paused off-screen.
  useLoopVideo(video);
  return (
    <section ref={ref} className={s.hero} data-orbit="0 -4 1.02 0 0" data-orbit-m="0 -10 1.05 0 0">
      <div className={s.heroMedia} aria-hidden="true">
        <video ref={video} muted loop playsInline preload="auto" poster={asset('/assets/v7/hero-poster.jpg')} />
      </div>
      <h1 className={s.heroTitle} aria-label="Дизайн и разработка сайтов">
        <span className={s.heroL1} aria-hidden="true"><Letters text="Дизайн и" from={0} /></span>
        <span className={s.heroL2} aria-hidden="true"><Letters text="разработка" from={8} tail={<span className={`${s.ltr} ${s.seal}`} style={{ ['--i' as string]: 18 }}>.</span>} /></span>
      </h1>

      <div className={s.heroFoot}>
        <p className={s.heroLead} style={{ ['--d' as string]: '1300ms' }} data-hero>Сайты для малого и среднего бизнеса — от исследования и прототипа до запуска и поддержки. WordPress, 1С‑Битрикс, Next.js.</p>
        <div className={s.heroCta} style={{ ['--d' as string]: '1450ms' }} data-hero>
          <div className={s.heroBtns}>
            <a className={s.ctaMain} href="#contact">Обсудить проект<span className={s.ctaIcon} aria-hidden="true">↗</span></a>
            <Link className={s.ctaInk} href="/portfolio/">Смотреть работы</Link>
          </div>
          <span className={`mono ${s.ctaNote}`}><span className={s.liveDot} aria-hidden="true" />На связи · ответ за день</span>
        </div>
      </div>
      <span className={`mono ${s.scrollHint}`} style={{ ['--d' as string]: '1700ms' }} data-hero>Листайте</span>
    </section>
  );
}
