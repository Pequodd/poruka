'use client';
import Link from 'next/link';
import { useRef } from 'react';
import { caseHref, PROJECTS } from '@/data/projects';
import { asset } from '@/lib/asset';
import { Letters } from './Letters';
import { useLoopVideo } from './useLoopVideo';
import { useProgress } from './useProgress';
import v from './V7.module.css';
import s from './HeroAlt.module.css';

/**
 * Hero, variant 3 «Буквы»: the page stays paper, the glass loop shows only inside the giant title
 * (a paper layer with ink letters blended «lighten» over the video). Under it — lead, CTAs and a slow ribbon of case covers.
 */
export function HeroType() {
  const ref = useRef<HTMLElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  useLoopVideo(video);
  useProgress(ref, 'pass', (p, el) => el.style.setProperty('--hp', Math.max(0, p * 2 - 1).toFixed(3)));
  const cases = PROJECTS.filter((p) => p.image);

  return (
    <section ref={ref} className={s.typeHero} data-orbit="0 -4 1.02 0 0" data-orbit-m="0 -10 1.05 0 0">
      <div className={s.typeBox}>
        <div className={s.typeMedia} aria-hidden="true"><video ref={video} muted loop playsInline preload="auto" /></div>
        <div className={s.typeInk}>
          <h1 className={s.typeTitle} aria-label="Дизайн и разработка сайтов">
            <span className={s.typeL1} aria-hidden="true"><Letters text="Дизайн и" from={0} /></span>
            <span className={s.typeL2} aria-hidden="true"><Letters text="разработка" from={8} tail={<span className={`${v.ltr} ${s.typeDot}`} style={{ ['--i' as string]: 18 }}>.</span>} /></span>
          </h1>
        </div>
      </div>

      <div className={s.typeFoot}>
        <p className={s.typeLead} style={{ ['--d' as string]: '1100ms' }} data-hero>Сайты для малого и среднего бизнеса — от исследования и прототипа до запуска и поддержки. WordPress, 1С‑Битрикс, Next.js.</p>
        <div className={v.heroBtns} style={{ ['--d' as string]: '1250ms' }} data-hero>
          <a className={v.ctaMain} href="#contact">Обсудить проект<span className={v.ctaIcon} aria-hidden="true">↗</span></a>
          <Link className={v.ctaInk} href="/portfolio/">Смотреть работы</Link>
        </div>
      </div>

      {cases.length > 0 && (
        <div className={s.ribbon} style={{ ['--d' as string]: '1450ms' }} data-hero>
          <ul className={s.ribbonTrack} style={{ ['--n' as string]: cases.length }}>
            {[...cases, ...cases].map((p, i) => (
              <li key={i} aria-hidden={i >= cases.length || undefined}>
                <Link href={caseHref(p)} className={s.tile} tabIndex={i >= cases.length ? -1 : undefined}>
                  <img src={asset(p.image!)} alt="" loading={i < 4 ? 'eager' : 'lazy'} />
                  <span className={s.tileLabel}><b>{p.title}</b><span>{p.result}</span></span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
